import { useAuth } from '../../context/AuthContext';
import { Bell, Search, User } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 flex items-center justify-between px-8 sticky top-4 z-40 mx-4">
      <div className="flex-1 max-w-md relative group hidden md:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Rechercher un stagiaire..." 
          className="w-full bg-overlay border border-border rounded-xl py-2.5 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <ThemeToggle />

        <button className="relative p-2.5 rounded-xl text-400 hover:text-100 hover:bg-overlay transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
        </button>

        <div className="flex items-center gap-4 pl-6 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-100">{user?.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-500 font-bold">{user?.role}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-[1px] glow-primary">
            <div className="h-full w-full rounded-[11px] bg-background flex items-center justify-center font-bold text-100 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

