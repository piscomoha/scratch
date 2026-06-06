import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useStages, useMyStage, useCreateStage, useUpdateStage, useCheckStageNotifications } from '../../hooks/useQueries';
import {
  Plus,
  Edit2,
  Eye,
  Download,
  CheckCircle,
  MapPin,
  Building2,
  Calendar,
  Briefcase,
  Loader2,
  Shield,
  FileCheck2,
  User,
  Phone,
  Mail,
  FileText,
  Sparkles,
  Clock,
  AlertTriangle,
  Check,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Award,
  Search,
  ChevronRight,
} from 'lucide-react';
import api from '../../api/axios';
import CustomSelect from '../../components/ui/CustomSelect';
import Modal from '../../components/ui/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StagesList = () => {
  const { user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();

  // Filters for admin/formateur
  const [filters, setFilters] = useState({
    statut: '',
    entreprise_ville: '',
    soumis_par_stagiaire: '',
    search: '',
    page: 1,
  });

  // Queries
  const isAdminOrFormateur = user?.role === 'admin' || user?.role === 'formateur';
  const isStagiaire = user?.role === 'stagiaire';

  const { data: stagesData, isLoading: stagesLoading, refetch: refetchStages } = useStages(
    isAdminOrFormateur ? filters : {},
    { enabled: isAdminOrFormateur }
  );

  const { data: myStage, isLoading: myStageLoading, refetch: refetchMyStage } = useMyStage();

  // Mutations
  const createStageMutation = useCreateStage();
  const updateStageMutation = useUpdateStage();
  const checkNotifsMutation = useCheckStageNotifications();

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);

  // Stagiaire Search for Add Modal
  const [stagiaireSearch, setStagiaireSearch] = useState('');
  const [stagiaireOptions, setStagiaireOptions] = useState([]);
  const [loadingStagiaires, setLoadingStagiaires] = useState(false);
  const [selectedStagiaire, setSelectedStagiaire] = useState(null);

  // Form State for Add/Edit
  const [form, setForm] = useState({
    entreprise_nom: '',
    entreprise_secteur: '',
    entreprise_ville: '',
    responsable_nom: '',
    responsable_telephone: '',
    responsable_email: '',
    date_debut: '',
    date_fin: '',
    duree_semaines: '',
    note_entreprise: '',
    rapport_soumis: false,
    statut: 'en_attente',
    papiers_administratifs_ok: false,
    observations: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Auto-check notifications on mount for Admin
  useEffect(() => {
    if (user?.role === 'admin') {
      checkNotifsMutation.mutate(null, {
        onSuccess: (res) => {
          if (res?.output && res.output.includes('notification(s) envoyée(s)')) {
            const count = parseInt(res.output);
            if (count > 0) {
              notify('info', 'Alertes de stage', `${count} nouvelle(s) notification(s) de stage générée(s).`);
            }
          }
        },
      });
    }
  }, [user]);

  // Fetch Stagiaires for Add Modal Dropdown
  useEffect(() => {
    if (!isAddModalOpen) return;
    const fetchStagiaires = async () => {
      setLoadingStagiaires(true);
      try {
        const { data } = await api.get('/stagiaires', { params: { search: stagiaireSearch } });
        setStagiaireOptions(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStagiaires(false);
      }
    };

    const timer = setTimeout(() => {
      fetchStagiaires();
    }, 300);

    return () => clearTimeout(timer);
  }, [stagiaireSearch, isAddModalOpen]);

  // Handle manual notification check
  const handleCheckNotifications = () => {
    checkNotifsMutation.mutate(null, {
      onSuccess: (res) => {
        notify('success', 'Vérification réussie', 'La vérification des dates de stage a été effectuée.');
        refetchStages();
      },
      onError: () => {
        notify('error', 'Erreur', 'Impossible de vérifier les dates de stage.');
      },
    });
  };

  // Open Modal Forms
  const openAddModal = () => {
    setSelectedStagiaire(null);
    setStagiaireSearch('');
    setForm({
      entreprise_nom: '',
      entreprise_secteur: '',
      entreprise_ville: '',
      responsable_nom: '',
      responsable_telephone: '',
      responsable_email: '',
      date_debut: '',
      date_fin: '',
      duree_semaines: '',
      note_entreprise: '',
      rapport_soumis: false,
      statut: 'en_attente',
      papiers_administratifs_ok: false,
      observations: '',
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const openEditModal = (stage) => {
    setSelectedStage(stage);
    setForm({
      entreprise_nom: stage.entreprise_nom || '',
      entreprise_secteur: stage.entreprise_secteur || '',
      entreprise_ville: stage.entreprise_ville || '',
      responsable_nom: stage.responsable_nom || '',
      responsable_telephone: stage.responsable_telephone || '',
      responsable_email: stage.responsable_email || '',
      date_debut: stage.date_debut || '',
      date_fin: stage.date_fin || '',
      duree_semaines: stage.duree_semaines || '',
      note_entreprise: stage.note_entreprise || '',
      rapport_soumis: !!stage.rapport_soumis,
      statut: stage.statut || 'en_attente',
      papiers_administratifs_ok: !!stage.papiers_administratifs_ok,
      observations: stage.observations || '',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const openDetailsModal = (stage) => {
    setSelectedStage(stage);
    setIsDetailsModalOpen(true);
  };

  // Submit Handlers
  const handleCreateStage = (e) => {
    e.preventDefault();
    if (!selectedStagiaire) {
      setFormErrors({ stagiaire_id: ['Le stagiaire est obligatoire.'] });
      return;
    }

    const payload = {
      ...form,
      stagiaire_id: selectedStagiaire.id,
      note_entreprise: form.note_entreprise ? parseFloat(form.note_entreprise) : null,
      duree_semaines: form.duree_semaines ? parseInt(form.duree_semaines) : null,
    };

    createStageMutation.mutate(payload, {
      onSuccess: () => {
        notify('success', 'Stage créé', 'Le stage a été enregistré avec succès.');
        setIsAddModalOpen(false);
      },
      onError: (error) => {
        if (error.response?.status === 422) {
          setFormErrors(error.response.data.errors || {});
        } else {
          notify('error', 'Erreur', 'Impossible de créer le stage.');
        }
      },
    });
  };

  const handleUpdateStage = (e) => {
    e.preventDefault();
    const payload = {
      id: selectedStage.id,
      ...form,
      note_entreprise: form.note_entreprise ? parseFloat(form.note_entreprise) : null,
      duree_semaines: form.duree_semaines ? parseInt(form.duree_semaines) : null,
    };

    updateStageMutation.mutate(payload, {
      onSuccess: () => {
        notify('success', 'Stage modifié', 'Les modifications ont été enregistrées.');
        setIsEditModalOpen(false);
      },
      onError: (error) => {
        if (error.response?.status === 422) {
          setFormErrors(error.response.data.errors || {});
        } else {
          notify('error', 'Erreur', 'Impossible de modifier le stage.');
        }
      },
    });
  };

  // Status Badge Colors Config
  const statutConfig = {
    en_attente: { label: 'En attente', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    en_cours: { label: 'En cours', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    termine: { label: 'Terminé', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    valide: { label: 'Validé', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  };

  // ==================== RENDER: STAGIAIRE VIEW ====================
  if (isStagiaire) {
    if (myStageLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-500 font-medium">Chargement de votre dossier stage...</p>
        </div>
      );
    }

    if (!myStage) {
      return (
        <div className="space-y-8 pb-10 max-w-4xl mx-auto">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: '#2E8B57', borderRadius: 1 }} />
              <div style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: '#8C9BA8', borderRadius: 1 }} />
              <div style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: '#2660A4', borderRadius: 1 }} />
              <span className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Espace Stagiaire</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-100">Mon Stage</h1>
            <p className="text-400 text-sm mt-0.5">Suivi de votre affectation et dossier de stage</p>
          </div>

          <div className="glass rounded-2xl p-8 space-y-8 text-center">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield size={36} className="text-primary" />
            </div>
            <div className="max-w-md mx-auto space-y-3">
              <h2 className="text-xl font-black text-100 tracking-tight">Dossier administratif de stage</h2>
              <p className="text-400 text-sm leading-relaxed">
                Avant de commencer ou déclarer votre stage, vous devez vous assurer que tous les documents requis
                sont complétés auprès de l'administration de l'OFPPT.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-overlay border border-border text-left max-w-lg mx-auto space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-500">Étapes pour valider votre stage :</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                  <p className="text-xs text-200 font-medium">Récupérer et signer votre convention de stage et attestation d'assurance.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                  <p className="text-xs text-200 font-medium">Confirmer le dossier administratif sur votre interface puis remplir le formulaire du stage.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                  <p className="text-xs text-200 font-medium">Envoyer la soumission pour examen et validation par l'administration et votre formateur.</p>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => navigate('/stages/submit')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Remplir mon formulaire de stage <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 pb-10 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: '#2E8B57', borderRadius: 1 }} />
            <div style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: '#8C9BA8', borderRadius: 1 }} />
            <div style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: '#2660A4', borderRadius: 1 }} />
            <span className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Espace Stagiaire</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-100">Détails de mon Stage</h1>
          <p className="text-400 text-sm mt-0.5">Retrouvez le statut et les informations de votre période en entreprise</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-8 space-y-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                    <Building2 size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-100 tracking-tight leading-tight">{myStage.entreprise_nom}</h2>
                    <p className="text-sm text-400 font-medium flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {myStage.entreprise_ville || 'Ville non spécifiée'}
                    </p>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
                  (statutConfig[myStage.statut] || statutConfig.en_attente).bg
                } ${(statutConfig[myStage.statut] || statutConfig.en_attente).color} ${(statutConfig[myStage.statut] || statutConfig.en_attente).border}`}>
                  {(statutConfig[myStage.statut] || statutConfig.en_attente).label}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
                <Shield size={18} className="text-emerald-400" />
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  🛡️ Papiers administratifs validés par l'OFPPT
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-400 flex items-center gap-1.5">
                    <Calendar size={12} /> Date de début
                  </p>
                  <p className="text-sm font-bold text-100">
                    {myStage.date_debut ? new Date(myStage.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non spécifiée'}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-400 flex items-center gap-1.5">
                    <Calendar size={12} /> Date de fin
                  </p>
                  <p className="text-sm font-bold text-100">
                    {myStage.date_fin ? new Date(myStage.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non spécifiée'}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-400 flex items-center gap-1.5">
                    <Clock size={12} /> Durée planifiée
                  </p>
                  <p className="text-sm font-bold text-100">
                    {myStage.duree_semaines ? `${myStage.duree_semaines} semaines` : 'Non spécifiée'}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-400 flex items-center gap-1.5">
                    <Sparkles size={12} /> Secteur
                  </p>
                  <p className="text-sm font-bold text-100">
                    {myStage.entreprise_secteur || 'Non spécifié'}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3 pt-6 border-t border-border">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black uppercase tracking-widest text-400">Progression du stage</p>
                  <span className="text-sm font-black text-primary">{myStage.progression}%</span>
                </div>
                <div className="w-full bg-overlay rounded-full h-2 overflow-hidden border border-border">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${myStage.progression}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Observations / Feedback */}
            {myStage.observations && (
              <div className="glass rounded-2xl p-8 space-y-4">
                <h3 className="font-black text-100 text-lg tracking-tight flex items-center gap-2">
                  <FileText size={18} className="text-primary" /> Remarques / Observations
                </h3>
                <p className="text-sm text-300 leading-relaxed italic bg-overlay p-4 rounded-xl border border-border">
                  "{myStage.observations}"
                </p>
              </div>
            )}
          </div>

          {/* Right sidebar details */}
          <div className="space-y-6">
            {/* Tutor Details */}
            <div className="glass rounded-2xl p-6 space-y-6">
              <h3 className="font-black text-100 text-base tracking-tight flex items-center gap-2">
                <User size={18} className="text-violet-400" /> Tuteur de stage
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 flex-shrink-0">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-400">Nom complet</p>
                    <p className="text-sm font-bold text-200">{myStage.responsable_nom || 'Non spécifié'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-400">Téléphone</p>
                    <p className="text-sm font-bold text-200">{myStage.responsable_telephone || 'Non spécifié'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-400">Email</p>
                    <p className="text-sm font-bold text-200 truncate max-w-[180px]">{myStage.responsable_email || 'Non spécifié'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Note & Assessment Card */}
            {(myStage.note_entreprise || myStage.rapport_soumis) && (
              <div className="glass rounded-2xl p-6 space-y-6">
                <h3 className="font-black text-100 text-base tracking-tight flex items-center gap-2">
                  <Award size={18} className="text-amber-400" /> Évaluation finale
                </h3>

                <div className="space-y-4">
                  {myStage.note_entreprise && (
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-400 mb-1">Note académique /20</p>
                      <p className="text-3xl font-black text-amber-400">{myStage.note_entreprise}</p>
                    </div>
                  )}

                  {myStage.rapport_soumis && (
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <CheckCircle size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Rapport validé</p>
                      </div>
                      {myStage.rapport_path && (
                        <a
                          href={myStage.rapport_path}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-colors"
                          title="Télécharger le rapport"
                        >
                          <Download size={16} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER: ADMIN & FORMATEUR VIEW ====================
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: '#2E8B57', borderRadius: 1 }} />
            <div style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: '#8C9BA8', borderRadius: 1 }} />
            <div style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: '#2660A4', borderRadius: 1 }} />
            <span className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Périodes en entreprise</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-100">Stages</h1>
          <p className="text-400 text-sm mt-0.5">Suivi des périodes en entreprise (PFE & PF)</p>
        </div>

        <div className="flex items-center flex-wrap gap-3 flex-shrink-0">
          {user?.role === 'admin' && (
            <>
              <button
                onClick={handleCheckNotifications}
                disabled={checkNotifsMutation.isPending}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-400 bg-overlay border border-border hover:bg-overlay-hover hover:text-100 transition-all disabled:opacity-55"
                title="Vérifier manuellement les alertes de stage"
              >
                <Clock size={14} className={checkNotifsMutation.isPending ? 'animate-spin' : ''} />
                Vérifier Échéances
              </button>
              <button onClick={openAddModal} className="btn-primary">
                <Plus size={16} strokeWidth={2.5} /> Ajouter un stage
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="glass rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Recherche</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Nom, entreprise, secteur..."
                className="w-full bg-input border border-border rounded-xl py-2.5 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Statut</label>
            <CustomSelect
              options={[
                { value: '', label: 'Tous les statuts' },
                ...Object.entries(statutConfig).map(([key, config]) => ({ value: key, label: config.label })),
              ]}
              value={filters.statut}
              onChange={(val) => setFilters({ ...filters, statut: val, page: 1 })}
              placeholder="État du stage"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Ville</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Filtrer par ville..."
                className="w-full bg-input border border-border rounded-xl py-2.5 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
                value={filters.entreprise_ville}
                onChange={(e) => setFilters({ ...filters, entreprise_ville: e.target.value, page: 1 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Provenance</label>
            <CustomSelect
              options={[
                { value: '', label: 'Toutes les sources' },
                { value: 'true', label: 'Soumis par les stagiaires' },
                { value: 'false', label: 'Saisis par l\'administration' },
              ]}
              value={filters.soumis_par_stagiaire}
              onChange={(val) => setFilters({ ...filters, soumis_par_stagiaire: val, page: 1 })}
              placeholder="Source de saisie"
            />
          </div>
        </div>
      </div>

      {stagesLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-500 font-medium">Synchronisation des stages...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {stagesData?.data?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center glass rounded-2xl"
              >
                <Briefcase className="w-12 h-12 text-500 mx-auto mb-4" />
                <p className="text-500 font-bold uppercase tracking-widest text-sm">Aucun stage trouvé</p>
              </motion.div>
            ) : (
              stagesData?.data?.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="glass rounded-2xl overflow-hidden flex flex-col group transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="p-8 pb-4 relative">
                    <div className={`absolute top-8 right-8 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${statutConfig[stage.statut].bg} ${statutConfig[stage.statut].color} ${statutConfig[stage.statut].border}`}>
                      {statutConfig[stage.statut].label}
                    </div>
                    <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-6 text-primary group-hover:scale-110 transition-transform">
                      <Building2 size={24} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {stage.soumis_par_stagiaire && (
                        <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                          📋 Soumis par stagiaire
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md border ${
                        stage.papiers_administratifs_ok
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {stage.papiers_administratifs_ok ? '🛡️ Papiers OK' : '⚠️ Papiers en attente'}
                      </span>
                    </div>

                    <h3 className="font-black text-100 text-xl tracking-tight pr-24 leading-tight group-hover:text-primary transition-colors">
                      {stage.entreprise_nom}
                    </h3>
                    <p className="text-sm text-500 mt-2 flex items-center gap-2 font-medium">
                      <MapPin size={14} className="text-400" />
                      {stage.entreprise_ville || 'Non spécifiée'}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-8 space-y-8 flex-1">
                    <div className="p-4 rounded-2xl bg-overlay border border-border">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-500 mb-3 ml-1">Stagiaire assigné</p>
                      {stage.stagiaire ? (
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-overlay border border-border flex items-center justify-center font-black text-400 text-sm">
                            {stage.stagiaire.nom_complet?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-200 truncate">{stage.stagiaire.nom_complet}</p>
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-0.5">{stage.stagiaire.filiere?.code || '—'}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-500 italic ml-1">Stagiaire inconnu</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-400 flex items-center gap-1.5">
                          <Calendar size={12} /> Période
                        </p>
                        <p className="text-xs font-bold text-200">
                          {new Date(stage.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} — {new Date(stage.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <p className="text-[10px] font-black uppercase tracking-widest text-400">Progrès</p>
                          <span className="text-sm font-black text-100">{stage.progression}%</span>
                        </div>
                        <div className="w-full bg-overlay rounded-full h-1.5 overflow-hidden border border-border">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${stage.progression}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Report Status */}
                    {stage.rapport_soumis && (
                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                          <CheckCircle size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Rapport soumis</p>
                        </div>
                        {stage.rapport_path && (
                          <a
                            href={stage.rapport_path}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-colors"
                            title="Télécharger le rapport"
                          >
                            <Download size={16} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="p-6 pt-0 mt-auto flex gap-3 px-8 pb-8">
                    <button
                      onClick={() => openDetailsModal(stage)}
                      className="flex-1 py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-widest text-400 bg-overlay border border-border hover:bg-overlay-hover hover:text-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Eye size={16} /> Détails
                    </button>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => openEditModal(stage)}
                        className="flex-1 py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                      >
                        <Edit2 size={16} /> Gérer
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {stagesData?.meta && stagesData.meta.last_page > 1 && (
        <div className="p-4 sm:p-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="text-[10px] sm:text-xs font-bold text-500 uppercase tracking-widest whitespace-nowrap">
            <span className="text-200">{stagesData.meta.from}</span>-<span className="text-200">{stagesData.meta.to}</span> / <span className="text-200">{stagesData.meta.total}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {stagesData.meta.links.map((link, i) => (
              <button
                key={i}
                disabled={!link.url || link.active}
                onClick={() => {
                  const url = new URL(link.url);
                  setFilters({ ...filters, page: url.searchParams.get('page') });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 border ${
                  link.active ? 'text-white border-transparent' : 'border-border text-500 hover:text-100 hover:border-gray-brand'
                } ${!link.url ? 'opacity-25 cursor-not-allowed' : ''}`}
                style={link.active ? { background: '#2660A4' } : {}}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD STAGE (ADMIN) ==================== */}
      <Modal isOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} title="Ajouter un stage" maxWidth="max-w-2xl">
        <form onSubmit={handleCreateStage} className="space-y-6">
          {/* Stagiaire Selector */}
          <div className="space-y-2 relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">
              Sélectionner le Stagiaire <span className="text-rose-400">*</span>
            </label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Rechercher par nom..."
                className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
                value={stagiaireSearch}
                onChange={(e) => {
                  setStagiaireSearch(e.target.value);
                  if (selectedStagiaire) setSelectedStagiaire(null);
                }}
              />
            </div>

            {/* Suggestions Dropdown */}
            {isAddModalOpen && stagiaireSearch && !selectedStagiaire && (
              <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-surface border border-border rounded-xl z-50 shadow-lg p-2 custom-scrollbar">
                {loadingStagiaires ? (
                  <div className="flex items-center gap-2 p-3 text-xs text-500 justify-center">
                    <Loader2 size={14} className="animate-spin" /> Recherche en cours...
                  </div>
                ) : stagiaireOptions.length === 0 ? (
                  <div className="p-3 text-xs text-500 text-center italic">Aucun stagiaire trouvé</div>
                ) : (
                  stagiaireOptions.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setSelectedStagiaire(st);
                        setStagiaireSearch(st.nom_complet);
                      }}
                      className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-overlay text-sm font-bold text-200 transition-colors"
                    >
                      <span>{st.nom_complet}</span>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md uppercase font-black tracking-widest">{st.filiere?.code || '—'}</span>
                    </button>
                  ))
                )}
              </div>
            )}

            {formErrors.stagiaire_id && <p className="text-xs text-rose-400 ml-1">{formErrors.stagiaire_id[0]}</p>}
          </div>

          {/* Form details inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">
                Nom de l'entreprise <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.entreprise_nom}
                onChange={(e) => setForm({ ...form, entreprise_nom: e.target.value })}
                placeholder="Ex: OCP Group"
              />
              {formErrors.entreprise_nom && <p className="text-xs text-rose-400 ml-1">{formErrors.entreprise_nom[0]}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Secteur</label>
              <input
                type="text"
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.entreprise_secteur}
                onChange={(e) => setForm({ ...form, entreprise_secteur: e.target.value })}
                placeholder="Ex: Technologie"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Ville</label>
              <input
                type="text"
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.entreprise_ville}
                onChange={(e) => setForm({ ...form, entreprise_ville: e.target.value })}
                placeholder="Ex: Rabat"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Tuteur de stage</label>
              <input
                type="text"
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.responsable_nom}
                onChange={(e) => setForm({ ...form, responsable_nom: e.target.value })}
                placeholder="Ex: Khalid Alaoui"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Téléphone Tuteur</label>
              <input
                type="text"
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.responsable_telephone}
                onChange={(e) => setForm({ ...form, responsable_telephone: e.target.value })}
                placeholder="Ex: 0661234567"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Email Tuteur</label>
              <input
                type="email"
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.responsable_email}
                onChange={(e) => setForm({ ...form, responsable_email: e.target.value })}
                placeholder="Ex: khalid@entreprise.ma"
              />
              {formErrors.responsable_email && <p className="text-xs text-rose-400 ml-1">{formErrors.responsable_email[0]}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">
                Date de début <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.date_debut}
                onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
              />
              {formErrors.date_debut && <p className="text-xs text-rose-400 ml-1">{formErrors.date_debut[0]}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">
                Date de fin <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.date_fin}
                onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
              />
              {formErrors.date_fin && <p className="text-xs text-rose-400 ml-1">{formErrors.date_fin[0]}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Durée (semaines)</label>
              <input
                type="number"
                min="1"
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.duree_semaines}
                onChange={(e) => setForm({ ...form, duree_semaines: e.target.value })}
                placeholder="Ex: 8"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Statut du Stage</label>
              <CustomSelect
                options={[
                  { value: 'en_attente', label: 'En attente' },
                  { value: 'en_cours', label: 'En cours' },
                  { value: 'termine', label: 'Terminé' },
                  { value: 'valide', label: 'Validé' },
                ]}
                value={form.statut}
                onChange={(val) => setForm({ ...form, statut: val })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Note de stage (/20)</label>
              <input
                type="number"
                step="0.25"
                min="0"
                max="20"
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.note_entreprise}
                onChange={(e) => setForm({ ...form, note_entreprise: e.target.value })}
                placeholder="Ex: 16.5"
              />
              {formErrors.note_entreprise && <p className="text-xs text-rose-400 ml-1">{formErrors.note_entreprise[0]}</p>}
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col gap-4 justify-center md:pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary bg-input"
                  checked={form.papiers_administratifs_ok}
                  onChange={(e) => setForm({ ...form, papiers_administratifs_ok: e.target.checked })}
                />
                <span className="text-xs font-bold text-200">🛡️ Papiers administratifs validés</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary bg-input"
                  checked={form.rapport_soumis}
                  onChange={(e) => setForm({ ...form, rapport_soumis: e.target.checked })}
                />
                <span className="text-xs font-bold text-200">📁 Rapport de stage soumis</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Observations / Remarques</label>
            <textarea
              rows={3}
              className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              value={form.observations}
              onChange={(e) => setForm({ ...form, observations: e.target.value })}
              placeholder="Ajouter des remarques ou des commentaires de suivi..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-6 py-3 rounded-xl text-sm font-bold text-400 bg-overlay border border-border hover:bg-overlay-hover hover:text-100 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={createStageMutation.isPending}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {createStageMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Créer le Stage'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ==================== MODAL: EDIT/MANAGE STAGE (ADMIN) ==================== */}
      <Modal isOpen={isEditModalOpen} closeModal={() => setIsEditModalOpen(false)} title={`Gérer le stage de ${selectedStage?.stagiaire?.nom_complet}`} maxWidth="max-w-2xl">
        <form onSubmit={handleUpdateStage} className="space-y-6">
          <div className="p-4 rounded-2xl bg-overlay border border-border mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-400">Stagiaire</p>
            <p className="text-base font-black text-100 mt-1">{selectedStage?.stagiaire?.nom_complet}</p>
            <p className="text-xs text-primary font-black uppercase tracking-widest mt-0.5">{selectedStage?.stagiaire?.filiere?.code} - Groupe {selectedStage?.stagiaire?.groupe}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">
                Nom de l'entreprise <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.entreprise_nom}
                onChange={(e) => setForm({ ...form, entreprise_nom: e.target.value })}
              />
              {formErrors.entreprise_nom && <p className="text-xs text-rose-400 ml-1">{formErrors.entreprise_nom[0]}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Secteur</label>
              <input
                type="text"
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.entreprise_secteur}
                onChange={(e) => setForm({ ...form, entreprise_secteur: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Ville</label>
              <input
                type="text"
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.entreprise_ville}
                onChange={(e) => setForm({ ...form, entreprise_ville: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Tuteur de stage</label>
              <input
                type="text"
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.responsable_nom}
                onChange={(e) => setForm({ ...form, responsable_nom: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Téléphone Tuteur</label>
              <input
                type="text"
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.responsable_telephone}
                onChange={(e) => setForm({ ...form, responsable_telephone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Email Tuteur</label>
              <input
                type="email"
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.responsable_email}
                onChange={(e) => setForm({ ...form, responsable_email: e.target.value })}
              />
              {formErrors.responsable_email && <p className="text-xs text-rose-400 ml-1">{formErrors.responsable_email[0]}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">
                Date de début <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.date_debut}
                onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
              />
              {formErrors.date_debut && <p className="text-xs text-rose-400 ml-1">{formErrors.date_debut[0]}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">
                Date de fin <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.date_fin}
                onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
              />
              {formErrors.date_fin && <p className="text-xs text-rose-400 ml-1">{formErrors.date_fin[0]}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Durée (semaines)</label>
              <input
                type="number"
                min="1"
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.duree_semaines}
                onChange={(e) => setForm({ ...form, duree_semaines: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Statut du Stage</label>
              <CustomSelect
                options={[
                  { value: 'en_attente', label: 'En attente' },
                  { value: 'en_cours', label: 'En cours' },
                  { value: 'termine', label: 'Terminé' },
                  { value: 'valide', label: 'Validé' },
                ]}
                value={form.statut}
                onChange={(val) => setForm({ ...form, statut: val })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Note de stage (/20)</label>
              <input
                type="number"
                step="0.25"
                min="0"
                max="20"
                className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={form.note_entreprise}
                onChange={(e) => setForm({ ...form, note_entreprise: e.target.value })}
              />
              {formErrors.note_entreprise && <p className="text-xs text-rose-400 ml-1">{formErrors.note_entreprise[0]}</p>}
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col gap-4 justify-center md:pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary bg-input"
                  checked={form.papiers_administratifs_ok}
                  onChange={(e) => setForm({ ...form, papiers_administratifs_ok: e.target.checked })}
                />
                <span className="text-xs font-bold text-200">🛡️ Papiers administratifs validés</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary bg-input"
                  checked={form.rapport_soumis}
                  onChange={(e) => setForm({ ...form, rapport_soumis: e.target.checked })}
                />
                <span className="text-xs font-bold text-200">📁 Rapport de stage soumis</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Observations / Remarques</label>
            <textarea
              rows={3}
              className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              value={form.observations}
              onChange={(e) => setForm({ ...form, observations: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-6 py-3 rounded-xl text-sm font-bold text-400 bg-overlay border border-border hover:bg-overlay-hover hover:text-100 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={updateStageMutation.isPending}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {updateStageMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ==================== MODAL: DETAILS OF STAGE (ADMIN/FORMATEUR) ==================== */}
      <Modal isOpen={isDetailsModalOpen} closeModal={() => setIsDetailsModalOpen(false)} title="Dossier de Stage" maxWidth="max-w-3xl">
        {selectedStage && (
          <div className="space-y-6">
            {/* Student Info */}
            <div className="flex items-center justify-between p-5 rounded-2xl bg-overlay border border-border flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-base">
                  {selectedStage.stagiaire?.nom_complet?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-100 text-base leading-tight">{selectedStage.stagiaire?.nom_complet}</h4>
                  <p className="text-xs text-primary font-black uppercase tracking-widest mt-1">
                    {selectedStage.stagiaire?.filiere?.code} - Groupe {selectedStage.stagiaire?.groupe}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedStage.soumis_par_stagiaire && (
                  <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                    📋 Soumis par stagiaire
                  </span>
                )}
                <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border ${
                  selectedStage.papiers_administratifs_ok
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {selectedStage.papiers_administratifs_ok ? '🛡️ Papiers OK' : '⚠️ Papiers en attente'}
                </span>
                <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border rounded-md ${statutConfig[selectedStage.statut].bg} ${statutConfig[selectedStage.statut].color} ${statutConfig[selectedStage.statut].border}`}>
                  {statutConfig[selectedStage.statut].label}
                </span>
              </div>
            </div>

            {/* Stage Company Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6 space-y-4">
                <h4 className="font-black text-100 text-sm tracking-tight flex items-center gap-2">
                  <Building2 size={16} className="text-primary" /> Informations Entreprise
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-400 font-bold uppercase tracking-wider text-[9px]">Nom</span>
                    <span className="text-200 font-bold">{selectedStage.entreprise_nom}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-400 font-bold uppercase tracking-wider text-[9px]">Secteur</span>
                    <span className="text-200 font-semibold">{selectedStage.entreprise_secteur || 'Non spécifié'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-400 font-bold uppercase tracking-wider text-[9px]">Ville</span>
                    <span className="text-200 font-semibold">{selectedStage.entreprise_ville || 'Non spécifiée'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-400 font-bold uppercase tracking-wider text-[9px]">Créé le</span>
                    <span className="text-200 font-medium">{selectedStage.created_at || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 space-y-4">
                <h4 className="font-black text-100 text-sm tracking-tight flex items-center gap-2">
                  <User size={16} className="text-violet-400" /> Tuteur de Stage
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-400 font-bold uppercase tracking-wider text-[9px]">Nom complet</span>
                    <span className="text-200 font-bold">{selectedStage.responsable_nom || 'Non spécifié'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-400 font-bold uppercase tracking-wider text-[9px]">Téléphone</span>
                    <span className="text-200 font-semibold">{selectedStage.responsable_telephone || 'Non spécifié'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-400 font-bold uppercase tracking-wider text-[9px]">Email</span>
                    <span className="text-200 font-semibold truncate max-w-[150px]">{selectedStage.responsable_email || 'Non spécifié'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration / Calendar */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h4 className="font-black text-100 text-sm tracking-tight flex items-center gap-2">
                <Calendar size={16} className="text-amber-400" /> Calendrier & Durée
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-overlay border border-border rounded-xl">
                  <p className="text-[9px] font-black uppercase tracking-widest text-400">Date de début</p>
                  <p className="text-xs font-bold text-200 mt-1">
                    {new Date(selectedStage.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="p-3 bg-overlay border border-border rounded-xl">
                  <p className="text-[9px] font-black uppercase tracking-widest text-400">Date de fin</p>
                  <p className="text-xs font-bold text-200 mt-1">
                    {new Date(selectedStage.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="p-3 bg-overlay border border-border rounded-xl">
                  <p className="text-[9px] font-black uppercase tracking-widest text-400">Nombre de semaines</p>
                  <p className="text-xs font-bold text-200 mt-1">
                    {selectedStage.duree_semaines ? `${selectedStage.duree_semaines} semaines` : 'Non spécifié'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-end">
                  <p className="text-[9px] font-black uppercase tracking-widest text-400">Progression</p>
                  <span className="text-xs font-black text-primary">{selectedStage.progression}%</span>
                </div>
                <div className="w-full bg-overlay rounded-full h-1.5 overflow-hidden border border-border">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${selectedStage.progression}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Assessment section */}
            {(selectedStage.note_entreprise || selectedStage.rapport_soumis) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {selectedStage.note_entreprise && (
                  <div className="glass rounded-2xl p-6 text-center space-y-2">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-400">Note de stage /20</h5>
                    <p className="text-3xl font-black text-amber-400">{selectedStage.note_entreprise}</p>
                  </div>
                )}
                {selectedStage.rapport_soumis && (
                  <div className="glass rounded-2xl p-6 flex flex-col justify-center items-center gap-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 size={20} />
                      <span className="text-xs font-black uppercase tracking-widest">Rapport soumis</span>
                    </div>
                    {selectedStage.rapport_path && (
                      <a
                        href={selectedStage.rapport_path}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                      >
                        <Download size={14} /> Télécharger
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Observations */}
            {selectedStage.observations && (
              <div className="glass rounded-2xl p-6 space-y-3">
                <h4 className="font-black text-100 text-sm tracking-tight">Observations / Commentaires</h4>
                <p className="text-xs text-300 leading-relaxed bg-overlay p-4 rounded-xl border border-border italic">
                  "{selectedStage.observations}"
                </p>
              </div>
            )}

            {/* Footer close button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-overlay border border-border text-200 hover:bg-overlay-hover hover:text-100 transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StagesList;
