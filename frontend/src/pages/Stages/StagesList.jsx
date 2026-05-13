import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiEdit2, FiEye, FiDownload, FiCheckCircle } from 'react-icons/fi';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import CustomSelect from '../../components/ui/CustomSelect';

const StagesList = () => {
  const { user } = useAuth();
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ statut: '', entreprise_ville: '' });

  const chargerStages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/stages', { params: filters });
      setStages(data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des stages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerStages();
  }, [filters]);

  const statutConfig = {
    en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
    en_cours: { label: 'En cours', color: 'bg-blue-100 text-blue-700' },
    termine: { label: 'Terminé', color: 'bg-green-100 text-green-700' },
    valide: { label: 'Validé', color: 'bg-purple-100 text-purple-700' },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Stages en Entreprise</h1>
          <p className="text-gray-500 mt-1">Suivi des périodes de stage pfe et pf</p>
        </div>
        
        {user?.role === 'admin' && (
          <button className="bg-secondary hover:bg-secondary-dark text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-sm hover:shadow transition-all">
            <FiPlus /> Ajouter un stage
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-end">
        <div className="w-full sm:w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <CustomSelect
            options={[
              { value: '', label: 'Tous les statuts' },
              ...Object.entries(statutConfig).map(([key, config]) => ({ value: key, label: config.label }))
            ]}
            value={filters.statut}
            onChange={(val) => setFilters({...filters, statut: val})}
            placeholder="Tous les statuts"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ville Entreprise</label>
          <input 
            type="text" 
            placeholder="Ex: Casablanca..." 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary"
            value={filters.entreprise_ville}
            onChange={(e) => setFilters({...filters, entreprise_ville: e.target.value})}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Chargement des stages...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stages.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100">
              Aucun stage trouvé
            </div>
          ) : (
            stages.map((stage) => (
              <div key={stage.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                {/* Header Card */}
                <div className="p-5 border-b border-gray-100 bg-gray-50 relative">
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${statutConfig[stage.statut].color}`}>
                    {statutConfig[stage.statut].label}
                  </span>
                  <h3 className="font-bold text-gray-800 text-lg pr-20 truncate" title={stage.entreprise_nom}>
                    {stage.entreprise_nom}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{stage.entreprise_ville || 'Ville non spécifiée'}</p>
                </div>
                
                {/* Body Card */}
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Stagiaire</p>
                    <p className="font-medium text-gray-800">{stage.stagiaire.nom_complet}</p>
                    <p className="text-sm text-gray-500">{stage.stagiaire.filiere.code} ({stage.stagiaire.groupe})</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Période</p>
                      <p className="text-sm font-medium text-gray-700">{new Date(stage.date_debut).toLocaleDateString()} au</p>
                      <p className="text-sm font-medium text-gray-700">{new Date(stage.date_fin).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Progression</p>
                        <div className="text-lg font-bold text-primary">{stage.progression}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${stage.progression}%` }}></div>
                        </div>
                    </div>
                  </div>
                  
                  {stage.rapport_soumis && (
                    <div className="pt-2 flex items-center gap-2 text-green-600 text-sm font-medium">
                      <FiCheckCircle /> Rapport soumis
                      {stage.rapport_path && (
                         <a href={stage.rapport_path} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline ml-auto flex items-center gap-1"><FiDownload /> Voir</a>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-end gap-2">
                   <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded transition-colors flex items-center gap-1">
                     <FiEye /> Détails
                   </button>
                   {user?.role === 'admin' && (
                     <button className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded transition-colors flex items-center gap-1">
                       <FiEdit2 /> Gérer
                     </button>
                   )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StagesList;
