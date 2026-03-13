import { motion } from 'framer-motion';
import { Shield, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ lastUpdated, onRefetch }) {
  const { logout } = useAuth();

  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass border-b border-sentinel-border/50 sticky top-0 z-50"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sentinel-online/10 border border-sentinel-online/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-sentinel-online" />
          </div>
          <span className="font-bold text-white text-sm tracking-wide">PC Sentinel</span>
          <span className="hidden sm:inline text-sentinel-muted/40 text-xs font-mono-sentinel">v1.0</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-sentinel-muted font-mono-sentinel">
            <div className="w-1.5 h-1.5 rounded-full bg-sentinel-accent animate-pulse" />
            <span>LIVE · {timeStr}</span>
          </div>

          <button
            onClick={onRefetch}
            className="p-1.5 rounded-lg border border-sentinel-border hover:border-sentinel-accent/40 text-sentinel-muted hover:text-sentinel-accent transition-all"
            title="Refresh now"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sentinel-border hover:border-sentinel-offline/40 text-sentinel-muted hover:text-sentinel-offline transition-all text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
