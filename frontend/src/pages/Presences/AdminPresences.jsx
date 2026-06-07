import { useState } from 'react';
import { usePresencesSummary, useFilieres } from '../../hooks/useQueries';
import { ArrowLeft, Users, Calendar, AlertCircle, Search, Percent, BookOpen, Clock, Check, FileText, ChevronRight } from 'lucide-react';
import CustomSelect from '../../components/ui/CustomSelect';
import { motion, AnimatePresence } from 'framer-motion';

const CircularProgress = ({ percent, size = 60, strokeWidth = 5 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  let strokeColor = 'stroke-emerald-500';
  let bgColor = 'bg-emerald-500/10 text-emerald-400';
  if (percent < 70) {
    strokeColor = 'stroke-rose-500';
    bgColor = 'bg-rose-500/10 text-rose-400';
  } else if (percent < 90) {
    strokeColor = 'stroke-amber-500';
    bgColor = 'bg-amber-500/10 text-amber-400';
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="stroke-border"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${strokeColor} transition-all duration-500 ease-out`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-[11px] font-black text-100">{Math.round(percent)}%</span>
    </div>
  );
};

const AdminPresences = () => {
  const [filiereId, setFiliereId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateDebut, setDateDebut] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [dateFin, setDateFin] = useState(new Date().toISOString().split('T')[0]);
  const [selectedGroupe, setSelectedGroupe] = useState(null);

  const { data: filieres } = useFilieres();
  
  // API Call filters
  const apiFilters = {
    date_debut: dateDebut,
    date_fin: dateFin,
    filiere_id: filiereId,
  };

  // Group summary query
  const { data: summaryData, isLoading: isSummaryLoading } = usePresencesSummary(apiFilters);

  // Group detail query (enabled only when a group is selected)
  const { data: detailData, isLoading: isDetailLoading } = usePresencesSummary({
    ...apiFilters,
    groupe: selectedGroupe,
  });

  const getStatusColor = (percent) => {
    if (percent >= 90) return 'border-emerald-500/20 bg-emerald-500/[0.02] hover:border-emerald-500/35';
    if (percent >= 70) return 'border-amber-500/20 bg-amber-500/[0.02] hover:border-amber-500/35';
    return 'border-rose-500/20 bg-rose-500/[0.02] hover:border-rose-500/35';
  };

  const getStatusBadge = (percent) => {
    if (percent >= 90) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (percent >= 70) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  };

  // Filter groups locally based on search
    const filteredGroupes = summaryData?.groupes?.filter((g) =>
      g.groupe?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.filiere_code?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rotate-45 bg-emerald-600 rounded-sm" />
            <div className="w-2 h-2 rotate-45 bg-gray-400 rounded-sm" />
            <div className="w-2 h-2 rotate-45 bg-secondary rounded-sm" />
            <span className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Tableau de bord admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-100">
            {selectedGroupe ? `Absences — ${selectedGroupe}` : 'Présences & Absences'}
          </h1>
          <p className="text-400 text-sm mt-0.5">
            {selectedGroupe
              ? `Détail individuel des présences pour le groupe ${selectedGroupe}`
              : 'Vue globale et statistiques d\'absentéisme par groupe'}
          </p>
        </div>

        {selectedGroupe && (
          <button
            onClick={() => setSelectedGroupe(null)}
            className="btn-secondary py-2.5 px-5 flex items-center gap-2 hover:translate-x-[-2px] transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux groupes
          </button>
        )}
      </div>

      {/* Filters Section */}
      <div className="glass rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Filière</label>
            <CustomSelect
              options={[
                { value: '', label: 'Toutes les filières' },
                ...(filieres?.map(f => ({ value: f.id, label: f.code })) || [])
              ]}
              value={filiereId}
              onChange={(val) => {
                setFiliereId(val);
                setSelectedGroupe(null); // Clear group drilldown if filiere changes
              }}
              placeholder="Filière"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Recherche</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Rechercher groupe..."
                className="w-full bg-input border border-border rounded-xl py-2.5 pl-11 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!!selectedGroupe}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Date Début</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500" />
              <input
                type="date"
                className="w-full bg-input border border-border rounded-xl py-2.5 pl-11 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Date Fin</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500" />
              <input
                type="date"
                className="w-full bg-input border border-border rounded-xl py-2.5 pl-11 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {!selectedGroupe ? (
          // VIEW 1: Groups Grid
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {isSummaryLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="glass rounded-3xl p-6 h-[190px] animate-pulse flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-6 w-1/2 bg-border rounded-lg" />
                      <div className="h-4 w-3/4 bg-border rounded-md" />
                    </div>
                    <div className="h-10 w-full bg-border rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filteredGroupes.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                <Users className="w-12 h-12 text-500 mb-4 stroke-1" />
                <h3 className="text-lg font-black text-100 mb-1">Aucun groupe trouvé</h3>
                <p className="text-400 text-sm">Essayez de modifier vos filtres ou lancez une nouvelle recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGroupes.map((g, index) => (
                  <motion.div
                    key={g.groupe}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => setSelectedGroupe(g.groupe)}
                    className={`glass rounded-3xl p-6 border-2 transition-all duration-300 relative group cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl ${getStatusColor(
                      g.taux_presence
                    )}`}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                            {g.filiere_code}
                          </span>
                          <h3 className="text-xl font-black text-100 tracking-tight mt-2 group-hover:text-primary transition-colors">
                            {g.groupe}
                          </h3>
                        </div>
                        <CircularProgress percent={g.taux_presence} />
                      </div>

                      {/* Info lines */}
                      <div className="space-y-2.5 text-xs text-400 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-500" />
                            Stagiaires
                          </span>
                          <span className="font-bold text-100">{g.total_stagiaires}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-500" />
                            Séances (période)
                          </span>
                          <span className="font-bold text-100">{g.total_seances}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-rose-400">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Total Absences
                          </span>
                          <span className="font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/10">
                            {g.total_absences}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/60 flex justify-between items-center text-xs font-black text-primary">
                      <span>Détails par stagiaire</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          // VIEW 2: Groupe Detail Table
          <motion.div
            key="table-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {isDetailLoading ? (
              <div className="glass rounded-3xl p-8 animate-pulse space-y-6">
                <div className="h-8 w-1/3 bg-border rounded-lg" />
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 w-full bg-border rounded-lg" />
                  ))}
                </div>
              </div>
            ) : !detailData?.stagiaires || detailData.stagiaires.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                <AlertCircle className="w-12 h-12 text-rose-500 mb-4 stroke-1" />
                <h3 className="text-lg font-black text-100 mb-1">Aucun stagiaire trouvé</h3>
                <p className="text-400 text-sm">Il se peut que ce groupe n'ait pas de stagiaires enregistrés.</p>
              </div>
            ) : (
              <div className="glass rounded-3xl overflow-hidden border border-border/80 shadow-lg">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-overlay">
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-500">Stagiaire</th>
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-500">Code Massar</th>
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-500 text-center">Séances Pointées</th>
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-500 text-center">Retards</th>
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-500 text-center">Justifiés</th>
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-500 text-center">Absences</th>
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-500 text-center">Taux Présence</th>
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-500 text-right">Alerte</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {detailData.stagiaires.map((s, idx) => (
                        <tr
                          key={s.id}
                          className={`hover:bg-overlay-hover transition-colors group ${
                            s.alerte ? 'bg-rose-500/[0.015] hover:bg-rose-500/[0.03]' : ''
                          }`}
                        >
                          {/* Name / Profile avatar symbol */}
                          <td className="py-4.5 px-6">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center transition-all ${
                                  s.alerte
                                    ? 'bg-rose-500/10 text-rose-400'
                                    : 'bg-primary/10 text-primary'
                                }`}
                              >
                                {s.nom_complet.charAt(0)}
                              </div>
                              <span className="font-bold text-100 text-sm group-hover:text-primary transition-colors">
                                {s.nom_complet}
                              </span>
                            </div>
                          </td>

                          {/* Massar Code */}
                          <td className="py-4.5 px-6 font-mono text-xs text-400">
                            {s.code_massar}
                          </td>

                          {/* Total pointées */}
                          <td className="py-4.5 px-6 text-center font-semibold text-sm text-200">
                            {s.total_seances}
                          </td>

                          {/* Retards */}
                          <td className="py-4.5 px-6 text-center">
                            {s.retards > 0 ? (
                              <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold px-2 py-0.5 rounded-md">
                                <Clock className="w-3 h-3" />
                                {s.retards}
                              </span>
                            ) : (
                              <span className="text-500">-</span>
                            )}
                          </td>

                          {/* Justifiés */}
                          <td className="py-4.5 px-6 text-center">
                            {s.justifies > 0 ? (
                              <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-2 py-0.5 rounded-md">
                                <FileText className="w-3 h-3" />
                                {s.justifies}
                              </span>
                            ) : (
                              <span className="text-500">-</span>
                            )}
                          </td>

                          {/* Absences */}
                          <td className="py-4.5 px-6 text-center">
                            {s.total_seances === 0 ? (
                              <span className="text-500 text-xs">-</span>
                            ) : s.absences > 0 ? (
                              <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-black px-2.5 py-0.5 rounded-md">
                                <AlertCircle className="w-3 h-3" />
                                {s.absences}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-2 py-0.5 rounded-md">
                                <Check className="w-3 h-3" />
                                0
                              </span>
                            )}
                          </td>

                          {/* Taux Présence */}
                          <td className="py-4.5 px-6 text-center">
                            {s.total_seances === 0 ? (
                              <span className="text-500 text-xs">-</span>
                            ) : (
                              <span
                                className={`text-sm font-black ${
                                  s.taux_presence >= 90
                                    ? 'text-emerald-500'
                                    : s.taux_presence >= 70
                                    ? 'text-amber-500'
                                    : 'text-rose-500'
                                }`}
                              >
                                {s.taux_presence}%
                              </span>
                            )}
                          </td>

                          {/* Alerte */}
                          <td className="py-4.5 px-6 text-right">
                            {s.total_seances === 0 ? (
                              <span className="inline-flex items-center gap-1 bg-zinc-500/10 text-500 border border-zinc-500/20 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                                Pas de pointage
                              </span>
                            ) : s.alerte ? (
                              <span className="inline-flex items-center gap-1 bg-rose-500/15 text-rose-500 border border-rose-500/30 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full animate-pulse-ring">
                                Alerte Absences (&gt;30%)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                                Régulier
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPresences;
