import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiCheckSquare,
  FiBriefcase,
  FiLogOut
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const links = [
    { name: 'Tableau de bord', to: '/dashboard', icon: <FiHome />, roles: ['admin', 'formateur'] },
    { name: 'Stagiaires', to: '/stagiaires', icon: <FiUsers />, roles: ['admin', 'formateur', 'stagiaire'] },
    { name: 'Notes', to: '/notes', icon: <FiBookOpen />, roles: ['admin', 'formateur'] },
    { name: 'Présences', to: '/presences', icon: <FiCheckSquare />, roles: ['admin', 'formateur'] },
    { name: 'Stages', to: '/stages', icon: <FiBriefcase />, roles: ['admin'] },
  ];

  return (
    <div className="w-64 bg-primary text-white h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 font-bold text-2xl border-b border-primary-dark">
        <span className="text-secondary">OFPPT</span> <span className="text-sm font-normal">Hub</span>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-2 px-4">
        {links
          .filter(link => user && link.roles.includes(user.role))
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-primary-dark text-secondary font-medium' : 'hover:bg-primary-dark/50'
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.name}
            </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-primary-dark">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-500/20 text-red-300 transition-colors"
        >
          <FiLogOut className="text-lg" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
