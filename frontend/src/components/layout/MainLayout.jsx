import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';

const MainLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const { isOpen: isSidebarOpen, closeSidebar } = useSidebar();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-6">
        {/* Animated OFPPT diamonds */}
        <div className="flex items-center gap-2">
          {[
            { color: '#2E8B57', delay: 0 },
            { color: '#8C9BA8', delay: 0.15 },
            { color: '#2660A4', delay: 0.3 },
          ].map((d, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
              style={{
                width: 16, height: 16,
                transform: 'rotate(45deg)',
                background: d.color,
                borderRadius: 3,
              }}
            />
          ))}
        </div>
        <p className="text-500 text-sm font-semibold">Initialisation du portail...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen w-full max-w-full bg-diamond-pattern flex overflow-x-hidden">

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSidebar}
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(28,63,110,0.55)', backdropFilter: 'blur(4px)' }}
        />
      )}

      <Sidebar />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="flex-1 min-w-0 w-full max-w-full flex flex-col min-h-screen lg:pl-64">
        <Header />
        <main className="flex-1 w-full max-w-full min-w-0 px-4 sm:px-6 md:px-8 py-6 overflow-x-hidden overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-full min-w-0"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
