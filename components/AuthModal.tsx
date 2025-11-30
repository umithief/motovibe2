
import React, { useState } from 'react';
import { X, User, Mail, Lock, ArrowRight, AlertCircle, Check, Eye, EyeOff, Chrome, Github } from 'lucide-react';
import { Button } from './Button';
import { AuthMode, User as UserType } from '../types';
import { authService } from '../services/auth';
import { delay } from '../services/db';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: AuthMode;
  onLogin: (user: UserType, isRegister: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode, onLogin }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode); // 'login' or 'register'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      let user: UserType;
      const isRegister = mode === 'register';

      if (isRegister) {
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error('Lütfen tüm alanları doldurun.');
        }
        user = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      } else {
        if (!formData.email || !formData.password) {
          throw new Error('Lütfen e-posta ve şifrenizi girin.');
        }
        user = await authService.login(formData.email, formData.password, rememberMe);
      }

      setSuccessMsg(isRegister ? 'Kayıt başarılı! Yönlendiriliyorsunuz...' : 'Giriş başarılı!');
      await delay(1000);

      onLogin(user, isRegister);
      setFormData({ name: '', email: '', password: '' });
      setRememberMe(false);
      
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div 
            className="fixed inset-0 transition-opacity cursor-pointer" 
            onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
        </div>

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
        
        {/* Modal Panel */}
        <div className="relative inline-block align-bottom bg-white dark:bg-surface rounded-[2rem] text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full animate-in fade-in zoom-in-95 duration-300 border border-gray-100 dark:border-white/10">
          
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-5 right-5 z-20 p-2 bg-gray-100 dark:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="px-8 py-10">
            {/* Header Area */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
                    {mode === 'login' ? 'Tekrar Hoş Geldin!' : 'Aramıza Katıl'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {mode === 'login' ? 'Hesabına giriş yaparak devam et.' : 'Yeni sürüş deneyimine başlamak için üye ol.'}
                </p>
            </div>

            {/* Custom Tab Switcher */}
            <div className="relative bg-gray-100 dark:bg-background p-1 rounded-xl flex mb-8 border border-transparent dark:border-white/5">
                <div 
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-moto-accent rounded-lg shadow-sm transition-all duration-300 ease-in-out ${mode === 'login' ? 'left-1' : 'left-[calc(50%+2px)]'}`}
                ></div>
                <button 
                    onClick={() => setMode('login')}
                    className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors duration-300 ${mode === 'login' ? 'text-gray-900 dark:text-surface' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'}`}
                >
                    Giriş Yap
                </button>
                <button 
                    onClick={() => setMode('register')}
                    className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors duration-300 ${mode === 'register' ? 'text-gray-900 dark:text-surface' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'}`}
                >
                    Üye Ol
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {mode === 'register' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400 group-focus-within:text-moto-accent transition-colors" />
                            </div>
                            <input
                                name="name"
                                type="text"
                                required={mode === 'register'}
                                className="block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-background border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-moto-accent focus:ring-1 focus:ring-moto-accent transition-all font-medium"
                                placeholder="Ad Soyad"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-moto-accent transition-colors" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-background border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-moto-accent focus:ring-1 focus:ring-moto-accent transition-all font-medium"
                  placeholder="E-posta Adresi"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-moto-accent transition-colors" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-background border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-moto-accent focus:ring-1 focus:ring-moto-accent transition-all font-medium"
                  placeholder="Şifre"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-moto-accent border-moto-accent' : 'border-gray-300 dark:border-white/20 bg-white dark:bg-transparent'}`}>
                          {rememberMe && <Check className="w-3.5 h-3.5 text-surface" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                      <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Beni Hatırla</span>
                  </label>
                  
                  {mode === 'login' && (
                      <button type="button" className="text-moto-accent hover:text-moto-accent-hover font-bold transition-colors">
                          Şifremi Unuttum?
                      </button>
                  )}
              </div>

              {/* Error & Success Messages */}
              <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-xl text-sm flex items-center gap-2 font-medium"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}
                {successMsg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm flex items-center gap-2 font-medium"
                    >
                        <Check className="w-5 h-5 flex-shrink-0" />
                        {successMsg}
                    </motion.div>
                )}
              </AnimatePresence>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full py-4 text-lg rounded-xl shadow-lg shadow-moto-accent/20" 
                isLoading={isLoading}
              >
                {mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
              </Button>
            </form>

            {/* Social Login Divider */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-surface text-gray-500">veya şununla devam et</span>
                </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors group">
                    <Chrome className="w-5 h-5 text-gray-600 dark:text-white group-hover:text-moto-accent transition-colors" />
                    <span className="text-sm font-bold text-gray-700 dark:text-white">Google</span>
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors group">
                    <Github className="w-5 h-5 text-gray-600 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors" />
                    <span className="text-sm font-bold text-gray-700 dark:text-white">Apple</span>
                </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
