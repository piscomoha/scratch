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
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#2E8B57', borderRadius:1 }} />
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#8C9BA8', borderRadius:1 }} />
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#2660A4', borderRadius:1 }} />
            <span className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Gestion étudiante</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-100">Stagiaires</h1>
          <p className="text-400 text-sm mt-0.5">Gestion et suivi de la base étudiante</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex-shrink-0"
          >
            <Plus size={16} strokeWidth={2.5} /> Ajouter un stagiaire
          </button>
        )}
      </div>

      {/* Filters Section */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-6 items-end">
          <div className="sm:col-span-2 lg:col-span-6 relative group">
            <label className="block text-[10px] sm:text-xs font-bold text-500 uppercase tracking-widest mb-2 ml-1">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Nom, Prénom, Code..." 
                className="w-full bg-input border border-border rounded-xl py-2 sm:py-2.5 pl-10 sm:pl-12 pr-3 sm:pr-4 text-xs sm:text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
              />
            </div>
          </div>

          <div className="sm:col-span-1 lg:col-span-3">
            <label className="block text-[10px] sm:text-xs font-bold text-500 uppercase tracking-widest mb-2 ml-1">Filière</label>
            <CustomSelect
              options={[
                { value: '', label: 'Toutes' },
                ...(filieres?.map(f => ({ value: f.id, label: f.code })) || [])
              ]}
              value={filters.filiere_id}
              onChange={(value) => setFilters({...filters, filiere_id: value, page: 1})}
              placeholder="Filières"
            />
          </div>

          <div className="sm:col-span-1 lg:col-span-3">
            <label className="block text-[10px] sm:text-xs font-bold text-500 uppercase tracking-widest mb-2 ml-1">Statut</label>
            <CustomSelect
              options={[
                { value: '', label: 'Tous' },
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
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background:'rgba(38,96,164,0.05)', borderBottom:'2px solid var(--border)' }}>
                <th className="py-3 px-4 sm:px-6 text-[10px] font-black text-500 uppercase tracking-widest whitespace-nowrap">Stagiaire</th>
                <th className="py-3 px-4 sm:px-6 text-[10px] font-black text-500 uppercase tracking-widest whitespace-nowrap">Filière / Groupe</th>
                <th className="py-3 px-4 sm:px-6 text-[10px] font-black text-500 uppercase tracking-widest whitespace-nowrap hidden md:table-cell">Code Massar</th>
                <th className="py-3 px-4 sm:px-6 text-[10px] font-black text-500 uppercase tracking-widest whitespace-nowrap">Statut</th>
                <th className="py-3 px-4 sm:px-6 text-[10px] font-black text-500 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-12 sm:py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 border-t-2 border-primary rounded-full animate-spin" />
                      <span className="text-500 font-medium text-xs sm:text-sm">Chargement...</span>
                    </div>
                  </td>
                </tr>
              ) : stagiairesData?.data?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 sm:py-20 text-center text-500 font-medium italic text-xs sm:text-sm">Aucun stagiaire trouvé.</td>
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
                    <td className="py-3 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 rounded-xl flex items-center justify-center font-black text-sm text-white overflow-hidden"
                          style={{ background: 'linear-gradient(135deg, #2E8B57, #2660A4)' }}>
                          {stagiaire.photo
                            ? <img src={stagiaire.photo} alt={stagiaire.nom} className="h-full w-full object-cover" />
                            : stagiaire.nom_complet?.charAt(0)
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-100 truncate text-sm group-hover:text-secondary transition-colors">{stagiaire.nom_complet}</p>
                          <p className="text-[11px] text-500 flex items-center gap-1 mt-0.5 truncate">
                            <Mail className="w-3 h-3 flex-shrink-0" /> {stagiaire.email || '—'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 sm:px-6">
                      <p className="text-sm font-bold text-100 truncate">{stagiaire.filiere?.code}</p>
                      <span className="badge-secondary text-[10px] mt-1 inline-block">{stagiaire.groupe}</span>
                    </td>
                    <td className="py-3 px-4 sm:px-6 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-400">
                        <Hash className="w-3 h-3 opacity-30 flex-shrink-0" />
                        <span className="truncate font-mono text-xs">{stagiaire.code_massar}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 sm:px-6">
                      <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border whitespace-nowrap inline-block
                        ${stagiaire.statut === 'actif'    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                        ${stagiaire.statut === 'suspendu' ? 'bg-red-50 text-red-600 border-red-200'             : ''}
                        ${stagiaire.statut === 'diplome'  ? 'bg-blue-50 text-blue-700 border-blue-200'          : ''}
                        ${stagiaire.statut === 'abandon'  ? 'bg-gray-50 text-gray-500 border-gray-200'          : ''}
                      `}>
                        {stagiaire.statut}
                      </span>
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button
                          className="p-1.5 rounded-lg text-500 hover:text-secondary hover:bg-overlay transition-all"
                          title="Voir profil"
                          onClick={() => { setSelectedStagiaireId(stagiaire.id); setIsDetailsModalOpen(true); }}
                        >
                          <Eye size={15} />
                        </button>
                        {user?.role === 'admin' && (
                          <>
                            <button
                              className="p-1.5 rounded-lg text-500 hover:text-primary hover:bg-overlay transition-all"
                              title="Modifier"
                              onClick={() => { setStagiaireToEdit(stagiaire); setIsEditModalOpen(true); }}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              className="p-1.5 rounded-lg text-500 hover:text-red-500 hover:bg-red-50 transition-all"
                              title="Supprimer"
                              onClick={() => { setStagiaireToDelete(stagiaire); setIsDeleteModalOpen(true); }}
                            >
                              <Trash2 size={15} />
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
          <div className="p-4 sm:p-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-[10px] sm:text-xs font-bold text-500 uppercase tracking-widest whitespace-nowrap">
              <span className="text-200">{stagiairesData.meta.from}</span>-<span className="text-200">{stagiairesData.meta.to}</span> / <span className="text-200">{stagiairesData.meta.total}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {stagiairesData.meta.links.map((link, i) => (
                <button
                  key={i}
                  disabled={!link.url || link.active}
                  onClick={() => {
                    const url = new URL(link.url);
                    setFilters({...filters, page: url.searchParams.get('page')});
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 border ${
                    link.active
                      ? 'text-white border-transparent'
                      : 'border-border text-500 hover:text-100 hover:border-gray-brand'
                  } ${!link.url ? 'opacity-25 cursor-not-allowed' : ''}`}
                  style={link.active ? { background: '#2660A4' } : {}}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} title="Ajouter un stagiaire" maxWidth="max-w-2xl">
        <StagiaireForm filieres={filieres} onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      <Modal isOpen={isDetailsModalOpen} closeModal={() => setIsDetailsModalOpen(false)} title="Profil du stagiaire" maxWidth="max-w-4xl">
        {selectedStagiaireId && <StagiaireDetails stagiaireId={selectedStagiaireId} />}
      </Modal>

      <Modal isOpen={isEditModalOpen} closeModal={() => setIsEditModalOpen(false)} title="Modifier le stagiaire" maxWidth="max-w-2xl">
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
        message={`Êtes-vous sûr de vouloir supprimer ${stagiaireToDelete?.nom_complet} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default StagiairesList;

