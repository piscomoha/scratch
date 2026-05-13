import { useStagiaire } from '../../hooks/useQueries';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBookOpen } from 'react-icons/fi';

const StagiaireDetails = ({ stagiaireId }) => {
  const { data: stagiaire, isLoading, isError } = useStagiaire(stagiaireId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !stagiaire) {
    return (
      <div className="text-center py-10 text-red-500">
        Erreur lors du chargement des informations du stagiaire.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête du profil */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-gray-100">
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold overflow-hidden flex-shrink-0">
          {stagiaire.photo ? (
            <img src={stagiaire.photo} alt={stagiaire.nom} className="h-full w-full object-cover" />
          ) : (
            stagiaire.nom.charAt(0)
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{stagiaire.nom_complet}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded border shadow-sm">
              Code Massar: {stagiaire.code_massar}
            </span>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize
              ${stagiaire.statut === 'actif' ? 'bg-green-100 text-green-700' : ''}
              ${stagiaire.statut === 'suspendu' ? 'bg-red-100 text-red-700' : ''}
              ${stagiaire.statut === 'diplome' ? 'bg-blue-100 text-blue-700' : ''}
              ${stagiaire.statut === 'abandon' ? 'bg-gray-100 text-gray-700' : ''}
            `}>
              {stagiaire.statut}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations Personnelles */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
            <FiUser className="text-primary" />
            Informations Personnelles
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-500">
                <FiCalendar />
              </div>
              <div>
                <p className="text-xs text-gray-500">Date de naissance</p>
                <p className="font-medium text-gray-800">{stagiaire.date_naissance} ({stagiaire.genre === 'M' ? 'Masculin' : 'Féminin'})</p>
              </div>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-500">
                <FiMail />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{stagiaire.email || 'Non renseigné'}</p>
              </div>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-500">
                <FiPhone />
              </div>
              <div>
                <p className="text-xs text-gray-500">Téléphone</p>
                <p className="font-medium text-gray-800">{stagiaire.telephone}</p>
              </div>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-500">
                <FiMapPin />
              </div>
              <div>
                <p className="text-xs text-gray-500">Adresse</p>
                <p className="font-medium text-gray-800">{stagiaire.adresse || 'Non renseignée'}, {stagiaire.ville}</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Informations Académiques */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
            <FiBookOpen className="text-secondary" />
            Parcours Académique
          </h3>
          <ul className="space-y-4">
            <li>
              <p className="text-xs text-gray-500 mb-1">Filière</p>
              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                <p className="font-medium text-gray-800">{stagiaire.filiere?.code}</p>
                <p className="text-xs text-gray-500">{stagiaire.filiere?.libelle}</p>
              </div>
            </li>
            <li className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Groupe</p>
                <p className="font-medium text-gray-800">{stagiaire.groupe}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Année de formation</p>
                <p className="font-medium text-gray-800">{stagiaire.annee_formation}{stagiaire.annee_formation === 1 ? 'ère' : 'ème'} année</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StagiaireDetails;
