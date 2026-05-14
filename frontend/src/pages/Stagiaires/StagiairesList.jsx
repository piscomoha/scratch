import { useState } from 'react';
import { useStagiaires, useFilieres } from '../../hooks/useQueries';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, Edit2, Eye, Trash2, Plus, UserCircle, Mail, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import CustomSelect from '../../components/ui/CustomSelect';
import StagiaireForm from '../../components/stagiaires/StagiaireForm';
import StagiaireDetails from '../../components/stagiaires/StagiaireDetails';
import { useDeleteStagiaire } from '../../hooks/useQueries';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';

const StagiairesList = () => {
  const { user } = useAuth();
  const { notify } = useNotification();
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
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-100 mb-2">Stagiaires</h1>
          <p className="text-500 font-medium">Gestion et suivi de la base étudiante</p>
        </div>
        
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-1"
          >
            <Plus size={20} strokeWidth={3} /> Ajouter un stagiaire
          </button>
        )}
      </div>

      {/* Filters Section */}
      <div className="glass rounded-[2rem] p-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-6 relative group">
            <label className="block text-xs font-bold text-500 uppercase tracking-widest mb-2 ml-1">Recherche</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Nom, Prénom, Code Massar..." 
                className="w-full bg-input border border-border rounded-xl py-2.5 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-500 uppercase tracking-widest mb-2 ml-1">Filière</label>
            <CustomSelect
              options={[
                { value: '', label: 'Toutes les filières' },
                ...(filieres?.map(f => ({ value: f.id, label: f.code })) || [])
              ]}
              value={filters.filiere_id}
              onChange={(value) => setFilters({...filters, filiere_id: value, page: 1})}
              placeholder="Filières"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-500 uppercase tracking-widest mb-2 ml-1">Statut</label>
            <CustomSelect
              options={[
                { value: '', label: 'Tous les statuts' },
                ...statuts.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))
              ]}
              value={filters.statut}
              onChange={(value) => setFilters({...filters, statut: value, page: 1})}
              placeholder="Statuts"
            />
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="glass rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-overlay border-b border-border">
                <th className="py-5 px-8 text-[10px] font-black text-500 uppercase tracking-[0.2em]">Stagiaire</th>
                <th className="py-5 px-8 text-[10px] font-black text-500 uppercase tracking-[0.2em]">Filière & Groupe</th>
                <th className="py-5 px-8 text-[10px] font-black text-500 uppercase tracking-[0.2em]">Code Massar</th>
                <th className="py-5 px-8 text-[10px] font-black text-500 uppercase tracking-[0.2em]">Statut</th>
                <th className="py-5 px-8 text-[10px] font-black text-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 border-t-2 border-primary rounded-full animate-spin" />
                      <span className="text-500 font-medium">Chargement des stagiaires...</span>
                    </div>
                  </td>
                </tr>
              ) : stagiairesData?.data?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-500 font-medium italic">Aucun stagiaire trouvé.</td>
                </tr>
              ) : (
                stagiairesData?.data?.map((stagiaire, index) => (
                  <motion.tr 
                    key={stagiaire.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-overlay transition-colors"
                  >
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 flex-shrink-0 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-xl flex items-center justify-center text-primary font-black overflow-hidden ring-1 ring-border group-hover:ring-primary/30 transition-all">
                          {stagiaire.photo ? (
                            <img src={stagiaire.photo} alt={stagiaire.nom} className="h-full w-full object-cover" />
                          ) : (
                            <UserCircle className="w-6 h-6 opacity-40" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-100 truncate group-hover:text-primary transition-colors">{stagiaire.nom_complet}</p>
                          <p className="text-xs text-500 flex items-center gap-1.5 mt-0.5 truncate">
                            <Mail className="w-3 h-3" /> {stagiaire.email || 'Sans email'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-8">
                      <p className="text-sm font-bold text-200">{stagiaire.filiere?.code}</p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-primary mt-1">{stagiaire.groupe}</p>
                    </td>
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-2 text-400 font-medium text-sm">
                        <Hash className="w-3 h-3 opacity-30" />
                        {stagiaire.code_massar}
                      </div>
                    </td>
                    <td className="py-4 px-8">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border
                        ${stagiaire.statut === 'actif' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                        ${stagiaire.statut === 'suspendu' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}
                        ${stagiaire.statut === 'diplome' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                        ${stagiaire.statut === 'abandon' ? 'bg-zinc-500/10 text-400 border-border' : ''}
                      `}>
                        {stagiaire.statut}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button 
                          className="p-2 text-400 hover:text-100 hover:bg-overlay rounded-xl transition-all" 
                          title="Voir profil"
                          onClick={() => {
                            setSelectedStagiaireId(stagiaire.id);
                            setIsDetailsModalOpen(true);
                          }}
                        >
                          <Eye size={18} />
                        </button>
                        {user?.role === 'admin' && (
                          <>
                            <button 
                              className="p-2 text-400 hover:text-secondary hover:bg-overlay rounded-xl transition-all" 
                              title="Modifier"
                              onClick={() => {
                                setStagiaireToEdit(stagiaire);
                                setIsEditModalOpen(true);
                              }}
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              className="p-2 text-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all" 
                              title="Supprimer"
                              onClick={() => {
                                setStagiaireToDelete(stagiaire);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {stagiairesData?.meta && stagiairesData.meta.last_page > 1 && (
          <div className="p-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-xs font-bold text-500 uppercase tracking-widest">
              Affichage <span className="text-200">{stagiairesData.meta.from}</span> à <span className="text-200">{stagiairesData.meta.to}</span> sur <span className="text-200">{stagiairesData.meta.total}</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
              {stagiairesData.meta.links.map((link, i) => (
                <button
                  key={i}
                  disabled={!link.url || link.active}
                  onClick={() => {
                    const url = new URL(link.url);
                    setFilters({...filters, page: url.searchParams.get('page')});
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 border ${
                    link.active 
                      ? 'bg-primary text-white border-primary glow-primary' 
                      : 'bg-input border-border text-500 hover:text-100 hover:bg-overlay'
                  } ${!link.url ? 'opacity-20 cursor-not-allowed' : ''}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals remain functionally the same but visually inherits the new styles */}
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
        message={`Êtes-vous sûr de vouloir supprimer le stagiaire ${stagiaireToDelete?.nom_complet} ? Cette action est irréversible et supprimera toutes ses données (notes, présences, etc).`}
        confirmText="Supprimer définitivement"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default StagiairesList;

