import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { Bell, Search, User, Menu } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
  const { user } = useAuth();
  const { toggleSidebar } = useSidebar();

  return (
    <header className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-40 backdrop-blur-md bg-background/50">
      {/* Left: Mobile Menu Button */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-400 hover:text-100 hover:bg-overlay rounded-xl transition-all"
          title="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Desktop Search  */}
        <div className="flex-1 max-w-md relative group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full bg-input border border-border rounded-xl py-2 sm:py-2.5 pl-12 pr-4 text-xs sm:text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-500"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />

        <button className="relative p-2 sm:p-2.5 rounded-xl text-400 hover:text-100 hover:bg-overlay transition-all">
          <Bell className="w-5 h-5 sm:w-5 sm:h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
        </button>

        <div className="hidden sm:flex items-center gap-3 sm:gap-4 pl-3 sm:pl-6 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-xs sm:text-sm font-semibold text-100 truncate">{user?.name}</p>
            <p className="text-[8px] sm:text-[10px] uppercase tracking-wider text-500 font-bold">{user?.role}</p>
          </div>
          <div className="h-9 sm:h-10 w-9 sm:w-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-[1px] glow-primary flex-shrink-0">
            <div className="h-full w-full rounded-[11px] bg-background flex items-center justify-center font-bold text-100 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-400" />
              )}
            </div>
          </div>
        </div>

        {/* Mobile user avatar only */}
        <div className="sm:hidden h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-secondary p-[1px] glow-primary">
          <div className="h-full w-full rounded-[11px] bg-background flex items-center justify-center font-bold text-100 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-400" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

