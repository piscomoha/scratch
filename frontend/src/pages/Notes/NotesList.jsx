import { useState, useEffect } from 'react';
import { useFilieres } from '../../hooks/useQueries';
import { useAuth } from '../../context/AuthContext';
import { Save, AlertCircle, Download, FileText, BookOpen, GraduationCap, Users, Loader2, Shield, Building, MapPin, Briefcase, Phone, Mail, X, Info } from 'lucide-react';
import api from '../../api/axios';
import * as XLSX from 'xlsx';
import CustomSelect from '../../components/ui/CustomSelect';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';

const MotionDiv = motion.div;
const MotionTr = motion.tr;

const StageInfoModal = ({ stage, isOpen, onClose }) => {
  if (!isOpen || !stage) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <MotionDiv 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
      />
      <MotionDiv 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl glass rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border border-border shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-primary rotate-12 pointer-events-none">
          <Building size={200} />
        </div>

        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-overlay-hover text-500 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-6 mb-10 relative z-10">
          <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
            <Building size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-100">{stage.entreprise_nom}</h2>
            <p className="text-amber-500 font-bold tracking-widest uppercase text-[10px] mt-1">Détails du Stage</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 relative z-10">
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 flex items-center gap-2">
                <Briefcase size={12} className="text-amber-500" /> Secteur
              </label>
              <p className="text-sm font-bold text-100">{stage.entreprise_secteur || 'Non spécifié'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 flex items-center gap-2">
                <MapPin size={12} className="text-amber-500" /> Ville
              </label>
              <p className="text-sm font-bold text-100">{stage.entreprise_ville || 'Non spécifiée'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 flex items-center gap-2">
                <AlertCircle size={12} className="text-amber-500" /> Durée
              </label>
              <p className="text-sm font-bold text-100">{stage.duree_semaines} Semaines</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 flex items-center gap-2">
                <Users size={12} className="text-amber-500" /> Responsable
              </label>
              <p className="text-sm font-bold text-100">{stage.responsable_nom || 'Non spécifié'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 flex items-center gap-2">
                <Phone size={12} className="text-amber-500" /> Téléphone
              </label>
              <p className="text-sm font-bold text-100">{stage.responsable_telephone || 'Non spécifié'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 flex items-center gap-2">
                <Mail size={12} className="text-amber-500" /> Email
              </label>
              <p className="text-sm font-bold text-100 truncate">{stage.responsable_email || 'Non spécifié'}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex justify-between items-center relative z-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-500 block mb-1">Période</span>
            <p className="text-xs font-black text-100">
              {stage.date_debut ? new Date(stage.date_debut).toLocaleDateString() : '??'} 
              <span className="mx-2 text-500">→</span> 
              {stage.date_fin ? new Date(stage.date_fin).toLocaleDateString() : '??'}
            </p>
          </div>
          <div className="px-5 py-2 rounded-xl bg-amber-500/10 text-amber-500 font-black text-[10px] uppercase tracking-widest border border-amber-500/10">
            {stage.statut}
          </div>
        </div>
      </MotionDiv>
    </div>
  );
};

const NotesList = () => {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [filiereId, setFiliereId] = useState('');
  const [groupe, setGroupe] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [semestre, setSemestre] = useState('1');
  const [annee] = useState('2024-2025');
  const [selectedStage, setSelectedStage] = useState(null);
  
  const [modules, setModules] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);
  const [notesForm, setNotesForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [savingCells, setSavingCells] = useState({});

  const { data: filieres } = useFilieres();
  const canEditNotes = user?.role === 'formateur';

  useEffect(() => {
    if (filiereId) {
      api.get(`/modules?filiere_id=${filiereId}`).then(({ data }) => setModules(data.data));
    } else {
      setModules([]);
    }
  }, [filiereId]);

  const chargerStagiairesEtNotes = async () => {
    if (!filiereId || !groupe || !moduleId || !semestre) {
      notify('error', 'Filtres incomplets', 'Veuillez remplir tous les filtres pour afficher la liste.');
      return;
    }

    setLoading(true);
    try {
      const stagsRes = await api.get(`/stagiaires?filiere_id=${filiereId}&groupe=${groupe}&per_page=100`);
      const stags = stagsRes.data.data;
      
      const notesRes = await api.get(`/notes?module_id=${moduleId}&semestre=${semestre}&annee_scolaire=${annee}&per_page=500`);
      const notesExistantes = notesRes.data.data;

      const formData = {};
      stags.forEach(stag => {
        const existingNote = notesExistantes.find(n => n.stagiaire_id === stag.id);
        formData[stag.id] = {
          id: existingNote?.id || null,
          note_controle_1: existingNote?.note_controle_1 ?? '',
          note_controle_2: existingNote?.note_controle_2 ?? '',
          note_controle_3: existingNote?.note_controle_3 ?? '',
          note_synthese: existingNote?.note_synthese ?? '',
          note_stage: existingNote?.note_stage ?? '',
          note_finale: existingNote?.note_finale ?? null,
          isDirty: false,
          annee_formation: stag.annee_formation,
          stage_info: stag.stage
        };
      });

      setStagiaires(stags);
      setNotesForm(formData);
    } catch {
      notify('error', 'Erreur de chargement', 'Impossible de récupérer les notes des stagiaires.');
    } finally {
      setLoading(false);
    }
  };

  const handleNoteChange = (stagiaireId, field, value) => {
    if (value !== '' && (isNaN(value) || value < 0 || value > 20)) return;

    setNotesForm(prev => {
      const current = prev[stagiaireId];
      const nextData = { ...current, [field]: value, isDirty: true };
      
      const ccs = [
        field === 'note_controle_1' ? value : current.note_controle_1,
        field === 'note_controle_2' ? value : current.note_controle_2,
        field === 'note_controle_3' ? value : current.note_controle_3
      ].filter(v => v !== '');
      
      const ef = field === 'note_synthese' ? value : current.note_synthese;
      if (ccs.length === 3 && ef !== '') {
        const moyCC = ccs.reduce((a, b) => Number(a) + Number(b), 0) / ccs.length;
        nextData.note_finale = Math.round((moyCC * 0.4 + Number(ef) * 0.6) * 100) / 100;
      } else {
        nextData.note_finale = null;
      }
      
      return { ...prev, [stagiaireId]: nextData };
    });
  };

  const sauvegarderNotes = async () => {
    const notesToSave = Object.entries(notesForm)
      .filter(([, data]) => data.isDirty)
      .map(([stagiaireId, data]) => ({
        stagiaireId,
        ...data
      }));

    if (notesToSave.length === 0) {
      notify('info', 'Aucun changement', 'Aucune modification à sauvegarder.');
      return;
    }

    setLoading(true);
    let successCount = 0;
    
    for (const note of notesToSave) {
      try {
        const payload = {
          stagiaire_id: note.stagiaireId,
          module_id: moduleId,
          note_controle_1: note.note_controle_1 === '' ? null : note.note_controle_1,
          note_controle_2: note.note_controle_2 === '' ? null : note.note_controle_2,
          note_controle_3: note.note_controle_3 === '' ? null : note.note_controle_3,
          note_synthese: note.note_synthese === '' ? null : note.note_synthese,
          note_stage: note.note_stage === '' ? null : note.note_stage,
          annee_scolaire: annee,
          semestre: semestre
        };

        if (note.id) {
          await api.put(`/notes/${note.id}`, payload);
        } else {
          await api.post('/notes', payload);
        }
        successCount++;
      } catch (e) {
        console.error('Erreur save note:', e);
      }
    }

    setLoading(false);
    if (successCount > 0) {
      notify('success', 'Notes enregistrées', `${successCount} notes ont été mises à jour.`);
      chargerStagiairesEtNotes();
    }
  };

  const buildNotePayload = (stagiaireId, data) => ({
    stagiaire_id: stagiaireId,
    module_id: moduleId,
    note_controle_1: data.note_controle_1 === '' ? null : data.note_controle_1,
    note_controle_2: data.note_controle_2 === '' ? null : data.note_controle_2,
    note_controle_3: data.note_controle_3 === '' ? null : data.note_controle_3,
    note_synthese: data.note_synthese === '' ? null : data.note_synthese,
    note_stage: data.note_stage === '' ? null : data.note_stage,
    annee_scolaire: annee,
    semestre,
  });

  const saveSingleNote = async (stagiaireId, field) => {
    if (!canEditNotes) return;
    const current = notesForm[stagiaireId];
    if (!current) return;

    const cellKey = `${stagiaireId}-${field}`;
    setSavingCells(prev => ({ ...prev, [cellKey]: true }));

    try {
      const payload = buildNotePayload(stagiaireId, current);
      const { data } = current.id
        ? await api.put(`/notes/${current.id}`, payload)
        : await api.post('/notes', payload);

      setNotesForm(prev => ({
        ...prev,
        [stagiaireId]: {
          ...prev[stagiaireId],
          id: data.data.id,
          note_finale: data.data.note_finale,
          isDirty: false,
        }
      }));
      notify('success', 'Note enregistrée', 'La valeur a été sauvegardée.');
    } catch (error) {
      notify('error', 'Erreur', error.response?.data?.message || 'Impossible de sauvegarder cette note.');
    } finally {
      setSavingCells(prev => ({ ...prev, [cellKey]: false }));
    }
  };

  const exportExcel = () => {
    if (!stagiaires.length) return;
    
    const moduleSelectionne = modules.find(m => m.id === Number(moduleId))?.intitule;

    const exportData = stagiaires.map(stag => ({
      'Code Massar': stag.code_massar,
      'Nom Complet': stag.nom_complet,
      'CC1': notesForm[stag.id]?.note_controle_1,
      'CC2': notesForm[stag.id]?.note_controle_2,
      'CC3': notesForm[stag.id]?.note_controle_3,
      'Synthèse': notesForm[stag.id]?.note_synthese,
      'Stage': notesForm[stag.id]?.note_stage,
      'Note Finale': notesForm[stag.id]?.note_finale || 'Non calculée'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notes");
    XLSX.writeFile(wb, `Notes_${moduleSelectionne}_${groupe}.xlsx`);
  };

  const isAnnee2 = stagiaires.some(s => s.annee_formation === 2);

  return (
    <div className="space-y-8 pb-10">
      <AnimatePresence>
        {selectedStage && (
          <StageInfoModal 
            stage={selectedStage} 
            isOpen={!!selectedStage} 
            onClose={() => setSelectedStage(null)} 
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#2E8B57', borderRadius:1 }} />
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#8C9BA8', borderRadius:1 }} />
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#2660A4', borderRadius:1 }} />
            <span className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Évaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-100">Gestion des Notes</h1>
          <p className="text-400 text-sm mt-0.5">Saisie des évaluations (CC & Synthèse) avec calcul automatique</p>
        </div>
      </div>

      <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-primary rotate-12 pointer-events-none">
          <BookOpen size={180} />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5 sm:gap-3 lg:gap-6 relative z-10">
          <div className="space-y-1 sm:space-y-2">
            <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-500 ml-0.5 sm:ml-1">Filière</label>
            <CustomSelect
              options={[
                { value: '', label: 'Sélectionner' },
                ...(filieres?.map(f => ({ value: f.id, label: f.code })) || [])
              ]}
              value={filiereId}
              onChange={setFiliereId}
              placeholder="Filière"
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-500 ml-0.5 sm:ml-1">Groupe</label>
            <div className="relative group">
              <Users className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 sm:w-4 h-3.5 sm:h-4 text-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="DEV201" 
                className="w-full bg-input border border-border rounded-lg sm:rounded-xl py-2 sm:py-2.5 pl-9 sm:pl-10 pr-2 sm:pr-4 text-xs sm:text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
                value={groupe} 
                onChange={(e) => setGroupe(e.target.value.toUpperCase())} 
              />
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-500 ml-0.5 sm:ml-1">Semestre</label>
            <CustomSelect
              options={[
                { value: '1', label: 'Sem 1' },
                { value: '2', label: 'Sem 2' }
              ]}
              value={semestre}
              onChange={setSemestre}
            />
          </div>
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-1 sm:space-y-2">
            <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-500 ml-0.5 sm:ml-1">Module</label>
            <CustomSelect
              options={[
                { value: '', label: 'Sélectionner' },
                ...modules.map(m => ({ 
                  value: m.id, 
                  label: `${m.code} - ${m.intitule}${m.is_regional ? ' (REG)' : ''}` 
                }))
              ]}
              value={moduleId}
              onChange={setModuleId}
              disabled={!filiereId}
              placeholder="Module"
            />
          </div>
        </div>
        
        <div className="mt-4 sm:mt-8 pt-4 sm:pt-8 border-t border-border flex justify-end">
          <button 
            onClick={chargerStagiairesEtNotes} 
            disabled={loading}
            className="btn-primary py-2 sm:py-3.5 px-4 sm:px-8 text-xs sm:text-base whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookOpen size={18} />}
            Afficher la liste
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stagiaires.length > 0 ? (
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-xl sm:rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="p-3 sm:p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center bg-overlay gap-3 md:gap-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 w-full md:w-auto">
                <div className="flex items-start md:items-center gap-2 md:gap-3 px-2 md:px-4 py-1.5 md:py-2.5 rounded-lg md:rounded-xl bg-primary/10 border border-primary/20 text-primary-light">
                  <AlertCircle size={14} className="text-primary flex-shrink-0 mt-0.5 md:mt-0" />
                  <span className="text-[8px] md:text-xs font-bold uppercase tracking-widest leading-tight">
                    Finale: CC×0.4+EFM×0.6
                  </span>
                </div>
                {modules.find(m => m.id === Number(moduleId))?.is_regional && (
                  <div className="flex items-center gap-2 px-2 md:px-4 py-1.5 md:py-2.5 rounded-lg md:rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                    <Shield size={14} className="text-amber-500 flex-shrink-0" />
                    <span className="text-[8px] md:text-xs font-bold uppercase tracking-widest italic">REG</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={exportExcel}
                  className="flex items-center justify-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-2xl hover:bg-emerald-500/20 transition-all font-bold text-xs md:text-sm border border-emerald-500/20 flex-1 md:flex-none"
                >
                  <Download size={14} className="md:w-[18px] md:h-[18px]" /> <span className="hidden md:inline">Export</span>
                </button>
                {canEditNotes && (
                  <button 
                    onClick={sauvegarderNotes} 
                    disabled={loading}
                    className="btn-primary px-3 md:px-6 py-2 md:py-2.5 text-xs md:text-base flex-1 md:flex-none"
                  >
                    {loading ? <Loader2 className="w-4 md:w-5 h-4 md:h-5 animate-spin" /> : <Save size={14} className="md:w-[18px] md:h-[18px]" />}
                    <span className="hidden md:inline">Sauvegarder</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto overflow-y-hidden w-full">
              <table className="w-full text-left border-collapse text-xs sm:text-sm"
                   style={{ minWidth: '600px' }}>
                <thead>
                  <tr style={{ background:'rgba(38,96,164,0.05)', borderBottom:'2px solid var(--border)' }}>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 lg:px-6 text-[9px] sm:text-[10px] font-black text-500 uppercase tracking-widest whitespace-nowrap w-8 sm:w-12">#</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 lg:px-6 text-[9px] sm:text-[10px] font-black text-500 uppercase tracking-widest whitespace-nowrap min-w-[120px] sm:min-w-[200px]">Stagiaire</th>
                    <th className="py-2 sm:py-3 px-1 sm:px-3 lg:px-6 text-[9px] sm:text-[10px] font-black text-500 uppercase tracking-widest whitespace-nowrap text-center">CC1</th>
                    <th className="py-2 sm:py-3 px-1 sm:px-3 lg:px-6 text-[9px] sm:text-[10px] font-black text-500 uppercase tracking-widest whitespace-nowrap text-center">CC2</th>
                    <th className="py-2 sm:py-3 px-1 sm:px-3 lg:px-6 text-[9px] sm:text-[10px] font-black text-500 uppercase tracking-widest whitespace-nowrap text-center">CC3</th>
                    <th className="py-2 sm:py-3 px-1 sm:px-4 lg:px-6 text-[9px] sm:text-[10px] font-black text-500 uppercase tracking-widest whitespace-nowrap text-center hidden sm:table-cell">EFM</th>
                    {isAnnee2 && <th className="py-2 sm:py-3 px-1 sm:px-4 lg:px-6 text-[9px] sm:text-[10px] font-black text-500 uppercase tracking-widest whitespace-nowrap text-center hidden md:table-cell">Stage</th>}
                    <th className="py-2 sm:py-3 px-1 sm:px-4 lg:px-6 text-[9px] sm:text-[10px] font-black text-500 uppercase tracking-widest whitespace-nowrap text-center">Finale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stagiaires.map((stag, i) => {
                    const data = notesForm[stag.id] || {};
                    return (
                      <MotionTr 
                        key={stag.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`group transition-all duration-300 ${data.isDirty ? 'bg-primary/[0.03]' : 'hover:bg-overlay'}`}
                      >
                        <td className="py-4 px-8 text-500 font-bold text-sm">{i + 1}</td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 lg:px-8">
                          <div className="flex items-center gap-2 sm:gap-3 group/name">
                            <div className="min-w-0">
                              <div className="font-bold text-100 group-hover:text-primary transition-colors truncate text-xs sm:text-base">{stag.nom_complet}</div>
                              <div className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-500 mt-0.5 truncate">{stag.code_massar}</div>
                            </div>
                            {stag.stage && (
                              <button 
                                onClick={() => setSelectedStage(stag.stage)}
                                className="p-2 rounded-lg bg-amber-500/10 text-amber-500 opacity-60 hover:opacity-100 transition-all hover:bg-amber-500/20"
                                title="Infos Stage"
                              >
                                <Building size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-1 sm:px-3 lg:px-4">
                          <input 
                            type="number" step="0.25" min="0" max="20"
                            disabled={!canEditNotes || savingCells[`${stag.id}-note_controle_1`]}
                            className={`w-12 sm:w-16 mx-auto block text-center py-1.5 sm:py-2 px-1 sm:px-2 bg-input border rounded-lg text-[10px] sm:text-xs font-bold text-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${data.note_controle_1 === '' ? 'border-border' : 'border-primary/40'}`}
                            value={data.note_controle_1}
                            onChange={(e) => handleNoteChange(stag.id, 'note_controle_1', e.target.value)}
                            onBlur={() => saveSingleNote(stag.id, 'note_controle_1')}
                          />
                        </td>
                        <td className="py-3 sm:py-4 px-1 sm:px-3 lg:px-4">
                          <input 
                            type="number" step="0.25" min="0" max="20"
                            disabled={!canEditNotes || savingCells[`${stag.id}-note_controle_2`]}
                            className={`w-12 sm:w-16 mx-auto block text-center py-1.5 sm:py-2 px-1 sm:px-2 bg-input border rounded-lg text-[10px] sm:text-xs font-bold text-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${data.note_controle_2 === '' ? 'border-border' : 'border-primary/40'}`}
                            value={data.note_controle_2}
                            onChange={(e) => handleNoteChange(stag.id, 'note_controle_2', e.target.value)}
                            onBlur={() => saveSingleNote(stag.id, 'note_controle_2')}
                          />
                        </td>
                        <td className="py-3 sm:py-4 px-1 sm:px-3 lg:px-4">
                          <input 
                            type="number" step="0.25" min="0" max="20"
                            disabled={!canEditNotes || savingCells[`${stag.id}-note_controle_3`]}
                            className={`w-12 sm:w-16 mx-auto block text-center py-1.5 sm:py-2 px-1 sm:px-2 bg-input border rounded-lg text-[10px] sm:text-xs font-bold text-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${data.note_controle_3 === '' ? 'border-border' : 'border-primary/40'}`}
                            value={data.note_controle_3}
                            onChange={(e) => handleNoteChange(stag.id, 'note_controle_3', e.target.value)}
                            onBlur={() => saveSingleNote(stag.id, 'note_controle_3')}
                          />
                        </td>
                        <td className="py-3 sm:py-4 px-1 sm:px-4 lg:px-8 hidden sm:table-cell">
                          <input 
                            type="number" step="0.25" min="0" max="20"
                            disabled={!canEditNotes || savingCells[`${stag.id}-note_synthese`]}
                            className={`w-14 sm:w-20 mx-auto block text-center py-1.5 sm:py-2.5 px-2 sm:px-3 bg-input border rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-bold text-100 transition-all focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-primary/20 ${data.note_synthese === '' ? 'border-border' : 'border-primary/40 bg-primary/5'}`}
                            value={data.note_synthese}
                            onChange={(e) => handleNoteChange(stag.id, 'note_synthese', e.target.value)}
                            onBlur={() => saveSingleNote(stag.id, 'note_synthese')}
                          />
                        </td>
                        {isAnnee2 && (
                          <td className="py-3 sm:py-4 px-1 sm:px-4 lg:px-8 hidden md:table-cell">
                            <input 
                              type="number" step="0.25" min="0" max="20"
                              disabled={!canEditNotes || savingCells[`${stag.id}-note_stage`]}
                              className={`w-14 sm:w-20 mx-auto block text-center py-1.5 sm:py-2.5 px-2 sm:px-3 bg-input border rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-bold text-100 transition-all focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-primary/20 ${data.note_stage === '' ? 'border-border' : 'border-amber-500/40 bg-amber-500/5'}`}
                              value={data.note_stage}
                              onChange={(e) => handleNoteChange(stag.id, 'note_stage', e.target.value)}
                              onBlur={() => saveSingleNote(stag.id, 'note_stage')}
                            />
                          </td>
                        )}
                        <td className="py-3 sm:py-4 px-1 sm:px-4 lg:px-8 bg-overlay text-center">
                          <div className={`text-base sm:text-xl font-black ${data.note_finale !== null ? (data.note_finale >= 10 ? 'text-emerald-400' : 'text-rose-400') : 'text-500'}`}>
                            {data.note_finale !== null ? data.note_finale : '--'}
                          </div>
                        </td>
                      </MotionTr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </MotionDiv>
        ) : (
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-20 text-center"
          >
            <div className="flex flex-col items-center gap-4 opacity-30">
              <Users size={64} />
              <p className="font-bold uppercase tracking-[0.2em] text-xs">Aucun stagiaire trouvé. Ajustez vos filtres.</p>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotesList;
