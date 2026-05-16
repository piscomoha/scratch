import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X, 
  AlertTriangle,
  Bell
} from 'lucide-react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  const notify = useCallback((type, title, message, roles = ['admin', 'formateur', 'stagiaire']) => {
    // Role-based filtering
    if (user && !roles.includes(user.role)) return;

    const id = Math.random().toString(36).substring(2, 9);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setNotifications((prev) => [
      { id, type, title, message, timestamp, roles },
      ...prev
    ]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, [user]);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-emerald-400" size={20} />;
      case 'error': return <AlertCircle className="text-rose-400" size={20} />;
      case 'warning': return <AlertTriangle className="text-amber-400" size={20} />;
      case 'info': return <Info className="text-blue-400" size={20} />;
      default: return <Bell className="text-primary" size={20} />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success': return 'border-emerald-500/20 bg-emerald-500/[0.02] shadow-emerald-500/5';
      case 'error': return 'border-rose-500/20 bg-rose-500/[0.02] shadow-rose-500/5';
      case 'warning': return 'border-amber-500/20 bg-amber-500/[0.02] shadow-amber-500/5';
      case 'info': return 'border-blue-500/20 bg-blue-500/[0.02] shadow-blue-500/5';
      default: return 'border-primary/20 bg-primary/[0.02] shadow-primary/5';
    }
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 w-full max-w-[400px] pointer-events-none">
        <AnimatePresence mode="popLayout">
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={`
                pointer-events-auto glass rounded-3xl p-5 border shadow-2xl flex gap-4 
                ${getStyles(n.type)}
              `}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-sm font-black text-100 tracking-tight truncate">{n.title}</h4>
                  <span className="text-[10px] font-bold text-500 uppercase tracking-widest">{n.timestamp}</span>
                </div>
                <p className="text-xs text-500 font-medium mt-1 leading-relaxed line-clamp-2">
                  {n.message}
                </p>
              </div>

              <button 
                onClick={() => removeNotification(n.id)}
                className="flex-shrink-0 self-start p-1.5 rounded-xl hover:bg-overlay-hover text-500 transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
