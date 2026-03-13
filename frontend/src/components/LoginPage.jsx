import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, error, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="min-h-screen mesh-bg grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sentinel-online/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sentinel-accent/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="relative mb-4 animate-float">
            <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center border border-sentinel-online/30">
              <Shield className="w-8 h-8 text-sentinel-online" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-sentinel-online/10 blur-xl" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">PC Sentinel</h1>
          <p className="text-sentinel-muted text-sm mt-1 font-mono-sentinel">MONITORING SYSTEM v1.0</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8 mesh-card border border-sentinel-border/50"
        >
          <div className="scan-container mb-6">
            <div className="scan-line" />
          </div>

          <h2 className="text-lg font-semibold text-white mb-1">Secure Access</h2>
          <p className="text-sentinel-muted text-sm mb-7">Enter your credentials to access the dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-sentinel-muted uppercase tracking-widest">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sentinel-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="admin"
                  className="w-full bg-sentinel-bg/60 border border-sentinel-border rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-sentinel-muted/50 focus:outline-none focus:border-sentinel-accent/60 focus:ring-1 focus:ring-sentinel-accent/30 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-sentinel-muted uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sentinel-muted" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-sentinel-bg/60 border border-sentinel-border rounded-xl py-3 pl-10 pr-10 text-white placeholder:text-sentinel-muted/50 focus:outline-none focus:border-sentinel-accent/60 focus:ring-1 focus:ring-sentinel-accent/30 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sentinel-muted hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-lg border border-sentinel-offline/30 bg-sentinel-offline/10 px-4 py-3 text-sentinel-offline text-sm"
              >
                ⚠ {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 py-3 rounded-xl font-semibold text-sm transition-all relative overflow-hidden
                bg-gradient-to-r from-sentinel-accent/80 to-sentinel-online/80
                hover:from-sentinel-accent hover:to-sentinel-online
                text-white disabled:opacity-50 disabled:cursor-not-allowed
                border border-sentinel-accent/30"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </span>
              ) : (
                'Access Dashboard'
              )}
            </motion.button>
          </form>
        </motion.div>

        <p className="text-center text-sentinel-muted/50 text-xs mt-6 font-mono-sentinel">
          PRIVATE ACCESS · ALL ACTIVITY LOGGED
        </p>
      </motion.div>
    </div>
  );
}
