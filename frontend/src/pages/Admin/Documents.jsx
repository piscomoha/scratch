import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, UploadCloud, Search, Filter, X, File, Image as ImageIcon, 
  FileSpreadsheet, FileIcon, Trash2, Download, CheckCircle, Clock, Plus, Folder, Send, Users, User as UserIcon, GraduationCap
} from 'lucide-react';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import CustomSelect from '../../components/ui/CustomSelect';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useFilieres, useFormateurs } from '../../hooks/useQueries';

const initialFilters = {
  search: '',
  category: '',
  filiere_id: '',
  module_id: '',
  groupe: '',
  annee_formation: '',
  user_id: '',
};

const initialUploadForm = {
  title: '',
  category: 'schedule',
  shared_with: 'all',
  filiere_id: '',
  module_id: '',
  groupe: '',
  annee_formation: '',
  file: null,
  notify: false
};

const toSelectValue = (value) => value ?? '';

const filledParams = (values) => Object.fromEntries(
  Object.entries(values).filter(([, value]) => value !== '' && value !== null && value !== undefined)
);

const MotionDiv = motion.div;

const Documents = () => {
  const { notify } = useNotification();
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('documents');
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState(initialFilters);
  const { data: filieres } = useFilieres();
  const { data: formateurs } = useFormateurs();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDistributeModalOpen, setIsDistributeModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [docToDistribute, setDocToDistribute] = useState(null);
  const [distributeLoading, setDistributeLoading] = useState(false);
  const [distributionForm, setDistributionForm] = useState({
    recipients: [], // ['formateurs', 'stagiaires', 'groups', 'filieres']
    target_ids: {
      groups: [],
      filieres: []
    }
  });

  const [uploadForm, setUploadForm] = useState(initialUploadForm);

  const [filterModules, setFilterModules] = useState([]);
  const [uploadModules, setUploadModules] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (filters.filiere_id) {
      api.get(`/modules?filiere_id=${filters.filiere_id}`).then(({ data }) => setFilterModules(data.data));
    } else {
      setFilterModules([]);
      setFilters(prev => ({...prev, module_id: ''}));
    }
  }, [filters.filiere_id]);

  useEffect(() => {
    if (uploadForm.filiere_id) {
      api.get(`/modules?filiere_id=${uploadForm.filiere_id}`).then(({ data }) => setUploadModules(data.data));
    } else {
      setUploadModules([]);
      setUploadForm(prev => ({...prev, module_id: ''}));
    }
  }, [uploadForm.filiere_id]);

  const categories = [
    { value: 'schedule', label: 'Emploi du Temps' },
    { value: 'administrative', label: 'Documents Administratifs' }
  ];

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/documents', { params: filledParams(filters) });
      setDocuments(Array.isArray(data.data) ? data.data : []);
    } catch {
      notify('error', 'Erreur', 'Impossible de charger les documents.');
    } finally {
      setLoading(false);
    }
  }, [filters, notify]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDocuments();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchDocuments]);

  const handleFileSelect = (e) => {
    const files = e.target.files || e.dataTransfer?.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 20 * 1024 * 1024) {
        notify('error', 'Fichier trop volumineux', 'La taille maximum est de 20 Mo.');
        return;
      }
      setUploadForm({ ...uploadForm, file, title: uploadForm.title || file.name.split('.')[0] });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      notify('error', 'Fichier manquant', 'Veuillez sélectionner un fichier.');
      return;
    }
    if (!uploadForm.title) {
      notify('error', 'Titre manquant', 'Veuillez saisir un titre.');
      return;
    }

    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('category', uploadForm.category);
    formData.append('shared_with', uploadForm.shared_with);
    if (uploadForm.filiere_id) formData.append('filiere_id', uploadForm.filiere_id);
    if (uploadForm.module_id) formData.append('module_id', uploadForm.module_id);
    if (uploadForm.groupe) formData.append('groupe', uploadForm.groupe);
    if (uploadForm.annee_formation) formData.append('annee_formation', uploadForm.annee_formation);
    formData.append('file', uploadForm.file);
    if (uploadForm.notify) formData.append('notify', 'true');

    setUploading(true);
    try {
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      notify('success', 'Succès', 'Document importé avec succès.');
      setIsUploadModalOpen(false);
      setUploadForm(initialUploadForm);
      
      // Clear all filters - this will trigger the useEffect to fetch documents
      setFilters(initialFilters);
    } catch (error) {
      notify('error', 'Erreur', error.response?.data?.message || 'Erreur lors de l\'importation.');
    } finally {
      setUploading(false);
    }
  };

  const handleDistributeSubmit = async (e) => {
    e.preventDefault();
    if (distributionForm.recipients.length === 0) {
      notify('error', 'Destinataires manquants', 'Veuillez sélectionner au moins un destinataire.');
      return;
    }

    setDistributeLoading(true);
    try {
      await api.post(`/documents/${docToDistribute.id}/distribute`, distributionForm);
      notify('success', 'Succès', 'Notifications envoyées avec succès.');
      setIsDistributeModalOpen(false);
      setDistributionForm({ recipients: [], target_ids: { groups: [], filieres: [] } });
    } catch {
      notify('error', 'Erreur', 'Impossible d\'envoyer les notifications.');
    } finally {
      setDistributeLoading(false);
    }
  };

  const toggleRecipient = (recipient) => {
    setDistributionForm(prev => {
      const recipients = prev.recipients.includes(recipient)
        ? prev.recipients.filter(r => r !== recipient)
        : [...prev.recipients, recipient];
      return { ...prev, recipients };
    });
  };

  const confirmDelete = async () => {
    if (!docToDelete) return;
    try {
      await api.delete(`/documents/${docToDelete.id}`);
      notify('success', 'Supprimé', 'Le document a été supprimé.');
      fetchDocuments();
    } catch {
      notify('error', 'Erreur', 'Impossible de supprimer le document.');
    } finally {
      setIsDeleteModalOpen(false);
      setDocToDelete(null);
    }
  };

  const getFileIcon = (type) => {
    const t = type?.toLowerCase();
    if (['pdf'].includes(t)) return <FileText className="text-red-400" />;
    if (['xls', 'xlsx', 'csv'].includes(t)) return <FileSpreadsheet className="text-emerald-400" />;
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(t)) return <ImageIcon className="text-blue-400" />;
    return <FileIcon className="text-400" />;
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const recentDocs = documents.slice(0, 4);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#2E8B57', borderRadius:1 }} />
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#8C9BA8', borderRadius:1 }} />
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#2660A4', borderRadius:1 }} />
            <span className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Ressources</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-100">Ressources & Plannings</h1>
          <p className="text-400 text-sm mt-0.5">Gestion documentaire et informations des formateurs</p>
        </div>
        
        <div className="flex items-center gap-1 bg-input p-1.5 rounded-xl border border-border">
          <button 
            onClick={() => setActiveTab('documents')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'documents' ? 'bg-[#2660A4] text-white shadow-sm' : 'text-500 hover:text-100'}`}
          >
            Documents
          </button>
          <button 
            onClick={() => setActiveTab('formateurs')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'formateurs' ? 'bg-[#2660A4] text-white shadow-sm' : 'text-500 hover:text-100'}`}
          >
            Formateurs
          </button>
        </div>
      </div>

      {activeTab === 'documents' ? (
        <>
          {/* Recent Uploads */}
          {recentDocs.length > 0 && !filters.search && !filters.category && !filters.filiere_id && (
            <MotionDiv 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-lg font-black text-100 flex items-center gap-2">
                  <Clock size={20} className="text-primary" />
                  Récemment ajoutés
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentDocs.map((doc, index) => (
                  <MotionDiv
                    key={`recent-${doc.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-2xl p-4 flex items-center gap-4 hover:border-primary/30 transition-all group cursor-pointer"
                    onClick={() => window.open(doc.file_url, '_blank')}
                  >
                    <div className="w-10 h-10 rounded-xl bg-overlay flex items-center justify-center shrink-0">
                      {getFileIcon(doc.file_type)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-100 truncate">{doc.title}</p>
                      <p className="text-[10px] text-500 font-medium uppercase tracking-widest">{new Date(doc.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </MotionDiv>
                ))}
              </div>
            </MotionDiv>
          )}

       {/* Filters & Actions */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
  <div className="flex-1 w-full glass rounded-2xl p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

      {/* Recherche */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">
          Recherche
        </label>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />

          <input
            type="text"
            placeholder="Nom du document..."
            className="w-full bg-input border border-border rounded-xl py-2.5 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={filters.search}
            onChange={(e) =>
              setFilters({
                ...filters,
                search: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* Formateur */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">
          Formateur
        </label>

        <CustomSelect
          options={[
            { value: '', label: 'Tous les formateurs' },
            ...(formateurs?.map((f) => ({
              value: f.id,
              label: f.name,
            })) || []),
          ]}
          value={filters.user_id}
          onChange={(val) =>
            setFilters({
              ...filters,
              user_id: toSelectValue(val),
            })
          }
        />
      </div>

      {/* Catégorie */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">
          Catégorie
        </label>

        <CustomSelect
          options={[
            { value: '', label: 'Toutes les catégories' },
            ...categories,
          ]}
          value={filters.category}
          onChange={(val) =>
            setFilters({
              ...filters,
              category: toSelectValue(val),
            })
          }
        />
      </div>

      {/* Filière */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">
          Filière
        </label>

        <CustomSelect
          options={[
            { value: '', label: 'Toutes les filières' },
            ...(filieres?.map((f) => ({
              value: f.id,
              label: f.code,
            })) || []),
          ]}
          value={filters.filiere_id}
          onChange={(val) =>
            setFilters({
              ...filters,
              filiere_id: toSelectValue(val),
              module_id: '',
            })
          }
        />
      </div>

      {/* Module */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">
          Module
        </label>

        <CustomSelect
          options={[
            { value: '', label: 'Tous les modules' },
            ...(filterModules?.map((m) => ({
              value: m.id,
              label: `${m.code} - ${m.intitule}`,
            })) || []),
          ]}
          value={filters.module_id}
          onChange={(val) =>
            setFilters({
              ...filters,
              module_id: toSelectValue(val),
            })
          }
          disabled={!filters.filiere_id}
        />
      </div>

      {/* Année */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">
          Année
        </label>

        <CustomSelect
          options={[
            { value: '', label: 'Toutes les années' },
            { value: '1', label: '1ère année' },
            { value: '2', label: '2ème année' },
            { value: '3', label: '3ème année' },
          ]}
          value={filters.annee_formation}
          onChange={(val) =>
            setFilters({
              ...filters,
              annee_formation: toSelectValue(val),
            })
          }
        />
      </div>

      {/* Groupe */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">
          Groupe
        </label>

        <input
          type="text"
          placeholder="Ex: DEV201"
          className="w-full bg-input border border-border rounded-xl py-2.5 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase"
          value={filters.groupe}
          onChange={(e) =>
            setFilters({
              ...filters,
              groupe: e.target.value.toUpperCase(),
            })
          }
        />
      </div>
    </div>
  </div>

  <button
    onClick={() => setIsUploadModalOpen(true)}
    className="btn-primary w-full md:w-auto justify-center h-[92px] shrink-0"
  >
    <UploadCloud size={20} strokeWidth={3} />
    Importer
  </button>
</div>

          {/* Documents Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-bold tracking-widest text-xs uppercase">Chargement...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="glass rounded-2xl py-20 flex flex-col items-center text-center px-4 mt-6">
              <div className="w-20 h-20 rounded-full bg-overlay flex items-center justify-center mb-6 text-500">
                <Folder size={32} />
              </div>
              <h3 className="text-xl font-black text-100 mb-2">Aucun document trouvé</h3>
              <p className="text-500 font-medium max-w-md">Importez des emplois du temps ou des documents administratifs pour commencer.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              <AnimatePresence>
                {documents.map((doc, index) => (
                  <MotionDiv
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-3xl p-6 group hover:border-primary/30 transition-all duration-300 relative flex flex-col"
                  >
                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setDocToDistribute(doc); setIsDistributeModalOpen(true); }}
                          className="p-2 rounded-xl bg-overlay hover:bg-primary hover:text-white text-primary transition-colors"
                          title="Diffuser le document"
                        >
                          <Send size={16} />
                        </button>
                      <a 
                        href={doc.file_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-overlay hover:bg-primary hover:text-white text-100 transition-colors"
                      >
                        <Download size={16} />
                      </a>
                      <button 
                        onClick={() => { setDocToDelete(doc); setIsDeleteModalOpen(true); }}
                        className="p-2 rounded-xl bg-overlay hover:bg-red-500 hover:text-white text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-overlay flex items-center justify-center mb-6 border border-border group-hover:scale-110 transition-transform relative">
                      {getFileIcon(doc.file_type)}
                      {new Date() - new Date(doc.created_at) < 2 * 24 * 60 * 60 * 1000 && (
                        <span className="absolute -top-2 -right-2 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-lg"></span>
                      )}
                    </div>

                    <h3 className="font-bold text-100 text-lg mb-1 truncate pr-16" title={doc.title}>{doc.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-500 mb-4">
                      <span className="uppercase tracking-widest font-bold">{doc.file_type}</span>
                      <span>•</span>
                      <span>{formatSize(doc.file_size)}</span>
                      <span>•</span>
                      <span>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>

                    {doc.formateur && (
                      <p className="text-[10px] text-500 font-bold uppercase tracking-widest mb-3">
                        Ajouté par: <span className="text-100">{doc.formateur.name}</span>
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-border flex flex-wrap gap-2">
                      <span className="px-2 py-1 rounded-lg bg-overlay text-[9px] font-black uppercase tracking-widest text-400">
                        {categories.find(c => c.value === doc.category)?.label || doc.category}
                      </span>
                      {doc.shared_with && (
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                          doc.shared_with === 'all' ? 'bg-primary/10 text-primary border-primary/20' :
                          doc.shared_with === 'formateurs' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}>
                          {doc.shared_with === 'all' ? 'Public' : doc.shared_with === 'formateurs' ? 'Formateurs' : 'Stagiaires'}
                        </span>
                      )}
                      {doc.filiere && (
                        <span className="px-2 py-1 rounded-lg bg-primary/10 text-[9px] font-black uppercase tracking-widest text-primary border border-primary/20">
                          {doc.filiere.code}
                        </span>
                      )}
                      {doc.groupe && (
                        <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-[9px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20">
                          {doc.groupe}
                        </span>
                      )}
                      {doc.module && (
                        <span className="px-2 py-1 rounded-lg bg-purple-500/10 text-[9px] font-black uppercase tracking-widest text-purple-400 border border-purple-500/20">
                          {doc.module.code}
                        </span>
                      )}
                      {doc.annee_formation && (
                        <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-[9px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/20">
                          {doc.annee_formation}A
                        </span>
                      )}
                    </div>
                  </MotionDiv>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-100 flex items-center gap-2">
              <Folder size={24} className="text-primary" />
              Annuaire des Formateurs
            </h2>
            <div className="text-sm font-bold text-500 bg-overlay px-4 py-2 rounded-xl border border-border">
              {formateurs?.length || 0} Formateurs actifs
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formateurs?.map((formateur, i) => (
              <MotionDiv 
                key={formateur.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-8 rounded-2xl glass border border-border hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
                
                <div className="flex items-center gap-5 mb-8 relative z-10">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/20">
                    {formateur.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-100 mb-1">{formateur.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <p className="text-[10px] text-500 font-bold uppercase tracking-widest">{formateur.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-500 mb-3 flex items-center gap-2">
                      <Folder size={12} /> Affectations & Groupes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formateur.affectations?.length > 0 ? (
                        formateur.affectations.map(aff => {
                          const filiereCode = filieres?.find(f => f.id === aff.filiere_id)?.code || '';
                          return (
                            <div key={aff.id} className="group/tag flex flex-col items-start px-3 py-2 rounded-2xl bg-overlay border border-border hover:border-primary/30 transition-all">
                              <span className="text-primary text-xs font-black tracking-widest uppercase">
                                {aff.groupe}
                              </span>
                              {filiereCode && (
                                <span className="text-[9px] font-bold text-500 uppercase tracking-widest mt-0.5">
                                  {filiereCode}
                                </span>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="w-full p-4 rounded-2xl bg-overlay border border-dashed border-border text-center">
                          <span className="text-xs text-500 italic font-medium">Aucune affectation active</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-500 mb-1">Activité</p>
                      <p className="text-sm text-100 font-black flex items-center gap-2">
                        <FileText size={14} className="text-primary" />
                        {documents.filter(d => d.user_id === formateur.id).length} Documents
                      </p>
                    </div>
                    <button 
                      className="p-3 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                      onClick={() => {
                        setFilters({...filters, user_id: formateur.id});
                        setActiveTab('documents');
                      }}
                    >
                      <Search size={18} />
                    </button>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => !uploading && setIsUploadModalOpen(false)}
          />
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-xl glass rounded-2xl p-8 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={() => !uploading && setIsUploadModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-500 hover:text-100 hover:bg-overlay transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black text-100 mb-8 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20 text-primary">
                <UploadCloud size={24} />
              </div>
              Importer un document
            </h2>

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">Titre du document *</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    placeholder="Ex: Emploi du temps S1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">Catégorie *</label>
                  <CustomSelect
                    options={categories}
                    value={uploadForm.category}
                    onChange={(val) => setUploadForm({...uploadForm, category: toSelectValue(val)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">Partager avec</label>
                  <CustomSelect
                    options={[
                      { value: 'all', label: 'Tout le monde' },
                      { value: 'formateurs', label: 'Formateurs uniquement' },
                      { value: 'stagiaires', label: 'Stagiaires uniquement' }
                    ]}
                    value={uploadForm.shared_with}
                    onChange={(val) => setUploadForm({...uploadForm, shared_with: toSelectValue(val)})}
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input 
                    type="checkbox" 
                    id="notify"
                    className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary/20 cursor-pointer"
                    checked={uploadForm.notify}
                    onChange={(e) => setUploadForm({...uploadForm, notify: e.target.checked})}
                  />
                  <label htmlFor="notify" className="text-xs font-bold text-100 cursor-pointer select-none">
                    Notifier les destinataires par email/app
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">Filière concernée</label>
                  <CustomSelect
                    options={[
                      { value: '', label: 'Général / Toutes' },
                      ...(filieres?.map(f => ({ value: f.id, label: f.code })) || [])
                    ]}
                    value={uploadForm.filiere_id}
                    onChange={(val) => setUploadForm({...uploadForm, filiere_id: toSelectValue(val), module_id: ''})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">Module (Optionnel)</label>
                  <CustomSelect
                    options={[
                      { value: '', label: 'Général / Tous' },
                      ...(uploadModules?.map(m => ({ value: m.id, label: m.code + ' - ' + m.intitule })) || [])
                    ]}
                    value={uploadForm.module_id}
                    onChange={(val) => setUploadForm({...uploadForm, module_id: toSelectValue(val)})}
                    disabled={!uploadForm.filiere_id}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">Groupe (Optionnel)</label>
                  <input 
                    type="text" 
                    className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase"
                    value={uploadForm.groupe}
                    onChange={(e) => setUploadForm({...uploadForm, groupe: e.target.value.toUpperCase()})}
                    placeholder="Ex: DEV201"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">Année (Optionnel)</label>
                  <CustomSelect
                    options={[
                      { value: '', label: 'Non spécifiée' },
                      { value: '1', label: '1ère année' },
                      { value: '2', label: '2ème année' },
                      { value: '3', label: '3ème année' }
                    ]}
                    value={uploadForm.annee_formation}
                    onChange={(val) => setUploadForm({...uploadForm, annee_formation: toSelectValue(val)})}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">Fichier * (PDF, Image, Excel... Max 20Mo)</label>
                <div 
                  className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 relative overflow-hidden group ${
                    uploadForm.file ? 'border-primary bg-primary/5' : 
                    dragActive ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-border hover:border-primary/50 hover:bg-overlay'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  />
                  
                  {uploadForm.file ? (
                    <div className="flex flex-col items-center gap-3 relative z-20">
                      <div className="p-4 rounded-2xl bg-primary/20 text-primary">
                        <CheckCircle size={32} />
                      </div>
                      <p className="font-bold text-100 truncate max-w-xs">{uploadForm.file.name}</p>
                      <p className="text-xs text-500 font-medium">{formatSize(uploadForm.file.size)}</p>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadForm({...uploadForm, file: null});
                        }}
                        className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors relative z-30"
                      >
                        Changer de fichier
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 relative z-20 pointer-events-none">
                      <div className={`p-4 rounded-2xl bg-overlay text-500 transition-all duration-300 ${dragActive ? 'scale-110 text-primary bg-primary/10' : 'group-hover:text-primary group-hover:scale-110'}`}>
                        <UploadCloud size={32} />
                      </div>
                      <p className="font-bold text-100">
                        {dragActive ? 'Relâchez pour importer' : 'Glissez-déposez ou cliquez'}
                      </p>
                      <p className="text-xs text-500 font-medium">Pour sélectionner un document</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-8 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={uploading}
                  className="px-6 py-3 text-400 hover:text-100 hover:bg-overlay rounded-xl font-bold text-xs uppercase tracking-widest transition-all text-center w-full sm:w-auto"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadForm.file}
                  className="btn-primary w-full sm:w-auto"
                >
                  {uploading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Envoi...</>
                  ) : (
                    <><UploadCloud size={16} strokeWidth={3} /> Importer</>
                  )}
                </button>
              </div>
            </form>
          </MotionDiv>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer le document"
        message={`Voulez-vous vraiment supprimer "${docToDelete?.title}" ? Cette action est définitive.`}
        confirmText="Supprimer"
      />

      {/* Distribution Modal */}
      {isDistributeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => !distributeLoading && setIsDistributeModalOpen(false)}
          />
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md glass rounded-2xl p-8 shadow-2xl"
          >
            <button 
              onClick={() => !distributeLoading && setIsDistributeModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-500 hover:text-100 hover:bg-overlay transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black text-100 mb-2 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20 text-primary">
                <Send size={24} />
              </div>
              Diffuser le document
            </h2>
            <p className="text-500 text-sm font-medium mb-8">Sélectionnez les destinataires qui recevront une notification pour ce document.</p>

            <form onSubmit={handleDistributeSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => toggleRecipient('formateurs')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                    distributionForm.recipients.includes('formateurs')
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/30 text-500'
                  }`}
                >
                  <UserIcon size={24} className={distributionForm.recipients.includes('formateurs') ? 'text-primary' : 'group-hover:text-primary'} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Formateurs</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleRecipient('stagiaires')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                    distributionForm.recipients.includes('stagiaires')
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/30 text-500'
                  }`}
                >
                  <GraduationCap size={24} className={distributionForm.recipients.includes('stagiaires') ? 'text-primary' : 'group-hover:text-primary'} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Stagiaires</span>
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1 block">Cibler des Filières (Optionnel)</label>
                  <div className="flex flex-wrap gap-2">
                    {filieres?.slice(0, 6).map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          const exists = distributionForm.target_ids.filieres.includes(f.id);
                          setDistributionForm(prev => ({
                            ...prev,
                            target_ids: {
                              ...prev.target_ids,
                              filieres: exists 
                                ? prev.target_ids.filieres.filter(id => id !== f.id)
                                : [...prev.target_ids.filieres, f.id]
                            }
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          distributionForm.target_ids.filieres.includes(f.id)
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                            : 'bg-overlay border-border text-500 hover:border-primary/30'
                        }`}
                      >
                        {f.code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <button
                  type="submit"
                  disabled={distributeLoading || distributionForm.recipients.length === 0}
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 transition-all"
                >
                  {distributeLoading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Envoi...</>
                  ) : (
                    <><Send size={16} strokeWidth={3} /> Diffuser maintenant</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDistributeModalOpen(false)}
                  disabled={distributeLoading}
                  className="w-full py-4 text-500 hover:text-100 hover:bg-overlay rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          </MotionDiv>
        </div>
      )}
    </div>
  );
};

export default Documents;
