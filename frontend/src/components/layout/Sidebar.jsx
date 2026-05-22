import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CheckSquare,
  Briefcase,
  LogOut,
  Settings,
  Link as LinkIcon,
  X,
  FileText,
} from 'lucide-react';
import logo from '../../assets/ofppt_logo.png';

/* ── Mini three-diamond logo mark ── */
const DiamondMark = ({ size = 10 }) => (
  <div className="flex items-center relative" style={{ width: size * 3.2, height: size }}>
    {[
      { color: '#2E8B57', left: 0 },
      { color: '#8C9BA8', left: size * 0.9 },
      { color: '#2660A4', left: size * 1.8 },
    ].map((d, i) => (
      <div key={i} style={{
        position: 'absolute', left: d.left,
        width: size, height: size,
        transform: 'rotate(45deg)',
        background: d.color,
        borderRadius: 2,
      }} />
    ))}
  </div>
);

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isOpen: isSidebarOpen, closeSidebar } = useSidebar();

  const links = [
    { name: 'Tableau de bord',  to: '/dashboard',         icon: LayoutDashboard, roles: ['admin', 'formateur', 'stagiaire'] },
    { name: 'Affectations',     to: '/admin/assignments',  icon: LinkIcon,        roles: ['admin'] },
    { name: 'Documents',        to: '/admin/documents',    icon: FileText,        roles: ['admin'] },
    { name: 'Stagiaires',       to: '/stagiaires',         icon: Users,           roles: ['admin', 'formateur', 'stagiaire'] },
    { name: 'Notes',            to: '/notes',              icon: BookOpen,        roles: ['admin', 'formateur'] },
    { name: 'Présences',        to: '/presences',          icon: CheckSquare,     roles: ['admin', 'formateur'] },
    { name: 'Stages',           to: '/stages',             icon: Briefcase,       roles: ['admin'] },
    { name: 'Paramètres',       to: '/settings',           icon: Settings,        roles: ['admin', 'formateur', 'stagiaire'] },
  ];

  const filteredLinks = links.filter(l => user && l.roles.includes(user.role));

  const Content = () => (
    <div className="flex flex-col h-full">

      {/* ── Logo / Brand header ── */}
      <div className="px-6 py-7 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
            <img src={logo} alt="OFPPT" className="h-8 w-8 object-contain" />
          </div>
          <div>
            <span className="text-white font-black text-lg tracking-tight block leading-none">OFPPT</span>
            <span className="text-white/50 text-[10px] font-semibold tracking-widest uppercase">Hub Digital</span>
          </div>
        </div>
        <DiamondMark size={12} />
        <p className="text-white/40 text-[10px] mt-2 italic font-serif">La voie de l'avenir</p>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-0.5 custom-scrollbar">
        <p className="text-white/25 text-[9px] font-black uppercase tracking-[0.2em] px-3 mb-3">
          Navigation
        </p>
        {filteredLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : 'text-white/55 hover:text-white/90 hover:bg-white/[0.06]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'rgba(46,139,87,0.18)', border: '1px solid rgba(46,139,87,0.3)' }}
                    transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                  />
                )}
                {/* Left accent bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] rounded-r-full"
                    style={{ background: '#2E8B57' }} />
                )}

                <link.icon
                  className="w-[18px] h-[18px] flex-shrink-0 relative z-10 transition-transform duration-200 group-hover:scale-110"
                  style={{ color: isActive ? '#7ECFA8' : undefined }}
                />
                <span className="font-medium relative z-10 text-sm truncate">{link.name}</span>

                {/* Active diamond badge */}
                {isActive && (
                  <div className="ml-auto relative z-10">
                    <div style={{
                      width: 6, height: 6, transform: 'rotate(45deg)',
                      background: '#2E8B57', borderRadius: 1,
                    }} />
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── User / Logout footer ── */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #2E8B57, #2660A4)' }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">{user?.name}</p>
            <p className="text-white/40 text-[10px] uppercase tracking-wider">{user?.role}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => { logout(); closeSidebar(); }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition-all duration-200 group text-white/45 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="w-[17px] h-[17px] flex-shrink-0 transition-transform group-hover:-translate-x-0.5" />
          <span className="font-medium text-sm">Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop — Fixed */}
      <div
        className="hidden lg:flex w-64 h-screen flex-col fixed left-0 top-0 z-50 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1C3F6E 0%, #1e4a7d 40%, #1a3d5c 100%)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
        }}
      >
        <Content />
      </div>

      {/* Mobile — Animated drawer */}
      <motion.div
        initial={{ x: -260 }}
        animate={{ x: isSidebarOpen ? 0 : -260 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="fixed lg:hidden w-64 h-screen flex flex-col z-50 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1C3F6E 0%, #1e4a7d 40%, #1a3d5c 100%)',
          boxShadow: '4px 0 32px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex justify-end p-4 absolute top-0 right-0 z-10">
          <button
            onClick={closeSidebar}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>
        <Content />
      </motion.div>
    </>
  );
};

export default Sidebar;
