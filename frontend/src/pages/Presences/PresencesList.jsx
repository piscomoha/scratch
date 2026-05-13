import { useState, useEffect } from 'react';
import { useFilieres } from '../../hooks/useQueries';
import { useAuth } from '../../context/AuthContext';
import { FiCheck, FiX, FiClock, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import CustomSelect from '../../components/ui/CustomSelect';

const PresencesList = () => {
  const { user } = useAuth();
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
      toast.error('Veuillez sélectionner un groupe, un module et une date');
      return;
    }

    setLoading(true);
    try {
      const stagsRes = await api.get(`/stagiaires?groupe=${groupe}&per_page=100`);
      const stags = stagsRes.data.data;

      // On vérifie s'il y a déjà des présences saisies pour cette séance
      const presencesRes = await api.get(`/presences?module_id=${moduleId}&date=${dateSeance}&groupe=${groupe}`);
      const presencesExistantes = presencesRes.data.data;

      const formState = {};
      stags.forEach(stag => {
        const existante = presencesExistantes.find(p => p.stagiaire_id === stag.id);
        formState[stag.id] = {
          statut: existante ? existante.statut : 'present', // Par défaut présent
          motif: existante?.motif || '',
        };
      });

      setStagiaires(stags);
      setPresencesForm(formState);
      
    } catch (e) {
      toast.error('Erreur de chargement');
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
      toast.success('Pointage enregistré avec succès');
    } catch (e) {
      const err = e.response?.data?.message || 'Erreur lors de la sauvegarde';
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statutConfig = {
    present: { label: 'Présent', bg: 'bg-green-100', text: 'text-green-700', icon: <FiCheck />, border: 'border-green-500' },
    absent: { label: 'Absent', bg: 'bg-red-100', text: 'text-red-700', icon: <FiX />, border: 'border-red-500' },
    retard: { label: 'Retard', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <FiClock />, border: 'border-yellow-500' },
    justifie: { label: 'Justifié', bg: 'bg-blue-100', text: 'text-blue-700', icon: <FiFileText />, border: 'border-blue-500' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Gestion des Présences</h1>
        <p className="text-gray-500 mt-1">Pointage rapide et suivi des absences</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
           {/* Filtres ... */}
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
            <input type="text" placeholder="Ex: DEV201" className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={groupe} onChange={(e) => setGroupe(e.target.value.toUpperCase())} />
          </div>
          <div className="lg:col-span-2 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
            <CustomSelect
              options={[
                { value: '', label: 'Sélectionner un module' },
                ...modules.map(m => ({ value: m.id, label: m.intitule }))
              ]}
              value={moduleId}
              onChange={setModuleId}
              disabled={!filiereId}
              placeholder="Sélectionner un module"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={dateSeance} onChange={(e) => setDateSeance(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-4 mt-4 items-end">
          <div className="w-32">
             <label className="block text-sm font-medium text-gray-700 mb-1">De</label>
             <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={heureDebut} onChange={(e) => setHeureDebut(e.target.value)} />
          </div>
          <div className="w-32">
             <label className="block text-sm font-medium text-gray-700 mb-1">À</label>
             <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={heureFin} onChange={(e) => setHeureFin(e.target.value)} />
          </div>
          <div className="flex-1 flex justify-end">
            <button onClick={chargerSeance} disabled={loading}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium">
              Démarrer le pointage
            </button>
          </div>
        </div>
      </div>

      {/* Liste de pointage */}
      {stagiaires.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
               Séance du {new Date(dateSeance).toLocaleDateString('fr-FR')} 
               <span className="text-gray-400 font-normal text-lg">({heureDebut} - {heureFin})</span>
            </h2>
            <button onClick={sauvegarderPresences} disabled={loading || user?.role === 'stagiaire'}
               className="bg-secondary text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-opacity-90 transition-all">
               Sauvegarder le pointage
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stagiaires.map(stag => {
              const currentStatut = presencesForm[stag.id]?.statut;
              return (
                <div key={stag.id} className={`border-2 rounded-xl p-4 transition-all duration-200 ${statutConfig[currentStatut].border} ${statutConfig[currentStatut].bg} bg-opacity-20`}>
                  <div className="font-bold text-gray-800 text-lg mb-1">{stag.nom_complet}</div>
                  <div className="text-sm text-gray-500 mb-4">{stag.code_massar}</div>
                  
                  <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                    {Object.entries(statutConfig).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setStatut(stag.id, key)}
                        disabled={user?.role === 'stagiaire'}
                        title={config.label}
                        className={`flex-1 py-2 flex justify-center items-center rounded-md transition-colors ${
                          currentStatut === key 
                            ? `${config.bg} ${config.text} font-bold` 
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {config.icon}
                      </button>
                    ))}
                  </div>

                  {(currentStatut === 'absent' || currentStatut === 'justifie') && (
                     <input type="text" placeholder="Motif de l'absence..."
                       className="mt-3 w-full px-3 py-1.5 text-sm rounded bg-white border border-gray-200 outline-none focus:border-primary"
                       value={presencesForm[stag.id]?.motif || ''}
                       onChange={e => setPresencesForm(prev => ({...prev, [stag.id]: {...prev[stag.id], motif: e.target.value}}))}
                     />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PresencesList;
