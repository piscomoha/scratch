import { useState } from 'react';
import { useStagiaires, useFilieres } from '../../hooks/useQueries';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiFilter, FiEdit2, FiEye, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import CustomSelect from '../../components/ui/CustomSelect';
import StagiaireForm from '../../components/stagiaires/StagiaireForm';
import StagiaireDetails from '../../components/stagiaires/StagiaireDetails';
import { useDeleteStagiaire } from '../../hooks/useQueries';
const StagiairesList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ search: '', filiere_id: '', statut: '', groupe: '', page: 1 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStagiaireId, setSelectedStagiaireId] = useState(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [stagiaireToEdit, setStagiaireToEdit] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stagiaireToDelete, setStagiaireToDelete] = useState(null);

  const deleteMutation = useDeleteStagiaire();
  
  const { data: stagiairesData, isLoading } = useStagiaires(filters);
  const { data: filieres } = useFilieres();

  const handleSearch = (e) => {
    e.preventDefault();
    // La recherche se fait via l'état des filtres
  };

  const executeDelete = () => {
    if (!stagiaireToDelete) return;
    
    deleteMutation.mutate(stagiaireToDelete.id, {
      onSuccess: () => {
        toast.success('Stagiaire supprimé avec succès');
        setIsDeleteModalOpen(false);
        setStagiaireToDelete(null);
      },
      onError: () => {
        toast.error('Erreur lors de la suppression');
      }
    });
  };

  const statuts = ['actif', 'suspendu', 'diplome', 'abandon'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Stagiaires</h1>
          <p className="text-gray-500 mt-1">Gestion et suivi des étudiants</p>
        </div>
        
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-secondary hover:bg-secondary-dark text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-sm hover:shadow transition-all"
          >
            <FiPlus /> Ajouter un stagiaire
          </button>
        )}
      </div>

      {/* Filtres et Recherche */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Nom, Prénom, Code Massar..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="w-full sm:w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
            <CustomSelect
              options={[
                { value: '', label: 'Toutes les filières' },
                ...(filieres?.map(f => ({ value: f.id, label: f.code })) || [])
              ]}
              value={filters.filiere_id}
              onChange={(value) => setFilters({...filters, filiere_id: value, page: 1})}
              placeholder="Toutes les filières"
            />
          </div>

          <div className="w-full sm:w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <CustomSelect
              options={[
                { value: '', label: 'Tous les statuts' },
                ...statuts.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))
              ]}
              value={filters.statut}
              onChange={(value) => setFilters({...filters, statut: value, page: 1})}
              placeholder="Tous les statuts"
            />
          </div>
        </form>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 font-semibold text-gray-600">Stagiaire</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Filière & Groupe</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Code Massar</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Statut</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">Chargement des données...</td>
                </tr>
              ) : stagiairesData?.data?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">Aucun stagiaire trouvé.</td>
                </tr>
              ) : (
                stagiairesData?.data?.map((stagiaire) => (
                  <tr key={stagiaire.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold overflow-hidden">
                          {stagiaire.photo ? (
                            <img src={stagiaire.photo} alt={stagiaire.nom} className="h-full w-full object-cover" />
                          ) : (
                            stagiaire.nom.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{stagiaire.nom_complet}</p>
                          <p className="text-xs text-gray-500">{stagiaire.email || 'Sans email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <p className="font-medium text-gray-800">{stagiaire.filiere?.code}</p>
                      <p className="text-xs text-secondary font-medium">{stagiaire.groupe}</p>
                    </td>
                    <td className="py-3 px-6 text-gray-600 font-medium">
                      {stagiaire.code_massar}
                    </td>
                    <td className="py-3 px-6">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize
                        ${stagiaire.statut === 'actif' ? 'bg-green-100 text-green-700' : ''}
                        ${stagiaire.statut === 'suspendu' ? 'bg-red-100 text-red-700' : ''}
                        ${stagiaire.statut === 'diplome' ? 'bg-blue-100 text-blue-700' : ''}
                        ${stagiaire.statut === 'abandon' ? 'bg-gray-100 text-gray-700' : ''}
                      `}>
                        {stagiaire.statut}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" 
                          title="Voir profil"
                          onClick={() => {
                            setSelectedStagiaireId(stagiaire.id);
                            setIsDetailsModalOpen(true);
                          }}
                        >
                          <FiEye />
                        </button>
                        {user?.role === 'admin' && (
                          <>
                            <button 
                              className="p-2 text-gray-400 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors" 
                              title="Modifier"
                              onClick={() => {
                                setStagiaireToEdit(stagiaire);
                                setIsEditModalOpen(true);
                              }}
                            >
                              <FiEdit2 />
                            </button>
                            <button 
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                              title="Supprimer"
                              onClick={() => {
                                setStagiaireToDelete(stagiaire);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {stagiairesData?.meta && stagiairesData.meta.last_page > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
            <div>
              Affichage de {stagiairesData.meta.from} à {stagiairesData.meta.to} sur {stagiairesData.meta.total} stagiaires
            </div>
            <div className="flex gap-1">
              {stagiairesData.meta.links.map((link, i) => (
                <button
                  key={i}
                  disabled={!link.url || link.active}
                  onClick={() => {
                    const url = new URL(link.url);
                    setFilters({...filters, page: url.searchParams.get('page')});
                  }}
                  className={`px-3 py-1 rounded-md border transition-colors ${
                    link.active 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} title="Ajouter un nouveau stagiaire">
        <StagiaireForm filieres={filieres} onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      <Modal isOpen={isDetailsModalOpen} closeModal={() => setIsDetailsModalOpen(false)} title="Détails du stagiaire" maxWidth="max-w-4xl">
        {selectedStagiaireId && <StagiaireDetails stagiaireId={selectedStagiaireId} />}
      </Modal>

      <Modal isOpen={isEditModalOpen} closeModal={() => setIsEditModalOpen(false)} title="Modifier le stagiaire">
        {stagiaireToEdit && (
          <StagiaireForm 
            filieres={filieres} 
            initialData={stagiaireToEdit} 
            onClose={() => setIsEditModalOpen(false)} 
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Supprimer le stagiaire"
        message={`Êtes-vous sûr de vouloir supprimer le stagiaire ${stagiaireToDelete?.nom_complet} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default StagiairesList;
