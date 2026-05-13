import { useForm, Controller } from 'react-hook-form';
import CustomSelect from '../ui/CustomSelect';
import { useCreateStagiaire, useUpdateStagiaire } from '../../hooks/useQueries';
import toast from 'react-hot-toast';

const StagiaireForm = ({ filieres, onClose, initialData = null }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: initialData || {}
  });
  const createMutation = useCreateStagiaire();
  const updateMutation = useUpdateStagiaire();
  
  const isEditing = !!initialData;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data) => {
    if (isEditing) {
      updateMutation.mutate({ id: initialData.id, ...data }, {
        onSuccess: () => {
          toast.success('Stagiaire mis à jour avec succès');
          onClose();
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du stagiaire');
        }
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Stagiaire ajouté avec succès');
          onClose();
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout du stagiaire');
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Code Massar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code Massar <span className="text-red-500">*</span></label>
          <input
            {...register('code_massar', { required: 'Ce champ est requis' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            placeholder="Ex: D123456"
          />
          {errors.code_massar && <p className="text-red-500 text-xs mt-1">{errors.code_massar.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            {...register('email', { required: 'Ce champ est requis' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            placeholder="Ex: email@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom <span className="text-red-500">*</span></label>
          <input
            {...register('nom', { required: 'Ce champ est requis' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
        </div>

        {/* Prénom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom <span className="text-red-500">*</span></label>
          <input
            {...register('prenom', { required: 'Ce champ est requis' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom.message}</p>}
        </div>

        {/* Date de naissance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance <span className="text-red-500">*</span></label>
          <input
            type="date"
            {...register('date_naissance', { required: 'Ce champ est requis' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          {errors.date_naissance && <p className="text-red-500 text-xs mt-1">{errors.date_naissance.message}</p>}
        </div>

        {/* Genre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Genre <span className="text-red-500">*</span></label>
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
          {errors.genre && <p className="text-red-500 text-xs mt-1">{errors.genre.message}</p>}
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone <span className="text-red-500">*</span></label>
          <input
            {...register('telephone', { required: 'Ce champ est requis' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            placeholder="Ex: 0612345678"
          />
          {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone.message}</p>}
        </div>

        {/* Ville */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
          <input
            {...register('ville')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>

        {/* Adresse */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input
            {...register('adresse')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>

        {/* Filière */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filière <span className="text-red-500">*</span></label>
          <Controller
            name="filiere_id"
            control={control}
            rules={{ required: 'Ce champ est requis' }}
            render={({ field }) => (
              <CustomSelect
                options={filieres?.map(f => ({ value: f.id, label: `${f.code} - ${f.libelle}` })) || []}
                value={field.value}
                onChange={field.onChange}
                placeholder="Sélectionner"
              />
            )}
          />
          {errors.filiere_id && <p className="text-red-500 text-xs mt-1">{errors.filiere_id.message}</p>}
        </div>

        {/* Groupe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Groupe <span className="text-red-500">*</span></label>
          <input
            {...register('groupe', { required: 'Ce champ est requis' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            placeholder="Ex: DEV201"
          />
          {errors.groupe && <p className="text-red-500 text-xs mt-1">{errors.groupe.message}</p>}
        </div>

        {/* Année Formation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Année Formation <span className="text-red-500">*</span></label>
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
                placeholder="Sélectionner"
              />
            )}
          />
          {errors.annee_formation && <p className="text-red-500 text-xs mt-1">{errors.annee_formation.message}</p>}
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut <span className="text-red-500">*</span></label>
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
                placeholder="Sélectionner"
              />
            )}
          />
          {errors.statut && <p className="text-red-500 text-xs mt-1">{errors.statut.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-medium flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Enregistrer')}
        </button>
      </div>
    </form>
  );
};

export default StagiaireForm;
