import { useDashboardStats } from '../hooks/useQueries';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { 
  Users, UserCheck, UserX, Briefcase, TrendingUp, Calendar, 
  ArrowUpRight, FileText, Download, Award, Clock, Star, Bell,
  ChevronRight, Info, CheckCircle, AlertTriangle
} from 'lucide-react';

/* ── Decorative diamond ── */
const Diamond = ({ size = 10, color = '#2E8B57', opacity = 1 }) => (
  <div style={{
    width: size, height: size,
    transform: 'rotate(45deg)',
    background: color,
    borderRadius: Math.max(1, size * 0.15),
    opacity,
    flexShrink: 0,
  }} />
);

/* ── Stat card ── */
const StatCard = ({ label, value, icon: Icon, color, bgColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -3, transition: { duration: 0.2 } }}
    className="glass rounded-2xl p-5 relative overflow-hidden group cursor-default"
  >
    {/* Decorative corner diamond */}
    <div className="absolute -top-4 -right-4 opacity-[0.06] group-hover:opacity-[0.10] transition-opacity">
      <div style={{
        width: 64, height: 64,
        transform: 'rotate(45deg)',
        background: color,
        borderRadius: 8,
      }} />
    </div>

    <div className="flex items-start justify-between mb-4">
      <div className="p-2.5 rounded-xl" style={{ background: bgColor }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <ArrowUpRight className="w-4 h-4 text-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>

    <p className="text-[11px] font-bold uppercase tracking-wider text-500 mb-1">{label}</p>
    <h3 className="text-3xl font-black text-100">{value ?? '—'}</h3>

    {/* Bottom accent bar */}
    <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
  </motion.div>
);

