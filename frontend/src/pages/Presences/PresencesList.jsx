import { useState, useEffect } from 'react';
import { useFilieres } from '../../hooks/useQueries';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Clock, FileText, Calendar, Users, Zap, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import CustomSelect from '../../components/ui/CustomSelect';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';

const PresencesList = () => {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [filiereId, setFiliereId] = useState('');
  const [groupe, setGroupe] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [dateSeance, setDateSeance] = useState(new Date().toISOString().split('T')[0]);
  const [heureDebut, setHeureDebut] = useState('08:30');
  const [heureFin, setHeureFin] = useState('11:00');
  
  const [modules, setModules] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);
  const [presencesForm, setPresencesForm] = useState({});
  const [loading, setLoading] = useState(false);

  const { data: filieres } = useFilieres();

  useEffect(() => {
    if (filiereId) {
      api.get(`/modules?filiere_id=${filiereId}`).then(({ data }) => setModules(data.data));
    } else {
      setModules([]);
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
      stags.forEach(stag => {
        const existante = presencesExistantes.find(p => p.stagiaire_id === stag.id);
        formState[stag.id] = {
          statut: existante ? existante.statut : 'present',
          motif: existante?.motif || '',
        };
      });

      setStagiaires(stags);
      setPresencesForm(formState);
      
    } catch (e) {
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

      await api.post('/presences/bulk', payload);
      notify('success', 'Pointage enregistré', `Le pointage pour le groupe ${groupe} a été validé avec succès.`);
    } catch (e) {
      const err = e.response?.data?.message || 'Erreur lors de la sauvegarde';
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#2E8B57', borderRadius:1 }} />
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#8C9BA8', borderRadius:1 }} />
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#2660A4', borderRadius:1 }} />
            <span className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Gestion des présences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-100">Pointage</h1>
          <p className="text-400 text-sm mt-0.5">Saisie et suivi des présences et absences</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Filière</label>
            <CustomSelect
              options={[
                { value: '', label: 'Toutes les filières' },
                ...(filieres?.map(f => ({ value: f.id, label: f.code })) || [])
              ]}
              value={filiereId}
              onChange={setFiliereId}
              placeholder="Filière"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Groupe</label>
            <div className="relative group">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Ex: DEV201" 
                className="w-full bg-input border border-border rounded-xl py-2.5 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
                value={groupe} 
                onChange={(e) => setGroupe(e.target.value.toUpperCase())} 
              />
            </div>
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-black text-100 tracking-tight flex items-center gap-4">
                <div className="w-1 h-8 bg-primary rounded-full" />
                Liste de présence
                <span className="text-sm font-medium text-500 bg-overlay px-3 py-1 rounded-full border border-border">
                  {stagiaires.length} stagiaires
                </span>
              </h2>
              
              <button 
                onClick={sauvegarderPresences} 
                disabled={loading || user?.role === 'stagiaire'}
                className="btn-primary px-8 py-3.5"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check size={20} strokeWidth={3} />}
                Enregistrer le pointage
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stagiaires.map((stag, index) => {
                const currentStatut = presencesForm[stag.id]?.statut;
                return (
                  <motion.div 
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
                            py-2.5 flex justify-center items-center rounded-xl transition-all duration-300 border border-transparent
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
                        <motion.div
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PresencesList;

