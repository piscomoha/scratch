import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck2,
  Building2,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  ChevronRight,
  Loader2,
  FileText,
  Shield,
} from 'lucide-react';
import api from '../../api/axios';

const StageForm = () => {
  const { user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = papiers check, 2 = form, 3 = success
  const [papiersOk, setPapiersOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [existingStage, setExistingStage] = useState(null);
  const [errors, setErrors] = useState({});

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
    observations: '',
  });

  // Check if the stagiaire already submitted a stage
  useEffect(() => {
    const checkExisting = async () => {
      try {
        const { data } = await api.get('/stages/my-stage');
        if (data.data && data.data.soumis_par_stagiaire) {
          setExistingStage(data.data);
          setStep(3);
        }
      } catch (error) {
        // No existing stage, continue
      } finally {
        setCheckingExisting(false);
      }
    };
    checkExisting();
  }, []);

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const { data } = await api.post('/stages/submit-form', {
        ...form,
        papiers_administratifs_ok: true,
        duree_semaines: form.duree_semaines ? parseInt(form.duree_semaines) : null,
      });

      setExistingStage(data.data);
      setStep(3);
      notify('success', 'Formulaire envoyé !', 'Votre formulaire de stage a été transmis au formateur et à l\'admin.');
    } catch (error) {
      if (error.response?.status === 422) {
        const serverErrors = error.response.data.errors || {};
        setErrors(serverErrors);
        if (error.response.data.message) {
          notify('error', 'Erreur', error.response.data.message);
        }
      } else {
        notify('error', 'Erreur', 'Impossible de soumettre le formulaire.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingExisting) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-500 font-medium">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: '#2E8B57', borderRadius: 1 }} />
          <div style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: '#8C9BA8', borderRadius: 1 }} />
          <div style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: '#2660A4', borderRadius: 1 }} />
          <span className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Formulaire de stage</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-100">Mon Stage</h1>
        <p className="text-400 text-sm mt-0.5">Remplissez et soumettez votre formulaire de stage</p>
      </div>

      {/* Progress Steps */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between relative">
          {[
            { num: 1, label: 'Papiers administratifs', icon: Shield },
            { num: 2, label: 'Détails du stage', icon: FileText },
            { num: 3, label: 'Confirmation', icon: CheckCircle2 },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2 relative z-10">
                <motion.div
                  animate={{
                    background: step >= s.num ? 'rgba(46,139,87,0.15)' : 'var(--overlay)',
                    borderColor: step >= s.num ? 'rgba(46,139,87,0.4)' : 'var(--border)',
                  }}
                  className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all"
                >
                  {step > s.num ? (
                    <CheckCircle2 size={20} className="text-emerald-400" />
                  ) : (
                    <s.icon size={20} className={step === s.num ? 'text-primary' : 'text-500'} />
                  )}
                </motion.div>
                <span className={`text-[10px] font-black uppercase tracking-widest text-center hidden sm:block ${
                  step >= s.num ? 'text-100' : 'text-500'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className="flex-1 h-[2px] mx-4 rounded-full overflow-hidden bg-border">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: step > s.num ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ Step 1: Administrative Papers Check ═══ */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-2xl p-8 space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Shield size={36} className="text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-100 tracking-tight">Papiers Administratifs OFPPT</h2>
                <p className="text-400 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                  Avant de remplir le formulaire de stage, vous devez confirmer que vous avez
                  complété tous les documents administratifs requis par l'OFPPT.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-overlay border border-border space-y-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-500 mb-4">Documents requis</p>
              {[
                'Convention de stage signée',
                'Attestation d\'assurance',
                'Copie de la CIN',
                'Lettre d\'affectation du stage',
                'Fiche d\'engagement',
              ].map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileCheck2 size={16} className="text-primary" />
                  </div>
                  <span className="text-sm text-200 font-medium">{doc}</span>
                </div>
              ))}
            </div>

            <label className="flex items-start gap-4 p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all group hover:border-emerald-500/30 hover:bg-emerald-500/5"
              style={{ borderColor: papiersOk ? 'rgba(46,139,87,0.4)' : 'var(--border)', background: papiersOk ? 'rgba(46,139,87,0.05)' : undefined }}>
              <input
                type="checkbox"
                checked={papiersOk}
                onChange={(e) => setPapiersOk(e.target.checked)}
                className="sr-only"
              />
              <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                papiersOk ? 'bg-emerald-500 border-emerald-500' : 'border-border group-hover:border-emerald-500/40'
              }`}>
                {papiersOk && <CheckCircle2 size={14} className="text-white" />}
              </div>
              <div>
                <p className="font-bold text-100 text-sm">Je confirme avoir complété tous les papiers administratifs</p>
                <p className="text-xs text-400 mt-1">En cochant cette case, vous attestez que tous les documents listés ci-dessus ont été soumis et validés par l'administration.</p>
              </div>
            </label>

            <div className="flex justify-end">
              <button
                disabled={!papiersOk}
                onClick={() => setStep(2)}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                  papiersOk
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                    : 'bg-overlay text-500 border border-border cursor-not-allowed'
                }`}
              >
                Continuer <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══ Step 2: Stage Details Form ═══ */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Enterprise Info */}
              <div className="glass rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-100 tracking-tight">Informations de l'entreprise</h3>
                    <p className="text-xs text-400">Détails de l'entreprise d'accueil</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">
                      Nom de l'entreprise <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        value={form.entreprise_nom}
                        onChange={(e) => updateForm('entreprise_nom', e.target.value)}
                        placeholder="Ex: OCP Group"
                        className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
                        required
                      />
                    </div>
                    {errors.entreprise_nom && <p className="text-xs text-rose-400 ml-1">{errors.entreprise_nom[0]}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Secteur d'activité</label>
                    <div className="relative group">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        value={form.entreprise_secteur}
                        onChange={(e) => updateForm('entreprise_secteur', e.target.value)}
                        placeholder="Ex: Industrie minière"
                        className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Ville</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        value={form.entreprise_ville}
                        onChange={(e) => updateForm('entreprise_ville', e.target.value)}
                        placeholder="Ex: Casablanca"
                        className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Supervisor Info */}
              <div className="glass rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-violet-500/10 rounded-xl text-violet-400">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-100 tracking-tight">Responsable en entreprise</h3>
                    <p className="text-xs text-400">Encadrant professionnel du stage</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Nom complet</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        value={form.responsable_nom}
                        onChange={(e) => updateForm('responsable_nom', e.target.value)}
                        placeholder="Ex: Mohammed Alaoui"
                        className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Téléphone</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        value={form.responsable_telephone}
                        onChange={(e) => updateForm('responsable_telephone', e.target.value)}
                        placeholder="Ex: 0661234567"
                        className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
                      <input
                        type="email"
                        value={form.responsable_email}
                        onChange={(e) => updateForm('responsable_email', e.target.value)}
                        placeholder="Ex: alaoui@ocp.ma"
                        className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
                      />
                    </div>
                    {errors.responsable_email && <p className="text-xs text-rose-400 ml-1">{errors.responsable_email[0]}</p>}
                  </div>
                </div>
              </div>

              {/* Dates & Duration */}
              <div className="glass rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-100 tracking-tight">Période du stage</h3>
                    <p className="text-xs text-400">Dates de début et fin du stage</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">
                      Date de début <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
                      <input
                        type="date"
                        value={form.date_debut}
                        onChange={(e) => updateForm('date_debut', e.target.value)}
                        className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        required
                      />
                    </div>
                    {errors.date_debut && <p className="text-xs text-rose-400 ml-1">{errors.date_debut[0]}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">
                      Date de fin <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
                      <input
                        type="date"
                        value={form.date_fin}
                        onChange={(e) => updateForm('date_fin', e.target.value)}
                        className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        required
                      />
                    </div>
                    {errors.date_fin && <p className="text-xs text-rose-400 ml-1">{errors.date_fin[0]}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Durée (semaines)</label>
                    <div className="relative group">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
                      <input
                        type="number"
                        min="1"
                        value={form.duree_semaines}
                        onChange={(e) => updateForm('duree_semaines', e.target.value)}
                        placeholder="Ex: 8"
                        className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Observations */}
              <div className="glass rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-100 tracking-tight">Observations</h3>
                    <p className="text-xs text-400">Notes ou remarques supplémentaires</p>
                  </div>
                </div>

                <textarea
                  value={form.observations}
                  onChange={(e) => updateForm('observations', e.target.value)}
                  rows={4}
                  placeholder="Décrivez brièvement votre projet de stage, les missions prévues..."
                  className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-400 bg-overlay border border-border hover:bg-overlay-hover hover:text-100 transition-all"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Soumettre le formulaire
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ═══ Step 3: Success / Already Submitted ═══ */}
        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-10 space-y-8"
          >
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="mx-auto w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
              >
                <CheckCircle2 size={48} className="text-emerald-400" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-black text-100 tracking-tight">Formulaire soumis avec succès !</h2>
                <p className="text-400 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                  Votre formulaire de stage a été envoyé au formateur et à l'administrateur.
                  Vous serez notifié une fois qu'il sera validé.
                </p>
              </motion.div>
            </div>

            {existingStage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-500 text-center">Récapitulatif</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-overlay border border-border">
                    <p className="text-[10px] font-black uppercase tracking-widest text-400 mb-1">Entreprise</p>
                    <p className="text-sm font-bold text-100">{existingStage.entreprise_nom}</p>
                    {existingStage.entreprise_ville && (
                      <p className="text-xs text-400 mt-0.5 flex items-center gap-1">
                        <MapPin size={12} /> {existingStage.entreprise_ville}
                      </p>
                    )}
                  </div>
                  <div className="p-4 rounded-2xl bg-overlay border border-border">
                    <p className="text-[10px] font-black uppercase tracking-widest text-400 mb-1">Période</p>
                    <p className="text-sm font-bold text-100">
                      {new Date(existingStage.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-400 mt-0.5">
                      → {new Date(existingStage.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  {existingStage.responsable_nom && (
                    <div className="p-4 rounded-2xl bg-overlay border border-border">
                      <p className="text-[10px] font-black uppercase tracking-widest text-400 mb-1">Responsable</p>
                      <p className="text-sm font-bold text-100">{existingStage.responsable_nom}</p>
                    </div>
                  )}
                  <div className="p-4 rounded-2xl bg-overlay border border-border">
                    <p className="text-[10px] font-black uppercase tracking-widest text-400 mb-1">Statut</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-sm font-bold text-amber-400">En attente de validation</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 sm:col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <FileCheck2 size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Papiers administratifs</p>
                        <p className="text-xs text-400 mt-0.5">Confirmés et validés</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex justify-center">
              <button
                onClick={() => navigate('/stages')}
                className="px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Voir tous les stages
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StageForm;
