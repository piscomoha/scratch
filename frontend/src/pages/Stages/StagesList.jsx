import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit2, Eye, Download, CheckCircle, MapPin, Building2, Calendar, Briefcase, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import CustomSelect from '../../components/ui/CustomSelect';
import { motion, AnimatePresence } from 'framer-motion';

const StagesList = () => {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ statut: '', entreprise_ville: '' });

  const chargerStages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/stages', { params: filters });
      setStages(data.data);
    } catch (error) {
      notify('error', 'Erreur de chargement', 'Impossible de synchroniser la liste des stages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerStages();
  }, [filters]);

  const statutConfig = {
    en_attente: { label: 'En attente', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    en_cours: { label: 'En cours', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    termine: { label: 'Terminé', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    valide: { label: 'Validé', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-100 mb-2">Stages</h1>
          <p className="text-500 font-medium">Suivi des périodes en entreprise (PFE & PF)</p>
        </div>
        
        {user?.role === 'admin' && (
          <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
            <Plus size={20} strokeWidth={3} /> Ajouter un stage
          </button>
        )}
      </div>

      {/* Filters Section */}
      <div className="glass rounded-[2.5rem] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Statut</label>
            <CustomSelect
              options={[
                { value: '', label: 'Tous les statuts' },
                ...Object.entries(statutConfig).map(([key, config]) => ({ value: key, label: config.label }))
              ]}
              value={filters.statut}
              onChange={(val) => setFilters({...filters, statut: val})}
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
                onChange={(e) => setFilters({...filters, entreprise_ville: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-500 font-medium">Synchronisation des stages...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {stages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center glass rounded-[2.5rem]"
              >
                <Briefcase className="w-12 h-12 text-500 mx-auto mb-4" />
                <p className="text-500 font-bold uppercase tracking-widest text-sm">Aucun stage trouvé</p>
              </motion.div>
            ) : (
              stages.map((stage, index) => (
                <motion.div 
                  key={stage.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="glass rounded-[2.5rem] overflow-hidden flex flex-col group transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="p-8 pb-4 relative">
                    <div className={`absolute top-8 right-8 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${statutConfig[stage.statut].bg} ${statutConfig[stage.statut].color} ${statutConfig[stage.statut].border}`}>
                      {statutConfig[stage.statut].label}
                    </div>
                    <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-6 text-primary group-hover:scale-110 transition-transform">
                      <Building2 size={24} />
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
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-overlay border border-border flex items-center justify-center font-black text-400 text-sm">
                          {stage.stagiaire.nom_complet.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-200 truncate">{stage.stagiaire.nom_complet}</p>
                          <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-0.5">{stage.stagiaire.filiere.code}</p>
                        </div>
                      </div>
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
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stage.progression}%` }}
                            className="bg-primary h-full rounded-full glow-primary"
                          />
                        </div>
                      </div>
                    </div>
                    
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
                     <button className="flex-1 py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-widest text-400 bg-overlay border border-border hover:bg-overlay-hover hover:text-100 transition-all flex items-center justify-center gap-2">
                       <Eye size={16} /> Détails
                     </button>
                     {user?.role === 'admin' && (
                       <button className="flex-1 py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-widest text-background bg-100 hover:opacity-90 transition-all flex items-center justify-center gap-2">
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
    </div>
  );
};

export default StagesList;

