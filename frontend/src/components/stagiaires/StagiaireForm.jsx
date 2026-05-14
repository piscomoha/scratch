import { useForm, Controller } from 'react-hook-form';
import CustomSelect from '../ui/CustomSelect';
import { useCreateStagiaire, useUpdateStagiaire } from '../../hooks/useQueries';
import { useNotification } from '../../context/NotificationContext';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, GraduationCap, Hash, Check, Loader2 } from 'lucide-react';

const StagiaireForm = ({ filieres, onClose, initialData = null }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: initialData || {}
  });
  const createMutation = useCreateStagiaire();
  const updateMutation = useUpdateStagiaire();
  const { notify } = useNotification();
  
  const isEditing = !!initialData;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data) => {
    if (isEditing) {
      updateMutation.mutate({ id: initialData.id, ...data }, {
        onSuccess: () => {
          notify('success', 'Stagiaire mis à jour', `Les informations de ${data.nom} ${data.prenom} ont été modifiées.`);
          onClose();
        },
        onError: (error) => {
          notify('error', 'Erreur de modification', error.response?.data?.message || 'Une erreur est survenue.');
        }
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          notify('success', 'Nouveau stagiaire', `L'inscription de ${data.nom} ${data.prenom} a été validée.`);
          onClose();
        },
        onError: (error) => {
          notify('error', 'Erreur d\'inscription', error.response?.data?.message || 'Vérifiez les données saisies.');
        }
      });
    }
  };

  const inputClasses = "w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 placeholder:text-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";
  const labelClasses = "block text-[10px] font-black uppercase tracking-widest text-500 mb-2 ml-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Code Massar */}
        <div className="space-y-1">
          <label className={labelClasses}>Code Massar <span className="text-primary">*</span></label>
          <div className="relative group">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
            <input
              {...register('code_massar', { required: 'Ce champ est requis' })}
              className={`${inputClasses} pl-12`}
              placeholder="Ex: D123456"
            />
          </div>
          {errors.code_massar && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.code_massar.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className={labelClasses}>Email Professionnel <span className="text-primary">*</span></label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
            <input
              type="email"
              {...register('email', { required: 'Ce champ est requis' })}
              className={`${inputClasses} pl-12`}
              placeholder="email@example.com"
            />
          </div>
          {errors.email && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.email.message}</p>}
        </div>

        {/* Nom */}
        <div className="space-y-1">
          <label className={labelClasses}>Nom <span className="text-primary">*</span></label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
            <input
              {...register('nom', { required: 'Ce champ est requis' })}
              className={`${inputClasses} pl-12`}
              placeholder="Nom de famille"
            />
          </div>
          {errors.nom && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.nom.message}</p>}
        </div>

        {/* Prénom */}
        <div className="space-y-1">
          <label className={labelClasses}>Prénom <span className="text-primary">*</span></label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
            <input
              {...register('prenom', { required: 'Ce champ est requis' })}
              className={`${inputClasses} pl-12`}
              placeholder="Prénom"
            />
          </div>
          {errors.prenom && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.prenom.message}</p>}
        </div>

        {/* Date de naissance */}
        <div className="space-y-1">
          <label className={labelClasses}>Date de naissance <span className="text-primary">*</span></label>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors pointer-events-none" />
            <input
              type="date"
              {...register('date_naissance', { required: 'Ce champ est requis' })}
              className={`${inputClasses} pl-12`}
            />
          </div>
          {errors.date_naissance && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.date_naissance.message}</p>}
        </div>

        {/* Genre */}
        <div className="space-y-1">
          <label className={labelClasses}>Genre <span className="text-primary">*</span></label>
          <Controller
            name="genre"
            control={control}
            rules={{ required: 'Ce champ est requis' }}
            render={({ field }) => (
              <CustomSelect
                options={[
                  { value: 'M', label: 'Masculin' },
                  { value: 'F', label: 'Féminin' }
                ]}
                value={field.value}
                onChange={field.onChange}
                placeholder="Sélectionner"
              />
            )}
          />
          {errors.genre && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.genre.message}</p>}
        </div>

        {/* Téléphone */}
        <div className="space-y-1">
          <label className={labelClasses}>Téléphone <span className="text-primary">*</span></label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
            <input
              {...register('telephone', { required: 'Ce champ est requis' })}
              className={`${inputClasses} pl-12`}
              placeholder="0612345678"
            />
          </div>
          {errors.telephone && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.telephone.message}</p>}
        </div>

        {/* Ville */}
        <div className="space-y-1">
          <label className={labelClasses}>Ville</label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
            <input
              {...register('ville')}
              className={`${inputClasses} pl-12`}
              placeholder="Ex: Casablanca"
            />
          </div>
        </div>

        {/* Adresse */}
        <div className="md:col-span-2 space-y-1">
          <label className={labelClasses}>Adresse complète</label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
            <input
              {...register('adresse')}
              className={`${inputClasses} pl-12`}
              placeholder="Rue, Quartier, N° appartement..."
            />
          </div>
        </div>

        {/* Filière */}
        <div className="space-y-1">
          <label className={labelClasses}>Filière <span className="text-primary">*</span></label>
          <Controller
            name="filiere_id"
            control={control}
            rules={{ required: 'Ce champ est requis' }}
            render={({ field }) => (
              <CustomSelect
                options={filieres?.map(f => ({ value: f.id, label: `${f.code} - ${f.libelle}` })) || []}
                value={field.value}
                onChange={field.onChange}
                placeholder="Spécialité"
              />
            )}
          />
          {errors.filiere_id && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.filiere_id.message}</p>}
        </div>

        {/* Groupe */}
        <div className="space-y-1">
          <label className={labelClasses}>Groupe <span className="text-primary">*</span></label>
          <div className="relative group">
            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
            <input
              {...register('groupe', { required: 'Ce champ est requis' })}
              className={`${inputClasses} pl-12`}
              placeholder="Ex: DEV201"
            />
          </div>
          {errors.groupe && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.groupe.message}</p>}
        </div>

        {/* Année Formation */}
        <div className="space-y-1">
          <label className={labelClasses}>Année de Formation <span className="text-primary">*</span></label>
          <Controller
            name="annee_formation"
            control={control}
            rules={{ required: 'Ce champ est requis' }}
            render={({ field }) => (
              <CustomSelect
                options={[
                  { value: '1', label: '1ère année' },
                  { value: '2', label: '2ème année' },
                  { value: '3', label: '3ème année' }
                ]}
                value={field.value}
                onChange={field.onChange}
                placeholder="Année"
              />
            )}
          />
          {errors.annee_formation && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.annee_formation.message}</p>}
        </div>

        {/* Statut */}
        <div className="space-y-1">
          <label className={labelClasses}>Statut Administratif <span className="text-primary">*</span></label>
          <Controller
            name="statut"
            control={control}
            defaultValue="actif"
            rules={{ required: 'Ce champ est requis' }}
            render={({ field }) => (
              <CustomSelect
                options={[
                  { value: 'actif', label: 'Actif' },
                  { value: 'suspendu', label: 'Suspendu' },
                  { value: 'diplome', label: 'Diplômé' },
                  { value: 'abandon', label: 'Abandon' }
                ]}
                value={field.value}
                onChange={field.onChange}
                placeholder="Statut"
              />
            )}
          />
          {errors.statut && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.statut.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-border">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 text-400 hover:text-100 hover:bg-overlay-hover rounded-2xl transition-all font-bold text-xs uppercase tracking-widest"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-10 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl transition-all font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={3} />}
          {isEditing ? 'Mettre à jour' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
};

export default StagiaireForm;

