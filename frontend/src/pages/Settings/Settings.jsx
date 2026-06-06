import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Bell, 
  Lock, 
  Eye, 
  EyeOff, 
  Globe, 
  Layout, 
  Trash2, 
  LogOut, 
  Moon, 
  Sun,
  Shield,
  Palette,
  Settings as SettingsIcon,
  ChevronRight,
  Camera,
  Mail,
  Smartphone,
  Save,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import CustomSelect from '../../components/ui/CustomSelect';
import { useFilieres } from '../../hooks/useQueries';

const Toggle = ({ enabled, onChange }) => (
  <button 
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${enabled ? 'bg-primary' : 'bg-overlay-hover border border-border'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const MotionDiv = motion.div;

const Settings = () => {
  const { user, logout, updateProfile, updatePassword } = useAuth();
  const { theme, syncTheme, setSyncTheme, setThemeMode } = useTheme();
  const { notify } = useNotification();
  const { data: filieres } = useFilieres();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const photoInputRef = useRef(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    filiere_id: '',
    groupe: '',
    annee_formation: '1',
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [systemPrefs, setSystemPrefs] = useState(() => {
    const saved = localStorage.getItem('systemPrefs');
    return saved ? JSON.parse(saved) : {
      language: 'fr',
      density: 'comfortable',
      ultraLight: false,
    };
  });

  const [notifs, setNotifs] = useState({
    system: true,
    email: false,
    mobile: true
  });

  const menuItems = [
    { id: 'profile', name: 'Profil', icon: User, color: 'text-blue-400' },
    { id: 'appearance', name: 'Apparence', icon: Palette, color: 'text-violet-400' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: 'text-amber-400' },
    { id: 'security', name: 'Sécurité', icon: Lock, color: 'text-emerald-400' },
    { id: 'system', name: 'Système', icon: Layout, color: 'text-rose-400' },
    { id: 'danger', name: 'Zone de danger', icon: Trash2, color: 'text-red-400' },
  ];

  useEffect(() => {
    // Keep editable settings fields in sync after login/profile refresh.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      filiere_id: user?.stagiaire?.filiere_id || '',
      groupe: user?.stagiaire?.groupe || '',
      annee_formation: String(user?.stagiaire?.annee_formation || '1'),
    });
  }, [user]);

  const formatErrors = (result) => (
    result.errors ? Object.values(result.errors).flat().join(', ') : result.message
  );

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const payload = photoFile ? new FormData() : profileForm;

    if (photoFile) {
      Object.entries(profileForm).forEach(([key, value]) => {
        payload.append(key, value ?? '');
      });
      payload.append('avatar', photoFile);
    }

    const result = await updateProfile(payload);
    setSavingProfile(false);

    if (result.success) {
      setPhotoFile(null);
      setPhotoPreview(null);
      notify('success', 'Profil enregistré', 'Vos informations ont été mises à jour.');
    } else {
      notify('error', 'Erreur', formatErrors(result));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.password !== passwordForm.password_confirmation) {
      notify('error', 'Erreur', 'Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    setSavingPassword(true);
    const result = await updatePassword(passwordForm);
    setSavingPassword(false);

    if (result.success) {
      notify('success', 'Mot de passe mis à jour', result.message);
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
    } else {
      notify('error', 'Erreur', formatErrors(result));
    }
  };

  const updateSystemPref = (key, value) => {
    const nextPrefs = { ...systemPrefs, [key]: value };
    setSystemPrefs(nextPrefs);
    localStorage.setItem('systemPrefs', JSON.stringify(nextPrefs));
    notify('success', 'Préférence enregistrée', 'Le paramètre système a été mis à jour.');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#2E8B57', borderRadius:1 }} />
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#8C9BA8', borderRadius:1 }} />
            <div style={{ width:8, height:8, transform:'rotate(45deg)', background:'#2660A4', borderRadius:1 }} />
            <span className="text-[10px] font-black uppercase tracking-widest text-500 ml-1">Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-100">Paramètres</h1>
          <p className="text-400 text-sm mt-0.5">Gérez votre profil et les préférences de votre compte</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'glass bg-primary/10 border-primary/20 text-primary' 
                  : 'text-500 hover:bg-overlay-hover hover:text-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={activeTab === item.id ? 'text-primary' : item.color} />
                <span className="font-bold text-sm">{item.name}</span>
              </div>
              {activeTab === item.id && <MotionDiv layoutId="active-indicator"><ChevronRight size={16} /></MotionDiv>}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <MotionDiv
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="glass rounded-2xl p-8 md:p-10 border border-border"
            >
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-8 pb-8 border-b border-border">
                    <div className="relative group">
                      <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary to-secondary p-[2px] shadow-2xl glow-primary">
                        <div className="h-full w-full rounded-[22px] bg-background flex items-center justify-center overflow-hidden">
                          {photoPreview || user?.avatar || user?.photo ? (
                            <img src={photoPreview || user?.avatar || user?.photo} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <User size={40} className="text-400" />
                          )}
                        </div>
                      </div>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handlePhotoChange}
                      />
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 p-2.5 bg-primary text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
                      >
                        <Camera size={16} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-100">{user?.name}</h3>
                      <p className="text-primary font-black uppercase tracking-widest text-[10px] mt-1">{user?.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-500 uppercase tracking-widest ml-1">Nom Complet</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text" 
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-500 uppercase tracking-widest ml-1">Adresse Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
                        <input 
                          type="email" 
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {user?.role === 'stagiaire' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-500 uppercase tracking-widest ml-1">Filière</label>
                        <CustomSelect
                          options={[
                            { value: '', label: 'Sélectionner une filière' },
                            ...(filieres?.map((f) => ({ value: f.id, label: `${f.code} - ${f.libelle}` })) || [])
                          ]}
                          value={profileForm.filiere_id}
                          onChange={(value) => setProfileForm({ ...profileForm, filiere_id: value ?? '' })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-500 uppercase tracking-widest ml-1">Groupe</label>
                        <input
                          type="text"
                          value={profileForm.groupe}
                          onChange={(e) => setProfileForm({ ...profileForm, groupe: e.target.value.toUpperCase() })}
                          placeholder="Ex: DEV201"
                          className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-500 uppercase tracking-widest ml-1">Année</label>
                        <CustomSelect
                          options={[
                            { value: '1', label: '1ère année' },
                            { value: '2', label: '2ème année' },
                          ]}
                          value={profileForm.annee_formation}
                          onChange={(value) => setProfileForm({ ...profileForm, annee_formation: value ?? '1' })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="btn-primary"
                    >
                      <Save size={20} /> {savingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={`p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${theme === 'dark' && !syncTheme ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`} onClick={() => setThemeMode('dark')}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-4 rounded-2xl bg-zinc-900 text-amber-400">
                          <Moon size={24} />
                        </div>
                        {theme === 'dark' && !syncTheme && <div className="p-1 bg-primary text-white rounded-full"><ChevronRight size={16} /></div>}
                      </div>
                      <h4 className="text-lg font-black text-100 mb-2">Mode Sombre</h4>
                      <p className="text-sm text-500 font-medium">Réduit la fatigue oculaire et économise de l'énergie.</p>
                    </div>

                    <div className={`p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${theme === 'light' && !syncTheme ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`} onClick={() => setThemeMode('light')}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-4 rounded-2xl bg-zinc-100 text-amber-600">
                          <Sun size={24} />
                        </div>
                        {theme === 'light' && !syncTheme && <div className="p-1 bg-primary text-white rounded-full"><ChevronRight size={16} /></div>}
                      </div>
                      <h4 className="text-lg font-black text-100 mb-2">Mode Clair</h4>
                      <p className="text-sm text-500 font-medium">Idéal pour les environnements lumineux.</p>
                    </div>
                  </div>

                  <div className="p-8 rounded-2xl bg-overlay border border-border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-violet-500/10 text-violet-400 rounded-2xl">
                        <SettingsIcon size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-100">Synchroniser avec le système</h4>
                        <p className="text-xs text-500 font-medium mt-0.5">Adapter automatiquement au thème de votre ordinateur.</p>
                      </div>
                    </div>
                    <Toggle enabled={syncTheme} onChange={() => setSyncTheme(!syncTheme)} />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  {[
                    { id: 'system', name: 'Notifications Système', desc: 'Alertes importantes concernant votre compte.', icon: Smartphone },
                    { id: 'email', name: 'Rapports par Email', desc: 'Recevez des résumés hebdomadaires de votre activité.', icon: Mail },
                    { id: 'security', name: 'Alertes de Sécurité', desc: 'Notifications en cas de connexion suspecte.', icon: Shield },
                  ].map((item) => (
                    <div key={item.id} className="p-6 rounded-[2rem] bg-overlay border border-border flex items-center justify-between group hover:bg-overlay-hover transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl group-hover:scale-110 transition-transform">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-100">{item.name}</h4>
                          <p className="text-xs text-500 font-medium mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <Toggle 
                        enabled={notifs[item.id]} 
                        onChange={() => setNotifs({...notifs, [item.id]: !notifs[item.id]})} 
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div className="p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4 mb-2">
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                      <Shield size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-400">Sécurité du compte</h4>
                      <p className="text-xs text-emerald-400/60 font-medium">Votre mot de passe a été modifié pour la dernière fois il y a 3 mois.</p>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-500 uppercase tracking-widest ml-1">Mot de passe actuel</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-500 group-focus-within:text-primary transition-colors" />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={passwordForm.current_password}
                          onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                          className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-12 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          placeholder="••••••••"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-500 hover:text-100 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-500 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                        <input 
                          type="password" 
                          value={passwordForm.password}
                          onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                          className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-500 uppercase tracking-widest ml-1">Confirmer le nouveau</label>
                        <input 
                          type="password" 
                          value={passwordForm.password_confirmation}
                          onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                          className="w-full bg-input border border-border rounded-xl py-3 px-4 text-sm text-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={savingPassword}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-1 flex items-center gap-2 disabled:opacity-60"
                      >
                        <Lock size={18} /> {savingPassword ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                      </button>
                    </div>
                  </form>

                </div>
              )}

              {activeTab === 'system' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Globe size={12} /> Langue du dashboard
                      </label>
                      <CustomSelect
                        options={[
                          { value: 'fr', label: 'Français (Standard)' },
                          { value: 'en', label: 'English (US)' },
                          { value: 'ar', label: 'العربية (Maroc)' }
                        ]}
                        value={systemPrefs.language}
                        onChange={(value) => updateSystemPref('language', value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Layout size={12} /> Densité des tableaux
                      </label>
                      <CustomSelect
                        options={[
                          { value: 'comfortable', label: 'Confortable' },
                          { value: 'compact', label: 'Compact' },
                          { value: 'spacious', label: 'Spacieux' }
                        ]}
                        value={systemPrefs.density}
                        onChange={(value) => updateSystemPref('density', value)}
                      />
                    </div>
                  </div>

                  <div className="p-8 rounded-2xl bg-overlay border border-border">
                    <h4 className="font-bold text-100 mb-4">Fonctionnalités Bêta</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-200">Mode Ultra-Léger</p>
                          <p className="text-xs text-500">Désactive les animations pour plus de performance.</p>
                        </div>
                        <Toggle
                          enabled={systemPrefs.ultraLight}
                          onChange={() => updateSystemPref('ultraLight', !systemPrefs.ultraLight)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'danger' && (
                <div className="space-y-8">
                  <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center gap-6">
                    <div className="p-4 bg-red-500/20 text-red-500 rounded-3xl">
                      <Trash2 size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-red-500">Actions Critiques</h4>
                      <p className="text-sm text-red-500/60 font-medium">Attention, ces actions peuvent être irréversibles.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button className="w-full p-6 rounded-[2rem] bg-overlay border border-border hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-4 text-left">
                        <div className="p-3 bg-border rounded-xl group-hover:bg-red-500/20 group-hover:text-red-500 transition-colors">
                          <RotateCcw size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-100 group-hover:text-red-500 transition-colors">Réinitialiser les préférences</h4>
                          <p className="text-xs text-500 font-medium mt-0.5">Remettre tous les paramètres par défaut.</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-500" />
                    </button>

                    <button 
                      onClick={logout}
                      className="w-full p-6 rounded-[2rem] bg-overlay border border-border hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className="p-3 bg-border rounded-xl group-hover:bg-red-500/20 group-hover:text-red-500 transition-colors">
                          <LogOut size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-100 group-hover:text-red-500 transition-colors">Se déconnecter</h4>
                          <p className="text-xs text-500 font-medium mt-0.5">Mettre fin à votre session actuelle.</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-500" />
                    </button>
                  </div>
                </div>
              )}
            </MotionDiv>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Settings;
