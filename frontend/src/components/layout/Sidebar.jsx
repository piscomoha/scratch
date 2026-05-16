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
  X
} from 'lucide-react';
import logo from '../../assets/ofppt_logo.png';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isOpen: isSidebarOpen, closeSidebar } = useSidebar();

  const links = [
    { name: 'Tableau de bord', to: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'formateur'] },
    { name: 'Affectations', to: '/admin/assignments', icon: LinkIcon, roles: ['admin'] },
    { name: 'Stagiaires', to: '/stagiaires', icon: Users, roles: ['admin', 'formateur', 'stagiaire'] },
    { name: 'Notes', to: '/notes', icon: BookOpen, roles: ['admin', 'formateur'] },
    { name: 'Présences', to: '/presences', icon: CheckSquare, roles: ['admin', 'formateur'] },
    { name: 'Stages', to: '/stages', icon: Briefcase, roles: ['admin'] },
    { name: 'Paramètres', to: '/settings', icon: Settings, roles: ['admin', 'formateur', 'stagiaire'] },
  ];

  const sidebarContent = (
    <>
      {/* Logo Area */}
      <div className="p-6 sm:p-8 flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <img 
            src={logo} 
            alt="OFPPT Logo" 
            className="relative h-16 sm:h-20 w-16 sm:w-20 object-contain drop-shadow-2xl" 
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="font-black text-lg sm:text-xl tracking-tighter text-100 text-center"><span className="hidden sm:inline">OFPPT</span> <span className="text-primary">Hub</span></span>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-500 font-bold text-center">Plateforme Digitale</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 flex flex-col gap-2 px-3 sm:px-4 overflow-y-auto">
        {links
          .filter(link => user && link.roles.includes(user.role))
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-100' 
                    : 'text-400 hover:text-100 hover:bg-overlay'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-primary rounded-xl"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <link.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary' : 'text-500'}`} />
                  <span className="font-medium relative z-10 truncate text-sm sm:text-base">{link.name}</span>
                </>
              )}
            </NavLink>
        ))}
      </div>

      {/* Footer / User Info */}
      <div className="p-3 sm:p-4 mt-auto border-t border-border">
        <button
          onClick={() => {
            logout();
            closeSidebar();
          }}
          className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 w-full rounded-xl hover:bg-red-500/10 text-500 hover:text-red-400 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium truncate text-sm sm:text-base">Déconnexion</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:flex w-64 glass h-[calc(100vh-2rem)] flex-col fixed left-4 top-4 rounded-2xl z-50 overflow-hidden shadow-2xl">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar - Animated */}
      <motion.div
        initial={{ x: -256 }}
        animate={{ x: isSidebarOpen ? 0 : -256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed lg:hidden w-64 glass h-screen flex flex-col z-50 overflow-hidden shadow-2xl rounded-r-2xl"
      >
        {/* Close button for mobile */}
        <div className="flex justify-end p-4">
          <button
            onClick={closeSidebar}
            className="p-2 text-400 hover:text-100 hover:bg-overlay rounded-xl transition-all lg:hidden"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Sidebar content offset for close button */}
        <div className="flex-1 flex flex-col overflow-y-auto -mt-16">
          {sidebarContent}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;

