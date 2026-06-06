import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { Bell, Search, User, Menu, Check, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { useNotifications, useMarkAllNotificationsRead } from '../../hooks/useQueries';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const Header = () => {
  const { user } = useAuth();
  const { toggleSidebar } = useSidebar();
  const { data: notifications } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();
  const [showNotifications, setShowNotifications] = useState(false);
  const queryClient = useQueryClient();
  const prevNotifsRef = useRef(null);

  useEffect(() => {
    if (notifications) {
      if (prevNotifsRef.current !== null) {
        // Find new notifications that weren't in the previous list
        const newNotifs = notifications.filter(
          n => !prevNotifsRef.current.find(p => p.id === n.id) && !n.is_read
        );

        if (newNotifs.length > 0) {
          newNotifs.forEach(n => {
            toast.success(`Nouvelle notification: ${n.title}`, { duration: 5000, icon: '🔔' });
          });

          // If it's an affectation update, refresh the dashboard and data
          if (newNotifs.some(n => n.title.toLowerCase().includes('affectation'))) {
            queryClient.invalidateQueries();
          }
        }
      }
      prevNotifsRef.current = notifications;
    }
  }, [notifications, queryClient]);

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <header
      className="h-16 w-full max-w-full min-w-0 flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-40"
      style={{
        background: '#2660A4',
        boxShadow: '0 2px 16px rgba(38,96,164,0.18)',
      }}
    >
      {/* ── Left ── */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile burger */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
          title="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb diamond divider (desktop) */}
        <div className="hidden lg:flex items-center gap-2">
          <div style={{
            width: 8, height: 8, transform: 'rotate(45deg)',
            background: 'rgba(255,255,255,0.4)', borderRadius: 1,
          }} />
        </div>

        {/* Search bar */}
        <div className="relative group hidden md:flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-white/80 transition-colors pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-64 lg:w-80 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40
                       focus:outline-none focus:ring-2 focus:ring-white/25 transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}
          />
        </div>
      </div>

      {/* ── Right ── */}
      <div className="flex min-w-0 flex-shrink-0 items-center gap-2 sm:gap-3">
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(p => !p)}
            className="relative p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full ring-2"
                style={{ ringColor: '#2660A4' }} />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 rounded-2xl overflow-hidden z-50"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--card-shadow-lg)',
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b"
                    style={{ borderColor: 'var(--border)', background: 'rgba(38,96,164,0.04)' }}>
                    <div className="flex items-center gap-2">
                      <div style={{
                        width: 6, height: 6, transform: 'rotate(45deg)',
                        background: '#2660A4', borderRadius: 1,
                      }} />
                      <h3 className="font-bold text-sm text-100">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="badge-secondary text-[10px] px-1.5 py-0 leading-5">{unreadCount}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllRead.mutate()}
                          className="text-[10px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary/10 transition-all"
                        >
                          <Check size={10} /> Tout lu
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 rounded-lg text-500 hover:text-100 hover:bg-overlay transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* List */}
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications?.length > 0 ? notifications.map((n) => (
                      <div
                        key={n.id}
                        className="px-5 py-3.5 border-b last:border-0 transition-colors hover:bg-overlay"
                        style={{
                          borderColor: 'var(--border)',
                          background: !n.is_read ? 'rgba(38,96,164,0.03)' : undefined,
                        }}
                      >
                        <div className="flex justify-between items-start gap-2 mb-0.5">
                          <h4 className={`text-xs font-bold ${!n.is_read ? 'text-100' : 'text-400'}`}>
                            {n.title}
                          </h4>
                          <span className="text-[9px] text-500 font-medium whitespace-nowrap flex-shrink-0">
                            {new Date(n.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-[11px] text-500 leading-relaxed">{n.message}</p>
                      </div>
                    )) : (
                      <div className="py-12 text-center">
                        <Bell className="w-8 h-8 text-border mx-auto mb-2" />
                        <p className="text-xs text-500 italic">Aucune notification</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <div className="hidden sm:flex items-center gap-3 pl-3 border-l" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-white leading-none mb-0.5 truncate max-w-[120px]">{user?.name}</p>
            <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">{user?.role}</p>
          </div>
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #2E8B57, #1C3F6E)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            {user?.avatar
              ? <img src={user.avatar} alt="" className="h-full w-full object-cover rounded-xl" />
              : <span>{user?.name?.charAt(0)?.toUpperCase() ?? <User className="w-4 h-4" />}</span>
            }
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
