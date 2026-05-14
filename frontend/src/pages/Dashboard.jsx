import { useDashboardStats } from '../hooks/useQueries';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from 'recharts';
import { Users, UserCheck, UserX, Briefcase, TrendingUp, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { data, isLoading } = useDashboardStats();
  const { user } = useAuth();
  const { theme } = useTheme();

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="h-10 w-10 border-t-2 border-primary rounded-full animate-spin" />
      <p className="text-500 font-medium">Analyse des données en cours...</p>
    </div>
  );

  const stats = [
    { label: 'Total Stagiaires', value: data.total_stagiaires, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Stagiaires Actifs', value: data.actifs, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Absences (7j)', value: data.absences_recentes?.length || 0, icon: UserX, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'En Stage', value: data.en_stage, icon: Briefcase, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  ];

  const isDark = theme === 'dark';

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-100 mb-2">Tableau de bord</h1>
          <p className="text-500 font-medium flex items-center gap-2">
            Bienvenue sur votre portail, <span className="text-200">{user?.name}</span>
          </p>
        </div>
        
        <div className="glass px-6 py-4 rounded-[1.5rem] flex items-center gap-4 glow-primary">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-500 font-bold block mb-0.5">Taux de présence global</span>
            <div className="text-2xl font-black text-100">{data.taux_presence_global}%</div>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass rounded-[2rem] p-6 relative overflow-hidden group transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-5 relative z-10">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-500 font-bold mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-100">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-100 tracking-tight flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              Activité des 7 derniers jours
            </h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 text-xs text-500">
                <span className="w-2 h-2 rounded-full bg-primary" /> Présents
              </div>
              <div className="flex items-center gap-1.5 text-xs text-500">
                <span className="w-2 h-2 rounded-full bg-secondary" /> Absents
              </div>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.presences_par_jour}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#ffffff05" : "#00000005"} vertical={false} />
                <XAxis 
                  dataKey="jour" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDark ? '#71717a' : '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDark ? '#71717a' : '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', radius: 12 }} 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#18181b' : '#ffffff', 
                    borderRadius: '16px', 
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', 
                    boxShadow: isDark ? '0 20px 25px -5px rgb(0 0 0 / 0.5)' : '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }} 
                  itemStyle={{ color: isDark ? '#f4f4f5' : '#0f172a' }}
                />
                <Bar dataKey="presents" fill="#8B5CF6" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="absents" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="glass rounded-[2.5rem] p-8">
          <h3 className="text-xl font-bold text-100 tracking-tight mb-6 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-rose-400" />
            Dernières absences
          </h3>
          <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
            {data.absences_recentes?.length > 0 ? (
              data.absences_recentes.map((absence, i) => (
                <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-overlay border border-transparent hover:border-border transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 text-rose-400 flex items-center justify-center font-bold flex-shrink-0 text-lg">
                    {absence.stagiaire.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-100 truncate">{absence.stagiaire}</h4>
                    <p className="text-xs text-500 mt-0.5 truncate">{absence.module}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                        {absence.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <Users size={48} className="mb-4 text-500" />
                <p className="text-sm text-500 font-medium">Aucune absence récente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

