import { useState, useEffect } from 'react';
import { useFilieres } from '../../hooks/useQueries';
import { useAuth } from '../../context/AuthContext';
import { FiSave, FiAlertCircle, FiDownload } from 'react-icons/fi';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import CustomSelect from '../../components/ui/CustomSelect';

const NotesList = () => {
  const { user } = useAuth();
  const [filiereId, setFiliereId] = useState('');
  const [groupe, setGroupe] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [semestre, setSemestre] = useState('1');
  const [annee, setAnnee] = useState('2024-2025');
  
  const [modules, setModules] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);
  const [notesForm, setNotesForm] = useState({});
  const [loading, setLoading] = useState(false);

  const { data: filieres } = useFilieres();

  // Charger les modules quand la filière change
  useEffect(() => {
    if (filiereId) {
      api.get(`/modules?filiere_id=${filiereId}`).then(({ data }) => setModules(data.data));
    } else {
      setModules([]);
    }
  }, [filiereId]);

  const chargerStagiairesEtNotes = async () => {
    if (!filiereId || !groupe || !moduleId || !semestre) {
      toast.error('Veuillez remplir tous les filtres');
      return;
    }

    setLoading(true);
    try {
      // 1. Charger les stagiaires de ce groupe
      const stagsRes = await api.get(`/stagiaires?filiere_id=${filiereId}&groupe=${groupe}&per_page=100`);
      const stags = stagsRes.data.data;
      
      // 2. Charger les notes existantes
      const notesRes = await api.get(`/notes?module_id=${moduleId}&semestre=${semestre}&annee_scolaire=${annee}`);
      const notesExistantes = notesRes.data.data;

      // 3. Préparer le formulaire
      const formData = {};
      stags.forEach(stag => {
        const existingNote = notesExistantes.find(n => n.stagiaire_id === stag.id);
        formData[stag.id] = {
          id: existingNote?.id || null,
          note_controle: existingNote?.note_controle ?? '',
          note_synthese: existingNote?.note_synthese ?? '',
          note_finale: existingNote?.note_finale ?? null,
          isDirty: false
        };
      });

      setStagiaires(stags);
      setNotesForm(formData);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleNoteChange = (stagiaireId, field, value) => {
    // Validation : que des nombres entre 0 et 20
    if (value !== '' && (isNaN(value) || value < 0 || value > 20)) return;

    setNotesForm(prev => ({
      ...prev,
      [stagiaireId]: {
        ...prev[stagiaireId],
        [field]: value,
        isDirty: true
      }
    }));
  };

  const sauvegarderNotes = async () => {
    const notesToSave = Object.entries(notesForm)
      .filter(([_, data]) => data.isDirty)
      .map(([stagiaireId, data]) => ({
        stagiaireId,
        id: data.id,
        note_controle: data.note_controle,
        note_synthese: data.note_synthese,
      }));

    if (notesToSave.length === 0) {
      toast.success('Aucune modification à sauvegarder');
      return;
    }

    setLoading(true);
    let successCount = 0;
    
    for (const note of notesToSave) {
      if (note.note_controle === '' || note.note_synthese === '') continue;

      try {
        const payload = {
          stagiaire_id: note.stagiaireId,
          module_id: moduleId,
          note_controle: note.note_controle,
          note_synthese: note.note_synthese,
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
    toast.success(`${successCount} notes enregistrées`);
    chargerStagiairesEtNotes(); // Recharger pour avoir les notes finales calculées
  };

  const exportExcel = () => {
    if (!stagiaires.length) return;
    
    const moduleSelectionne = modules.find(m => m.id === Number(moduleId))?.intitule;

    const exportData = stagiaires.map(stag => ({
      'Code Massar': stag.code_massar,
      'Nom Complet': stag.nom_complet,
      'Note Contrôle Continu (40%)': notesForm[stag.id]?.note_controle,
      'Note Synthèse (60%)': notesForm[stag.id]?.note_synthese,
      'Note Finale': notesForm[stag.id]?.note_finale || 'Non calculée'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notes");
    XLSX.writeFile(wb, `Notes_${moduleSelectionne}_${groupe}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Saisie des Notes</h1>
        <p className="text-gray-500 mt-1">Gestion des évaluations et relevés de notes</p>
      </div>

      {/* Zone de sélection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
            <CustomSelect
              options={[
                { value: '', label: 'Sélectionner' },
                ...(filieres?.map(f => ({ value: f.id, label: f.code })) || [])
              ]}
              value={filiereId}
              onChange={setFiliereId}
              placeholder="Sélectionner"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Groupe</label>
            <input type="text" placeholder="Ex: DEV101" className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={groupe} onChange={(e) => setGroupe(e.target.value.toUpperCase())} />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
            <CustomSelect
              options={[
                { value: '1', label: 'Semestre 1' },
                { value: '2', label: 'Semestre 2' }
              ]}
              value={semestre}
              onChange={setSemestre}
            />
          </div>
          <div className="md:col-span-2 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
            <CustomSelect
              options={[
                { value: '', label: 'Sélectionner un module' },
                ...modules.map(m => ({ value: m.id, label: `${m.code} - ${m.intitule}` }))
              ]}
              value={moduleId}
              onChange={setModuleId}
              disabled={!filiereId}
              placeholder="Sélectionner un module"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button onClick={chargerStagiairesEtNotes} disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors">
            {loading ? 'Chargement...' : 'Afficher la liste'}
          </button>
        </div>
      </div>

      {/* Tableau de saisie */}
      {stagiaires.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-2 text-primary font-medium">
              <FiAlertCircle className="text-secondary" />
              La note finale est calculée automatiquement par le système (CC 40%, EF 60%).
            </div>
            <div className="flex gap-2">
              <button onClick={exportExcel}
                className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors">
                <FiDownload /> Export Excel
              </button>
              {(user?.role === 'admin' || user?.role === 'formateur') && (
                <button onClick={sauvegarderNotes} disabled={loading}
                  className="flex items-center gap-2 text-white bg-secondary px-6 py-2 rounded-lg hover:bg-secondary-dark transition-colors">
                  <FiSave /> Sauvegarder
                </button>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-sm">
                  <th className="py-3 px-4 text-gray-500 font-semibold w-16">N°</th>
                  <th className="py-3 px-4 text-gray-500 font-semibold">Stagiaire</th>
                  <th className="py-3 px-4 text-gray-500 font-semibold w-40 text-center">Note CC (/20)</th>
                  <th className="py-3 px-4 text-gray-500 font-semibold w-40 text-center">Note EF (/20)</th>
                  <th className="py-3 px-4 text-gray-500 font-semibold w-32 text-center bg-gray-50">Note Finale</th>
                </tr>
              </thead>
              <tbody>
                {stagiaires.map((stag, i) => {
                  const data = notesForm[stag.id] || {};
                  return (
                    <tr key={stag.id} className={`border-b border-gray-100 ${data.isDirty ? 'bg-orange-50/30' : 'hover:bg-slate-50'}`}>
                      <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{stag.nom_complet}</div>
                        <div className="text-xs text-gray-500">{stag.code_massar}</div>
                      </td>
                      <td className="py-3 px-4">
                        <input type="number" step="0.25" min="0" max="20"
                          disabled={user?.role === 'stagiaire'}
                          className={`w-full text-center py-2 px-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all ${data.note_controle === '' ? 'border-gray-300' : 'border-green-300 bg-green-50/30'}`}
                          value={data.note_controle}
                          onChange={(e) => handleNoteChange(stag.id, 'note_controle', e.target.value)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input type="number" step="0.25" min="0" max="20"
                          disabled={user?.role === 'stagiaire'}
                          className={`w-full text-center py-2 px-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all ${data.note_synthese === '' ? 'border-gray-300' : 'border-green-300 bg-green-50/30'}`}
                          value={data.note_synthese}
                          onChange={(e) => handleNoteChange(stag.id, 'note_synthese', e.target.value)}
                        />
                      </td>
                      <td className="py-3 px-4 bg-gray-50 text-center">
                        <div className="font-bold text-lg text-primary">
                          {data.note_finale !== null ? data.note_finale : '-'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesList;
