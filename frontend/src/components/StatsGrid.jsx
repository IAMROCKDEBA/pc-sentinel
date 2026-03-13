import { motion } from 'framer-motion';
import { Clock, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import { format, parseISO } from 'date-fns';

function StatCard({ icon: Icon, label, value, sub, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.4 }}
      className="glass rounded-2xl p-4 border border-sentinel-border/50 glass-hover mesh-card"
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-xs text-sentinel-muted uppercase tracking-widest font-mono-sentinel">{label}</span>
      </div>
      <p className="text-xl font-bold text-white leading-tight">{value}</p>
      {sub && <p className="text-xs text-sentinel-muted mt-1">{sub}</p>}
    </motion.div>
  );
}

export default function StatsGrid({ status }) {
  const { formatted: uptime } = useCountdown(status?.uptimeSince);
  const onlineCount = status?.alertLog?.filter(l => l.type === 'online').length ?? 0;
  const offlineCount = status?.alertLog?.filter(l => l.type === 'offline').length ?? 0;

  const serverTime = status?.serverTime
    ? format(parseISO(status.serverTime), 'HH:mm:ss')
    : '—';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard index={0} icon={Clock} label="Current Uptime" color="#00ff88"
        value={status?.status === 'online' ? uptime : '—'}
        sub="Since last reconnect"
      />
      <StatCard index={1} icon={Zap} label="Server Time" color="#4d9fff"
        value={serverTime}
        sub="UTC server clock"
      />
      <StatCard index={2} icon={CheckCircle} label="Online Events" color="#00ff88"
        value={onlineCount}
        sub="Total reconnects"
      />
      <StatCard index={3} icon={AlertTriangle} label="Offline Events" color="#ff3355"
        value={offlineCount}
        sub="Total dropouts"
      />
    </div>
  );
}
