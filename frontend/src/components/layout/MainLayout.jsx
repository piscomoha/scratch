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
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-2 border-primary rounded-full"
        />
        <p className="text-zinc-500 font-medium animate-pulse">Initialisation du portail...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex overflow-x-hidden">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSidebar}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen lg:pl-[18rem]">
        <Header />
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-4 sm:py-6 overflow-x-hidden overflow-y-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

