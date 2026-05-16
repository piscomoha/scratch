import { useStagiaire } from '../../hooks/useQueries';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, GraduationCap, Hash, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const StagiaireDetails = ({ stagiaireId }) => {
  const { data: stagiaire, isLoading, isError } = useStagiaire(stagiaireId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-10 w-10 border-t-2 border-primary rounded-full animate-spin" />
        <p className="text-zinc-500 font-medium">Récupération du profil...</p>
      </div>
    );
  }

  if (isError || !stagiaire) {
    return (
      <div className="text-center py-20 text-rose-500 font-bold glass rounded-[2rem] border border-rose-500/20">
        Erreur lors du chargement des informations.
      </div>
    );
  }

  const getStatusStyles = (statut) => {
    switch (statut) {
      case 'actif': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'suspendu': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'diplome': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'abandon': return 'bg-zinc-500/10 text-400 border-border';
      default: return 'bg-zinc-500/10 text-400 border-border';
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 p-6 glass rounded-[2.5rem] bg-overlay"
      >
        <div className="h-24 w-24 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-3xl flex items-center justify-center text-primary text-4xl font-black overflow-hidden flex-shrink-0 ring-1 ring-border shadow-2xl">
          {stagiaire.photo ? (
            <img src={stagiaire.photo} alt={stagiaire.nom} className="h-full w-full object-cover" />
          ) : (
            stagiaire.nom.charAt(0)
          )}
        </div>
        <div>
          <h2 className="text-3xl font-black text-100 tracking-tight">{stagiaire.nom_complet}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-input border border-border text-[10px] font-black uppercase tracking-widest text-400">
              <Hash size={12} className="text-primary" />
              Massar: <span className="text-100">{stagiaire.code_massar}</span>
            </div>
            <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-xl border ${getStatusStyles(stagiaire.statut)}`}>
              {stagiaire.statut}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-[2.5rem] p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-primary opacity-5 group-hover:opacity-10 transition-opacity">
            <User size={80} strokeWidth={3} />
          </div>
          
          <h3 className="text-lg font-bold text-100 mb-8 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <User size={18} />
            </div>
            Informations Personnelles
          </h3>
          
          <ul className="space-y-6 relative z-10">
            <li className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-overlay border border-border flex items-center justify-center text-500">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-500 mb-1">Naissance & Genre</p>
                <p className="text-sm font-bold text-100">{stagiaire.date_naissance} — {stagiaire.genre === 'M' ? 'Masculin' : 'Féminin'}</p>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-overlay border border-border flex items-center justify-center text-500">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-500 mb-1">Contact Email</p>
                <p className="text-sm font-bold text-100">{stagiaire.email || 'Non renseigné'}</p>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-overlay border border-border flex items-center justify-center text-500">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-500 mb-1">Téléphone</p>
                <p className="text-sm font-bold text-100">{stagiaire.telephone}</p>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-overlay border border-border flex items-center justify-center text-500">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-500 mb-1">Localisation</p>
                <p className="text-sm font-bold text-100 leading-relaxed">{stagiaire.adresse || 'Non renseignée'}, {stagiaire.ville}</p>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Academic Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-[2.5rem] p-8"
        >
          <h3 className="text-lg font-bold text-100 mb-8 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
              <BookOpen size={18} />
            </div>
            Parcours Académique
          </h3>
          
          <div className="space-y-8">
            <div className="p-6 rounded-[2rem] bg-overlay border border-border relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 p-4 text-secondary opacity-5 group-hover:scale-110 transition-transform">
                <GraduationCap size={120} strokeWidth={1} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-500 mb-3 ml-1 flex items-center gap-2">
                <ShieldCheck size={12} className="text-secondary" /> Spécialité
              </p>
              <p className="text-xl font-black text-100 group-hover:text-secondary transition-colors">{stagiaire.filiere?.code}</p>
              <p className="text-xs font-medium text-500 mt-1">{stagiaire.filiere?.libelle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-6 rounded-[2rem] bg-overlay border border-border">
                <p className="text-[10px] font-black uppercase tracking-widest text-500 mb-2">Groupe</p>
                <p className="text-2xl font-black text-100">{stagiaire.groupe}</p>
              </div>
              <div className="p-6 rounded-[2rem] bg-overlay border border-border">
                <p className="text-[10px] font-black uppercase tracking-widest text-500 mb-2">Année</p>
                <p className="text-2xl font-black text-100">
                  {stagiaire.annee_formation}<span className="text-sm font-bold text-500 ml-1">{stagiaire.annee_formation === 1 ? 'ère' : 'ème'}</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StagiaireDetails;

