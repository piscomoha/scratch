import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Plus, 
  Link as LinkIcon, 
  X, 
  Check, 
  Shield, 
  User, 
  Layers,
  ChevronRight,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  BookOpen,
  Loader2,
  Mail,
  Lock
} from 'lucide-react';
import CustomSelect from '../../components/ui/CustomSelect';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

import { useFormateurs, useFilieres, useUpdateAffectations, useStagiaires, useCreateUser } from '../../hooks/useQueries';

const Assignments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filiereFilter, setFiliereFilter] = useState('all');
  const [activeFormateur, setActiveFormateur] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [customGroups, setCustomGroups] = useState([]);
  const [newGroupCode, setNewGroupCode] = useState('');
  const [newGroupFiliereId, setNewGroupFiliereId] = useState('');

  const { data: formateurs, isLoading: loadingFormateurs } = useFormateurs();
  const { data: filieres } = useFilieres();
  const { data: stagiairesData } = useStagiaires({ per_page: 500 });
  const updateMutation = useUpdateAffectations();
  const createMutation = useCreateUser();

  const [newFormateur, setNewFormateur] = useState({ name: '', email: '', password: '' });

  // Extract unique groups from stagiaires and combine with custom added groups
  const baseGroups = Array.from(new Set(stagiairesData?.data?.map(s => JSON.stringify({ id: s.groupe, filiere_id: s.filiere_id })) || []))
    .map(g => JSON.parse(g));
    
  const groups = [...baseGroups, ...customGroups];

  const filteredFormateurs = formateurs?.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filiereFilter === 'all') return matchesSearch;
    
    const matchesFiliere = f.affectations?.some(a => a.filiere_id.toString() === filiereFilter);
    return matchesSearch && matchesFiliere;
  }) || [];

  const handleOpenAssign = (formateur) => {
    setActiveFormateur(formateur);
    setSelectedGroups(formateur.affectations.map(a => a.groupe));
    setIsModalOpen(true);
  };

  const handleSaveAssignment = () => {
    const affectations = selectedGroups.map(gId => {
      const g = groups.find(x => x.id === gId);
      return {
        filiere_id: g?.filiere_id,
        groupe: gId
      };
    }).filter(a => a.filiere_id);

    updateMutation.mutate({
      user_id: activeFormateur.id,
      affectations
    }, {
      onSuccess: () => {
        toast.success('Affectations mises à jour');
        setIsModalOpen(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour des affectations');
      }
    });
  };

  const handleCreateFormateur = (e) => {
    e.preventDefault();
    createMutation.mutate(newFormateur, {
      onSuccess: () => {
        toast.success('Formateur créé avec succès');
        setIsCreateModalOpen(false);
        setNewFormateur({ name: '', email: '', password: '' });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la création');
      }
    });
  };

  const toggleGroupSelection = (groupId) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId) 
        : [...prev, groupId]
    );
  };

  const handleAddCustomGroup = () => {
    if (!newGroupCode.trim() || !newGroupFiliereId) {
      toast.error('Veuillez remplir le nom du groupe et la filière.');
      return;
    }
    
    // Check if group already exists
    if (groups.some(g => g.id.toLowerCase() === newGroupCode.toLowerCase())) {
      toast.error('Ce groupe existe déjà.');
      return;
    }
    
    const newGroup = { id: newGroupCode.trim().toUpperCase(), filiere_id: parseInt(newGroupFiliereId) };
    setCustomGroups(prev => [...prev, newGroup]);
    setSelectedGroups(prev => [...prev, newGroup.id]); // auto select it
    setNewGroupCode('');
    toast.success('Nouveau groupe ajouté et sélectionné.');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#2E8B57', borderRadius:1 }} />
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#8C9BA8', borderRadius:1 }} />
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#2660A4', borderRadius:1 }} />
            <span className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-100">Gestion des Affectations</h1>
          <p className="text-400 text-sm mt-0.5">Associez les formateurs à leurs groupes respectifs</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex-shrink-0"
        >
          <Plus size={16} strokeWidth={2.5} /> Nouveau Formateur
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Formateurs List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass rounded-2xl p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
              <div className="relative flex-1 group w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Rechercher un formateur..." 
                  className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="w-full md:w-48">
                  <CustomSelect 
                    options={[
                      { value: 'all', label: 'Toutes les filières' },
                      ...(filieres?.map(f => ({ value: f.id.toString(), label: f.code })) || [])
                    ]}
                    value={filiereFilter}
                    onChange={(val) => setFiliereFilter(val)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {loadingFormateurs ? (
                <div className="flex flex-col items-center py-20 opacity-30">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <p className="font-bold uppercase tracking-widest text-xs">Chargement des formateurs...</p>
                </div>
              ) : filteredFormateurs.length === 0 ? (
                <div className="flex flex-col items-center py-20 opacity-30">
                  <Users className="w-10 h-10 mb-4" />
                  <p className="font-bold uppercase tracking-widest text-xs">Aucun formateur trouvé</p>
                </div>
              ) : filteredFormateurs.map((formateur, i) => (
                <motion.div 
                  key={formateur.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-overlay border border-border hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center text-primary font-black text-xl border border-primary/10 group-hover:scale-110 transition-transform">
                        {formateur.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-100">{formateur.name}</h3>
                        <p className="text-xs text-500 font-medium">{formateur.email}</p>
                      </div>
                    </div>

                    <div className="flex-1 px-4">
                      <div className="flex flex-wrap gap-2">
                        {formateur.affectations?.length > 0 ? (
                          formateur.affectations.map(aff => (
                            <span key={aff.id} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase border border-primary/10">
                              {aff.groupe}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-500 italic">Aucun groupe affecté</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleOpenAssign(formateur)}
                        className="flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white px-5 py-2.5 rounded-xl transition-all font-bold text-xs border border-primary/20"
                      >
                        <LinkIcon size={14} /> Affecter
                      </button>
                      <button className="p-2.5 rounded-xl text-500 hover:text-100 hover:bg-overlay transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Groups Overview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-2xl p-8 h-full">
            <h3 className="text-xl font-bold text-100 mb-6 flex items-center gap-3">
              <Layers className="w-5 h-5 text-amber-400" />
              État des Groupes
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {groups.map((group) => {
                const assignedTo = formateurs?.find(f => f.affectations.some(a => a.groupe === group.id))?.name;
                return (
                  <div key={group.id} className="p-4 rounded-2xl bg-overlay border border-border group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-black text-100">{group.id}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${assignedTo ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {assignedTo ? 'Affecté' : 'Libre'}
                      </span>
                    </div>
                    <p className="text-[10px] text-500 font-medium line-clamp-1">{filieres?.find(f => f.id === group.filiere_id)?.libelle}</p>
                    {assignedTo && (
                      <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                        <User size={10} className="text-primary" />
                        <span className="text-[10px] text-primary font-bold">{assignedTo}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass rounded-2xl p-6 sm:p-10 border border-border shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-overlay-hover text-500 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-6 mb-8">
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-2xl shadow-lg">
                  {activeFormateur?.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-100">{activeFormateur?.name}</h2>
                  <p className="text-primary font-bold tracking-widest uppercase text-[10px] mt-1">Affectation de groupes</p>
                </div>
              </div>

              {/* Add Custom Group Form */}
              <div className="bg-overlay p-4 rounded-xl border border-border mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-500 mb-3">Créer un nouveau groupe</p>
                <div className="flex flex-col sm:flex-row items-end gap-3">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-500 mb-1 ml-1">Nom du groupe</label>
                    <input 
                      type="text"
                      placeholder="Ex: DEV101"
                      className="w-full bg-input border border-border rounded-xl py-2 px-3 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      value={newGroupCode}
                      onChange={(e) => setNewGroupCode(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-500 mb-1 ml-1">Filière</label>
                    <CustomSelect 
                      options={[
                        { value: '', label: 'Sélectionner...' },
                        ...(filieres?.map(f => ({ value: f.id.toString(), label: f.code })) || [])
                      ]}
                      value={newGroupFiliereId}
                      onChange={setNewGroupFiliereId}
                    />
                  </div>
                  <button 
                    onClick={handleAddCustomGroup}
                    className="btn-primary py-2.5 px-4 whitespace-nowrap h-[42px]"
                  >
                    <Plus size={16} /> Ajouter
                  </button>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-100">Groupes disponibles</h3>
                  <span className="text-xs text-500">{selectedGroups.length} sélectionné(s)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {groups.map((group) => {
                    const isSelected = selectedGroups.includes(group.id);
                    const filiereCode = filieres?.find(f => f.id === group.filiere_id)?.code;
                    return (
                      <button
                        key={group.id}
                        onClick={() => toggleGroupSelection(group.id)}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                          isSelected 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'bg-overlay border-border text-500 hover:border-primary/30'
                        }`}
                      >
                        <div className="text-left">
                          <span className="block text-xs font-black">{group.id}</span>
                          <span className="block text-[8px] opacity-60 uppercase tracking-widest mt-0.5">{filiereCode}</span>
                        </div>
                        {isSelected && <Check size={16} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 rounded-2xl font-bold text-sm text-500 hover:bg-overlay transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSaveAssignment}
                  disabled={updateMutation.isPending}
                  className="btn-primary"
                >
                  {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <LinkIcon size={18} />}
                  Confirmer l'affectation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Formateur Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        closeModal={() => setIsCreateModalOpen(false)}
        title="Nouveau Formateur"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateFormateur} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-500 uppercase tracking-widest mb-2 ml-1">Nom complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500" />
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Ahmed Alaoui"
                  className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={newFormateur.name}
                  onChange={(e) => setNewFormateur({...newFormateur, name: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-500 uppercase tracking-widest mb-2 ml-1">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500" />
                <input 
                  type="email" 
                  required
                  placeholder="Ex: ahmed@ofppt.ma"
                  className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={newFormateur.email}
                  onChange={(e) => setNewFormateur({...newFormateur, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-500 uppercase tracking-widest mb-2 ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={newFormateur.password}
                  onChange={(e) => setNewFormateur({...newFormateur, password: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-xs text-500 hover:bg-overlay transition-all"
            >
              Annuler
            </button>
            <button 
              type="submit"
              disabled={createMutation.isPending}
              className="btn-primary"
            >
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus size={16} />}
              Créer le formateur
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Assignments;
