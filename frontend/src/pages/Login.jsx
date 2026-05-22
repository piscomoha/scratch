import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ChevronRight } from 'lucide-react';
import logo from '../assets/ofppt_logo.png';

/* ── Three interlocked OFPPT diamonds (matches logo) ── */
const LogoDiamonds = () => (
  <div className="flex items-center justify-center relative" style={{ width: 72, height: 48 }}>
    {/* Green diamond */}
    <div className="absolute" style={{ left: 0 }}>
      <div style={{
        width: 32, height: 32, transform: 'rotate(45deg)',
        background: '#2E8B57', borderRadius: 4,
        boxShadow: '0 4px 12px rgba(46,139,87,0.35)'
      }} />
    </div>
    {/* Gray diamond */}
    <div className="absolute" style={{ left: 20, zIndex: 2 }}>
      <div style={{
        width: 32, height: 32, transform: 'rotate(45deg)',
        background: '#8C9BA8', borderRadius: 4,
        boxShadow: '0 4px 12px rgba(140,155,168,0.30)'
      }} />
    </div>
    {/* Blue diamond */}
    <div className="absolute" style={{ left: 40 }}>
      <div style={{
        width: 32, height: 32, transform: 'rotate(45deg)',
        background: '#2660A4', borderRadius: 4,
        boxShadow: '0 4px 12px rgba(38,96,164,0.35)'
      }} />
    </div>
  </div>
);

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await login(data.email, data.password);
    if (result.success) {
      notify('success', 'Connexion réussie', `Bienvenue ${result.user?.name || ''} !`);
      navigate(result.role === 'stagiaire' ? '/stagiaires' : '/dashboard');
    } else {
      notify('error', 'Échec de connexion', result.message || 'Vérifiez vos identifiants');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-diamond-pattern flex overflow-hidden">

      {/* ── Left panel — Brand Identity ── */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1C3F6E 0%, #2660A4 50%, #2E8B57 100%)' }}
      >
        {/* Background decorative diamonds */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { size: 200, top: '-60px', left: '-60px', opacity: 0.10, bg: '#fff' },
            { size: 160, top: '20%',   left: '60%',  opacity: 0.07, bg: '#fff' },
            { size: 280, top: '55%',   left: '-80px', opacity: 0.08, bg: '#2E8B57' },
            { size: 120, top: '80%',   left: '70%',  opacity: 0.10, bg: '#fff' },
            { size: 90,  top: '10%',   left: '30%',  opacity: 0.06, bg: '#fff' },
          ].map((d, i) => (
            <div key={i} style={{
              position: 'absolute', top: d.top, left: d.left,
              width: d.size, height: d.size,
              transform: 'rotate(45deg)', borderRadius: 12,
              background: d.bg, opacity: d.opacity,
            }} />
          ))}
        </div>

        {/* Top logo area */}
        <div className="relative z-10 p-10 flex items-center gap-4">
          <img src={logo} alt="OFPPT" className="h-14 w-14 object-contain drop-shadow-lg" />
          <div>
            <span className="text-white font-black text-2xl tracking-tight block">OFPPT</span>
            <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Hub Digital</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 px-10 flex flex-col gap-8">
          <div>
            <h1 className="text-white font-black text-4xl xl:text-5xl leading-tight mb-4">
              La voie de<br />
              <span style={{ color: '#7ECFA8' }}>l'avenir</span>
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-xs font-serif italic">
              Plateforme de gestion pédagogique dédiée au personnel et aux stagiaires de l'OFPPT.
            </p>
          </div>

          {/* Three brand diamonds with labels */}
          <div className="flex gap-6">
            {[
              { color: '#2E8B57', label: 'Formation', shadow: 'rgba(46,139,87,0.4)' },
              { color: '#8C9BA8', label: 'Suivi',     shadow: 'rgba(140,155,168,0.3)' },
              { color: '#2660A4', label: 'Réussite',  shadow: 'rgba(38,96,164,0.4)' },
            ].map((d, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex flex-col items-center gap-3"
              >
                <div style={{
                  width: 36, height: 36, transform: 'rotate(45deg)', borderRadius: 6,
                  background: d.color, boxShadow: `0 6px 20px ${d.shadow}`
                }} />
                <span className="text-white/80 text-xs font-semibold tracking-widest uppercase"
                  style={{ marginTop: 8 }}>
                  {d.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10 p-10">
          <div className="border-t border-white/10 pt-6">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} OFPPT — Office de la Formation Professionnelle et de la Promotion du Travail
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Right panel — Login Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative">

        {/* Mobile logo */}
        <div className="lg:hidden flex flex-col items-center gap-3 mb-10">
          <img src={logo} alt="OFPPT" className="h-20 w-20 object-contain" />
          <h1 className="font-black text-2xl text-100 tracking-tight">OFPPT Hub</h1>
          <p className="text-accent text-sm italic font-serif">La voie de l'avenir</p>
        </div>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full max-w-md"
        >
          {/* Form card */}
          <div className="glass-lg rounded-3xl p-8 sm:p-10">

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <div className="diamond diamond-sm" style={{ background: '#2E8B57' }} />
                <div className="diamond diamond-sm" style={{ background: '#8C9BA8' }} />
                <div className="diamond diamond-sm" style={{ background: '#2660A4' }} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-100 mt-4 mb-1">Connexion</h2>
              <p className="text-400 text-sm">Accédez à votre espace pédagogique</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-400">
                  Email professionnel
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-secondary transition-colors" />
                  <input
                    type="email"
                    {...register('email', { required: "L'email est requis" })}
                    className={`w-full border rounded-xl py-3 pl-11 pr-4 text-sm transition-all duration-200
                      ${errors.email
                        ? 'border-red-400 ring-2 ring-red-400/20'
                        : 'border-border focus:ring-2 focus:ring-secondary/25 focus:border-secondary'
                      }`}
                    placeholder="nom.prenom@ofppt.ma"
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-xs text-red-500 font-medium ml-1">
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-400">
                  Mot de passe
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-secondary transition-colors" />
                  <input
                    type="password"
                    {...register('password', { required: 'Le mot de passe est requis' })}
                    className={`w-full border rounded-xl py-3 pl-11 pr-4 text-sm transition-all duration-200
                      ${errors.password
                        ? 'border-red-400 ring-2 ring-red-400/20'
                        : 'border-border focus:ring-2 focus:ring-secondary/25 focus:border-secondary'
                      }`}
                    placeholder="••••••••"
                  />
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-xs text-red-500 font-medium ml-1">
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-xl text-base mt-2 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Se connecter
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer note */}
            <div className="mt-6 pt-6 border-t border-border flex items-center gap-2">
              <div className="flex gap-1">
                <div className="diamond diamond-sm" style={{ background: '#2E8B57', opacity: 0.5 }} />
                <div className="diamond diamond-sm" style={{ background: '#8C9BA8', opacity: 0.5 }} />
                <div className="diamond diamond-sm" style={{ background: '#2660A4', opacity: 0.5 }} />
              </div>
              <p className="text-xs text-500 ml-1">
                Accès réservé au personnel et stagiaires OFPPT
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
