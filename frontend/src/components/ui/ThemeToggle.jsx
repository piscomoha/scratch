import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label="Basculer le thème"
      className="relative p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ y: 12, opacity: 0, rotate: -30 }}
            animate={{ y: 0,  opacity: 1, rotate: 0 }}
            exit={{   y: -12, opacity: 0, rotate: 30 }}
            transition={{ duration: 0.18, ease: 'circOut' }}
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 12, opacity: 0, rotate: -30 }}
            animate={{ y: 0,  opacity: 1, rotate: 0 }}
            exit={{   y: -12, opacity: 0, rotate: 30 }}
            transition={{ duration: 0.18, ease: 'circOut' }}
          >
            <Sun className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
