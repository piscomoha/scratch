import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Clock, FileText, Calendar, Zap, Loader2, UploadCloud } from 'lucide-react';
import api from '../../api/axios';
import CustomSelect from '../../components/ui/CustomSelect';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';
import { useQueryClient } from '@tanstack/react-query';

const PresencesList = () => {
  const { user } = useAuth();
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  // Extract filieres and groups from formateur's affectations
  const affectations = user?.affectations || [];
  
  // Unique filieres from affectations
  const formateurFilieresMap = new Map();
  affectations.forEach(aff => {
    if (aff.filiere) {
      formateurFilieresMap.set(aff.filiere.id, aff.filiere);
    }
  });
  const formateurFilieres = Array.from(formateurFilieresMap.values());

  const [filiereId, setFiliereId] = useState('');
  const [groupe, setGroupe] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [dateSeance, setDateSeance] = useState(new Date().toISOString().split('T')[0]);
  const [heureDebut, setHeureDebut] = useState('08:30');
  const [heureFin, setHeureFin] = useState('11:00');
  
  // Available groups for the selected filiere
  const availableGroupes = filiereId 
    ? Array.from(new Set(affectations.filter(aff => String(aff.filiere_id) === String(filiereId)).map(aff => aff.groupe)))
    : [];

  const [modules, setModules] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);
  const [presencesForm, setPresencesForm] = useState({});
  const [presenceIds, setPresenceIds] = useState([]);
  const [sessionShared, setSessionShared] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Reset group and modules when filiere changes
  useEffect(() => {
    setGroupe('');
    setModuleId('');
    setModules([]);
    setStagiaires([]);
    if (filiereId) {
      api.get(`/modules?filiere_id=${filiereId}`).then(({ data }) => setModules(data.data));
    }
  }, [filiereId]);

  const chargerSeance = async () => {
    if (!groupe || !moduleId || !dateSeance) {
      notify('error', 'Paramètres requis', 'Veuillez sélectionner un groupe, un module et une date.');
      return;
    }

    setLoading(true);
    try {
      const stagsRes = await api.get(`/stagiaires?groupe=${groupe}&per_page=100`);
      const stags = stagsRes.data.data;

      const presencesRes = await api.get(`/presences?module_id=${moduleId}&date=${dateSeance}&groupe=${groupe}`);
      const presencesExistantes = presencesRes.data.data;

      const formState = {};
      let allShared = presencesExistantes.length > 0;

      stags.forEach(stag => {
        const existante = presencesExistantes.find(p => p.stagiaire_id === stag.id);
        formState[stag.id] = {
          statut: existante ? existante.statut : 'present',
          motif: existante?.motif || '',
        };

        if (existante && !existante.shared_with_admin) {
          allShared = false;
        }
      });

      setStagiaires(stags);
      setPresencesForm(formState);
      setPresenceIds(presencesExistantes.map(p => p.id));
      setSessionShared(allShared && presencesExistantes.length > 0);
      
    } catch {
      notify('error', 'Erreur de chargement', 'Impossible de récupérer la liste des stagiaires pour cette séance.');
    } finally {
      setLoading(false);
    }
  };

  const setStatut = (stagiaireId, statut) => {
    setPresencesForm(prev => ({
      ...prev,
      [stagiaireId]: { ...prev[stagiaireId], statut }
    }));
  };

  const sauvegarderPresences = async () => {
    setLoading(true);
    try {
      const payload = {
        module_id: moduleId,
        date_seance: dateSeance,
        heure_debut: heureDebut,
        heure_fin: heureFin,
        presences: stagiaires.map(stag => ({
          stagiaire_id: stag.id,
          statut: presencesForm[stag.id].statut,
          motif: presencesForm[stag.id].motif,
        }))
      };

      const { data: bulkResponse } = await api.post('/presences/bulk', payload);
      notify('success', 'Pointage enregistré', `Le pointage pour le groupe ${groupe} a été validé avec succès.`);
      
      // Capture presence IDs directly from response for all statuses
      if (bulkResponse.presence_ids && bulkResponse.presence_ids.length > 0) {
        setPresenceIds(bulkResponse.presence_ids);
        setSessionShared(false);
      }
      
      // Success animation overlay trigger
      setShowSuccessOverlay(true);
      setTimeout(() => setShowSuccessOverlay(false), 3000);

      // Invalidate React Query caches to make dashboards reactive in real-time
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['presences-summary'] });

      // Reload presences to ensure all statuses are properly synced
      await chargerSeance();
    } catch (error) {
      const err = error.response?.data?.message || 'Erreur lors de la sauvegarde';
      notify('error', 'Erreur de pointage', err);
    } finally {
      setLoading(false);
    }
  };

  const statutConfig = {
    present: { label: 'Présent', color: 'emerald', icon: <Check size={18} /> },
    absent: { label: 'Absent', color: 'rose', icon: <X size={18} /> },
    retard: { label: 'Retard', color: 'amber', icon: <Clock size={18} /> },
    justifie: { label: 'Justifié', color: 'blue', icon: <FileText size={18} /> },
  };

  const partagerAvecAdmin = async () => {
    if (!presenceIds.length) {
      notify('error', 'Aucune présence', "Veuillez d'abord enregistrer le pointage avant de le partager.");
      return;
    }

    setShareLoading(true);
    try {
      await api.post('/presences/share', { presence_ids: presenceIds });
      notify('success', 'Partagé', 'Le pointage a été transmis à l\'administration.');
      setSessionShared(true);
      await chargerSeance();
    } catch (error) {
      const err = error.response?.data?.message || 'Impossible de partager le pointage.';
      notify('error', 'Erreur de partage', err);
    } finally {
      setShareLoading(false);
    }
  };

  const getStatutColors = (statut, isActive) => {
    const config = statutConfig[statut];
    if (!isActive) return 'text-500 hover:text-100 hover:bg-overlay';
    
    switch (config.color) {
      case 'emerald': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'rose': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'amber': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'blue': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return '';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Animated Success Overlay */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md"
          >
            <Motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -15 }}
              className="glass rounded-3xl p-8 max-w-sm text-center flex flex-col items-center justify-center shadow-2xl border-2 border-emerald-500/25 mx-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 animate-pulse-ring">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-xl font-black text-100 mb-2">Pointage Enregistré !</h3>
              <p className="text-400 text-sm leading-relaxed">
                Le pointage pour le groupe <strong className="text-primary font-bold">{groupe}</strong> a été validé et transmis à l'administration en temps réel.
              </p>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#2E8B57', borderRadius:1 }} />
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#8C9BA8', borderRadius:1 }} />
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#2660A4', borderRadius:1 }} />
            <span className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Espace Formateur</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-100">Faire l'absence</h1>
          <p className="text-400 text-sm mt-0.5">Saisie rapide des présences pour vos groupes affectés</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Filière</label>
            <CustomSelect
              options={[
                { value: '', label: 'Sélectionner une filière' },
                ...formateurFilieres.map(f => ({ value: f.id, label: f.code }))
              ]}
              value={filiereId}
              onChange={setFiliereId}
              placeholder="Filière"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Groupe (affecté)</label>
            <CustomSelect
              options={[
                { value: '', label: 'Sélectionner un groupe' },
                ...availableGroupes.map(g => ({ value: g, label: g }))
              ]}
              value={groupe}
              onChange={setGroupe}
              disabled={!filiereId}
              placeholder="Groupe"
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Module</label>
            <CustomSelect
              options={[
                { value: '', label: 'Sélectionner un module' },
                ...modules.map(m => ({ value: m.id, label: m.intitule }))
              ]}
              value={moduleId}
              onChange={setModuleId}
              disabled={!filiereId}
              placeholder="Module pédagogique"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-8 pt-8 border-t border-border items-end">
          <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500" />
                <input 
                  type="date" 
                  className="w-full bg-input border border-border rounded-xl py-2.5 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={dateSeance} 
                  onChange={(e) => setDateSeance(e.target.value)} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Horaires</label>
              <div className="flex items-center gap-2">
                <input 
                  type="time" 
                  className="w-full bg-input border border-border rounded-xl py-2.5 px-3 text-xs text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={heureDebut} 
                  onChange={(e) => setHeureDebut(e.target.value)} 
                />
                <span className="text-500">-</span>
                <input 
                  type="time" 
                  className="w-full bg-input border border-border rounded-xl py-2.5 px-3 text-xs text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={heureFin} 
                  onChange={(e) => setHeureFin(e.target.value)} 
                />
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex justify-end">
            <button 
              onClick={chargerSeance} 
              disabled={loading}
              className="btn-primary py-3.5 px-8"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
              Démarrer le pointage
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Grid */}
      <AnimatePresence mode="wait">
        {stagiaires.length > 0 && (
          <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-100 tracking-tight flex items-center gap-4">
                  <div className="w-1 h-8 bg-primary rounded-full" />
                  Liste de présence
                  <span className="text-sm font-medium text-500 bg-overlay px-3 py-1 rounded-full border border-border">
                    {stagiaires.length} stagiaires
                  </span>
                </h2>
                {presenceIds.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center gap-3 text-sm">
                    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 ${sessionShared ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-amber-500/10 text-amber-500 border-amber-500/30'}`}>
                      <UploadCloud className="w-4 h-4" />
                      {sessionShared ? 'Séance partagée avec l’administration' : 'Séance non partagée — partagez avant 6 jours'}
                    </span>
                    {!sessionShared && (
                      <button
                        type="button"
                        onClick={partagerAvecAdmin}
                        disabled={shareLoading || loading}
                        className="btn-secondary inline-flex items-center gap-2 px-4 py-2"
                      >
                        {shareLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                        Partager à l'administration
                      </button>
                    )}
                    <p className="text-xs text-400 mt-1">
                      Si ce pointage n'est pas partagé, il deviendra visible à l'administration automatiquement après 6 jours.
                    </p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={sauvegarderPresences} 
                disabled={loading || user?.role === 'stagiaire'}
                className="btn-primary px-8 py-3.5"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check size={20} strokeWidth={3} />}
                Enregistrer le pointage
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stagiaires.map((stag, index) => {
                const currentStatut = presencesForm[stag.id]?.statut;
                return (
                  <Motion.div 
                    key={stag.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className={`glass rounded-3xl p-6 border-2 transition-all duration-300 relative group
                      ${currentStatut === 'present' ? 'border-emerald-500/20 bg-emerald-500/[0.02]' : ''}
                      ${currentStatut === 'absent' ? 'border-rose-500/20 bg-rose-500/[0.02]' : ''}
                      ${currentStatut === 'retard' ? 'border-amber-500/20 bg-amber-500/[0.02]' : ''}
                      ${currentStatut === 'justifie' ? 'border-blue-500/20 bg-blue-500/[0.02]' : ''}
                    `}
                  >
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center font-black text-2xl mb-4 transition-all duration-300
                        ${currentStatut === 'present' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-overlay text-500'}
                        group-hover:scale-110
                      `}>
                        {stag.nom_complet.charAt(0)}
                      </div>
                      <h4 className="font-black text-100 truncate w-full">{stag.nom_complet}</h4>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-500 mt-1">{stag.code_massar}</p>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-1 p-1 bg-overlay rounded-2xl border border-border">
                      {Object.entries(statutConfig).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => setStatut(stag.id, key)}
                          disabled={user?.role === 'stagiaire'}
                          className={`
                            py-2.5 flex justify-center items-center rounded-xl transition-all duration-300 border border-transparent cursor-pointer
                            ${getStatutColors(key, currentStatut === key)}
                          `}
                          title={config.label}
                        >
                          {config.icon}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {(currentStatut === 'absent' || currentStatut === 'justifie' || currentStatut === 'retard') && (
                        <Motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          <input 
                            type="text" 
                            placeholder="Motif ou remarque..."
                            className="mt-4 w-full bg-input border border-border rounded-xl px-4 py-2.5 text-xs text-100 focus:outline-none focus:border-primary transition-all placeholder:text-500"
                            value={presencesForm[stag.id]?.motif || ''}
                            onChange={e => setPresencesForm(prev => ({...prev, [stag.id]: {...prev[stag.id], motif: e.target.value}}))}
                          />
                        </Motion.div>
                      )}
                    </AnimatePresence>
                  </Motion.div>
                );
              })}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PresencesList;
