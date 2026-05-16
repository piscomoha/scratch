import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNotification } from '../context/NotificationContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import logo from '../assets/ofppt_logo.png';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await login(data.email, data.password);
    
    if (result.success) {
      notify('success', 'Connexion réussie', `Bienvenue ${result.user?.name || ''}, ravi de vous revoir !`);
      navigate(result.role === 'stagiaire' ? '/stagiaires' : '/dashboard');
    } else {
      notify('error', 'Échec de connexion', result.message || 'Vérifiez vos identifiants');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/30 rounded-full filter blur-[80px] sm:blur-[120px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-secondary/20 rounded-full filter blur-[80px] sm:blur-[120px]"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full glass rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex mb-4 sm:mb-6 relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <img 
              src={logo} 
              alt="OFPPT Logo" 
              className="relative h-16 sm:h-24 w-16 sm:w-24 object-contain drop-shadow-2xl" 
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-100 mb-1 sm:mb-2">
            OFPPT <span className="text-gradient">Hub</span>
          </h1>
          <p className="text-400 text-xs sm:text-sm font-medium">Gestion pédagogique intelligente</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-400 ml-1">Email professionnel</label>
            <div className="relative group">
              <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-500 group-focus-within:text-primary transition-colors flex-shrink-0" />
              <input
                type="email"
                {...register('email', { required: 'L\'email est requis' })}
                className={`w-full bg-input border ${errors.email ? 'border-red-500/50 focus:ring-red-500/20' : 'border-border focus:ring-primary/20 focus:border-primary'} py-2.5 sm:py-3.5 pl-10 sm:pl-12 pr-3 sm:pr-4 rounded-xl sm:rounded-2xl text-100 focus:outline-none focus:ring-4 transition-all duration-300 placeholder:text-500 text-sm`}
                placeholder="nom.prenom@ofppt.ma"
              />
            </div>
            {errors.email && <p className="text-[11px] sm:text-xs font-medium text-red-400 ml-1 mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-400 ml-1">Mot de passe</label>
            <div className="relative group">
              <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-500 group-focus-within:text-primary transition-colors flex-shrink-0" />
              <input
                type="password"
                {...register('password', { required: 'Le mot de passe est requis' })}
                className={`w-full bg-input border ${errors.password ? 'border-red-500/50 focus:ring-red-500/20' : 'border-border focus:ring-primary/20 focus:border-primary'} py-2.5 sm:py-3.5 pl-10 sm:pl-12 pr-3 sm:pr-4 rounded-xl sm:rounded-2xl text-100 focus:outline-none focus:ring-4 transition-all duration-300 placeholder:text-500 text-sm`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-[11px] sm:text-xs font-medium text-red-400 ml-1 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-sm sm:text-base"
          >
            {loading ? (
              <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-[10px] sm:text-xs text-500 font-medium px-2">
            Accès réservé au personnel et stagiaires de l'OFPPT
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

