import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Wifi, WifiOff, Server } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const icons = {
  online:  { Icon: Wifi,     color: 'text-sentinel-online',  bg: 'bg-sentinel-online/10',  border: 'border-sentinel-online/20'  },
  offline: { Icon: WifiOff,  color: 'text-sentinel-offline', bg: 'bg-sentinel-offline/10', border: 'border-sentinel-offline/20' },
  system:  { Icon: Server,   color: 'text-sentinel-accent',  bg: 'bg-sentinel-accent/10',  border: 'border-sentinel-accent/20'  },
};

function LogEntry({ entry, index }) {
  const meta = icons[entry.type] || icons.system;
  const { Icon, color, bg, border } = meta;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`flex items-start gap-3 p-3 rounded-xl border ${border} ${bg} glass-hover`}
    >
      <div className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${bg} border ${border}`}>
        <Icon className={`w-3.5 h-3.5 ${color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-sentinel-text leading-snug">{entry.message}</p>
        <p className="text-xs text-sentinel-muted font-mono-sentinel mt-1">
          {format(parseISO(entry.timestamp), 'dd MMM yyyy · HH:mm:ss')}
        </p>
      </div>

      <span className={`text-xs font-mono-sentinel ${color} flex-shrink-0 mt-0.5`}>
        {entry.type.toUpperCase()}
      </span>
    </motion.div>
  );
}

export default function ActivityLog({ logs }) {
  return (
    <div className="glass rounded-2xl p-6 border border-sentinel-border/50">
      <div className="flex items-center gap-2 mb-5">
        <Activity className="w-4 h-4 text-sentinel-accent" />
        <h3 className="font-semibold text-white">Activity Log</h3>
        <span className="ml-auto text-xs font-mono-sentinel text-sentinel-muted">
          {logs?.length ?? 0} events
        </span>
      </div>

      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        <AnimatePresence>
          {(!logs || logs.length === 0) ? (
            <div className="text-center py-12 text-sentinel-muted">
              <Server className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No events yet. Waiting for first heartbeat…</p>
            </div>
          ) : (
            logs.map((entry, i) => <LogEntry key={entry.id} entry={entry} index={i} />)
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
