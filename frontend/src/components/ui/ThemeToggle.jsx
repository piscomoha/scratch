import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all duration-300 group overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2, ease: "circOut" }}
          >
            <Moon className="w-5 h-5 text-primary-light" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2, ease: "circOut" }}
          >
            <Sun className="w-5 h-5 text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
    </button>
  );
};

export default ThemeToggle;
