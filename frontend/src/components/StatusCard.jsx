import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';

function UptimeBar({ lastSeen, threshold }) {
  const { elapsed } = useCountdown(lastSeen);
  const pct = Math.min((elapsed / threshold) * 100, 100);
  const color = pct > 75 ? '#ff3355' : pct > 50 ? '#ffaa00' : '#00ff88';
  return (
    <div className="mt-5">
      <div className="flex justify-between text-xs text-sentinel-muted mb-1.5 font-mono-sentinel">
        <span>SILENCE THRESHOLD</span>
        <span style={{ color }}>{Math.round(pct)}% of {threshold}s</span>
      </div>
      <div className="h-1.5 rounded-full bg-sentinel-border overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}88` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

export default function StatusCard({ status, onRefetch }) {
  const isOnline = status?.status === 'online';
  const { formatted: lastSeenAgo } = useCountdown(status?.lastSeen);
  const { formatted: offlineSinceAgo } = useCountdown(status?.offlineSince);

  return (
    <motion.div
      layout
      className="glass rounded-2xl p-6 mesh-card border border-sentinel-border/50 relative overflow-hidden scan-container"
    >
      <div className="scan-line" />

      {/* Background glow */}
      <motion.div
        animate={{ opacity: isOnline ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-sentinel-online/3 pointer-events-none"
      />
      <motion.div
        animate={{ opacity: isOnline ? 0 : 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-sentinel-offline/3 pointer-events-none"
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-sentinel-muted uppercase tracking-widest font-mono-sentinel mb-1">System Status</p>
          <AnimatePresence mode="wait">
            <motion.h2
              key={status?.status}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className={`text-4xl font-bold tracking-tight ${isOnline ? 'glow-green' : 'glow-red'}`}
            >
              {status?.status?.toUpperCase() ?? 'LOADING'}
            </motion.h2>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefetch}
            className="p-2 rounded-xl border border-sentinel-border hover:border-sentinel-accent/40 text-sentinel-muted hover:text-sentinel-accent transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="relative flex items-center justify-center w-12 h-12">
            <div className={isOnline ? 'dot-online' : 'dot-offline'} style={{ width: 20, height: 20 }} />
            <div
              className="absolute inset-0 rounded-full opacity-20"
              style={{ background: isOnline ? '#00ff88' : '#ff3355', filter: 'blur(8px)' }}
            />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-sentinel-bg/50 rounded-xl p-3 border border-sentinel-border/40">
          <p className="text-xs text-sentinel-muted font-mono-sentinel mb-1">
            {isOnline ? 'LAST HEARTBEAT' : 'OFFLINE SINCE'}
          </p>
          <p className={`text-sm font-semibold ${isOnline ? 'text-sentinel-online' : 'text-sentinel-offline'}`}>
            {isOnline ? lastSeenAgo : offlineSinceAgo}
          </p>
        </div>

        <div className="bg-sentinel-bg/50 rounded-xl p-3 border border-sentinel-border/40">
          <p className="text-xs text-sentinel-muted font-mono-sentinel mb-1">THRESHOLD</p>
          <p className="text-sm font-semibold text-sentinel-text">{status?.threshold ?? 180}s</p>
        </div>
      </div>

      {isOnline && status?.lastSeen && (
        <UptimeBar lastSeen={status.lastSeen} threshold={status.threshold ?? 180} />
      )}

      {/* Icon */}
      <div className="absolute bottom-5 right-5 opacity-5">
        {isOnline
          ? <Wifi className="w-24 h-24 text-sentinel-online" />
          : <WifiOff className="w-24 h-24 text-sentinel-offline" />
        }
      </div>
    </motion.div>
  );
}