/* ── Custom bar chart tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-bold text-100 mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div style={{ width: 8, height: 8, borderRadius: 2, background: entry.fill }} />
          <span className="text-400">{entry.name === 'presents' ? 'Présents' : 'Absents'}:</span>
          <span className="font-bold text-100">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const { data, isLoading, error } = useDashboardStats();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="flex gap-2">
        {[{ color: '#2E8B57', d: 0 }, { color: '#8C9BA8', d: 150 }, { color: '#2660A4', d: 300 }].map((d, i) => (
          <motion.div key={i}
            animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: d.d / 1000, ease: 'easeInOut' }}
            style={{ width: 14, height: 14, transform: 'rotate(45deg)', background: d.color, borderRadius: 2 }}
          />
        ))}
      </div>
      <p className="text-500 text-sm font-medium">Chargement du tableau de bord...</p>
    </div>
  );

  // If there's an error, show it
  if (error) return (
    <div className="flex flex-col items-center justify-center py-32 opacity-50">
      <p className="text-sm font-medium">Erreur lors du chargement des données.</p>
      <button onClick={() => window.location.reload()} className="mt-4 btn-primary">Réessayer</button>
    </div>
  );

  // Use a default empty object if data is missing to avoid "Aucune donnee disponible" if data is just {}
  const statsData = data || {};
  const isAdminOrFormateur = user?.role === 'admin' || user?.role === 'formateur';

  const adminStats = [
    { label: 'Total Stagiaires', value: statsData.total_stagiaires, icon: Users,      color: '#2660A4', bgColor: 'rgba(38,96,164,0.10)' },
    { label: 'Stagiaires Actifs', value: statsData.actifs,           icon: UserCheck,  color: '#2E8B57', bgColor: 'rgba(46,139,87,0.10)' },
    { label: 'Absences (7j)',     value: (statsData.absences_recentes || []).length, icon: UserX, color: '#DC2626', bgColor: 'rgba(220,38,38,0.08)' },
    { label: 'En Stage',          value: statsData.en_stage,          icon: Briefcase,  color: '#8C9BA8', bgColor: 'rgba(140,155,168,0.12)' },
  ];

  const stagiaireStats = [
    { label: 'Moyenne Générale', value: statsData.my_stats?.moyenne_generale ?? 0, icon: Award,      color: '#2660A4', bgColor: 'rgba(38,96,164,0.10)' },
    { label: 'Total Absences',   value: statsData.my_stats?.total_absences ?? 0,   icon: UserX,      color: '#DC2626', bgColor: 'rgba(220,38,38,0.08)' },
    { label: 'Taux Présence',    value: (100 - ((statsData.my_stats?.total_absences || 0) * 2)).toString() + '%', icon: TrendingUp, color: '#2E8B57', bgColor: 'rgba(46,139,87,0.10)' },
    { label: 'Notifications',    value: (statsData.recent_notifications || []).filter(n => !n.is_read).length, icon: Bell, color: '#8C9BA8', bgColor: 'rgba(140,155,168,0.12)' },
  ];

  const currentStats = isAdminOrFormateur ? adminStats : stagiaireStats;

  return (
    <div className="space-y-6 pb-10">

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Diamond size={8} color="#2E8B57" />
            <Diamond size={8} color="#8C9BA8" />
            <Diamond size={8} color="#2660A4" />
            <span className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Tableau de bord</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-100 tracking-tight">
            {isAdminOrFormateur ? 'Vue d\'ensemble' : 'Mon Espace Stagiaire'}
          </h1>
          <p className="text-400 text-sm mt-0.5">
            Bienvenue, <span className="font-bold text-secondary">{user?.name}</span>
          </p>
        </div>

        {/* Global attendance rate badge (Admin only) */}
        {isAdminOrFormateur && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl px-5 py-3.5 flex items-center gap-4 flex-shrink-0"
            style={{ borderLeft: '3px solid #2E8B57' }}
          >
            <div className="p-2 rounded-xl" style={{ background: 'rgba(46,139,87,0.10)' }}>
              <TrendingUp className="w-5 h-5" style={{ color: '#2E8B57' }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-500">Taux de présence global</p>
              <p className="text-2xl font-black text-100">{statsData.taux_presence_global}%</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentStats.map((stat, i) => (
          <StatCard key={i} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Main content row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart or Recent Notes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 glass rounded-2xl p-6 overflow-x-auto"
        >
          {isAdminOrFormateur ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" style={{ color: '#2660A4' }} />
                  <h3 className="font-bold text-100 text-base">Activité — 7 derniers jours</h3>
                </div>
                <div className="flex gap-4">
                  {[
                    { color: '#2E8B57', label: 'Présents' },
                    { color: '#8C9BA8', label: 'Absents' },
                  ].map((l, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-500">
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-64 w-full min-w-[440px] md:min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsData.presences_par_jour || []} barGap={4}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="jour"
                      axisLine={false} tickLine={false} dy={10}
                      tick={{ fill: isDark ? '#5A6B7A' : '#8C9BA8', fontSize: 11, fontWeight: 500 }}
                    />
                    <YAxis
                      axisLine={false} tickLine={false}
                      tick={{ fill: isDark ? '#5A6B7A' : '#8C9BA8', fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)', radius: 8 }} />
                    <Bar dataKey="presents" name="presents" fill="#2E8B57" radius={[5, 5, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="absents"  name="absents"  fill="#8C9BA8" radius={[5, 5, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5" style={{ color: '#2660A4' }} />
                <h3 className="font-bold text-100 text-base">Mes dernières notes</h3>
              </div>
              <div className="space-y-4">
                {statsData.my_stats?.recent_notes?.length > 0 ? (
                  statsData.my_stats.recent_notes.map((note, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-overlay border border-border group hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-100 text-sm">{note.module}</h4>
                          <p className="text-[11px] text-500 mt-0.5">{new Date(note.date).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-xl font-black text-lg ${note.valeur >= 10 ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                        {note.valeur}/20
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 rounded-full bg-overlay mb-4">
                      <FileText size={32} className="text-500" />
                    </div>
                    <p className="text-sm text-500 font-medium">Aucune note enregistrée pour le moment.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>

        {/* Side column: Absences (Admin) or Recent Activity (Everyone) */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass rounded-2xl p-6 flex flex-col flex-1"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 flex-shrink-0" style={{ color: '#2660A4' }} />
                <h3 className="font-bold text-100 text-base">Fil d'actualité</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-500 bg-overlay px-2 py-1 rounded-lg">Recent</span>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar max-h-[400px] pr-1">
              {statsData.recent_notifications?.length > 0 ? (
                data.recent_notifications.map((notif, i) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    onClick={() => {
                      if (notif.link) {
                        if (notif.link.startsWith('http')) {
                          window.open(notif.link, '_blank');
                        } else {
                          // Standard internal link navigation could go here if using a router hook
                        }
                      }
                    }}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl transition-all hover:bg-overlay border border-transparent hover:border-border group relative overflow-hidden ${notif.link ? 'cursor-pointer' : ''}`}
                  >
                    {/* Icon based on notification type/content */}
                    <div className={`h-10 w-10 rounded-xl flex-shrink-0 flex items-center justify-center border transition-colors ${
                      notif.title.toLowerCase().includes('note') ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                      notif.title.toLowerCase().includes('document') ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                      'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                    }`}>
                      {notif.title.toLowerCase().includes('note') ? <Award size={18} /> :
                       notif.title.toLowerCase().includes('document') ? <FileText size={18} /> :
                       <Bell size={18} />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="text-xs font-black text-100 truncate group-hover:text-primary transition-colors">
                          {notif.title}
                        </h4>
                        {!notif.is_read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-500 line-clamp-2 leading-relaxed mb-2 font-medium">
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-400 font-bold uppercase tracking-widest flex items-center gap-1">
                          <Clock size={10} /> {new Date(notif.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                        <ChevronRight size={12} className="text-400 opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
                      </div>
                    </div>

                    {/* Left indicator */}
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 group-hover:h-1/2 transition-all rounded-r-full ${
                      notif.title.toLowerCase().includes('note') ? 'bg-amber-500' :
                      notif.title.toLowerCase().includes('document') ? 'bg-blue-500' :
                      'bg-emerald-500'
                    }`} />
                  </motion.div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center opacity-40">
                  <Bell size={32} className="mb-3" />
                  <p className="text-xs font-bold uppercase tracking-widest">Aucune activité</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
