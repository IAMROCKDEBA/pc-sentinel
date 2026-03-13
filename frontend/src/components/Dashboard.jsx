import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useStatus } from '../hooks/useStatus';
import Navbar from './Navbar';
import StatusCard from './StatusCard';
import StatsGrid from './StatsGrid';
import ActivityLog from './ActivityLog';

function Skeleton({ className }) {
  return (
    <div className={`rounded-2xl overflow-hidden relative ${className}`}>
      <div className="absolute inset-0 glass border border-sentinel-border/40" />
      <div className="absolute inset-0 shimmer" />
    </div>
  );
}

export default function Dashboard() {
  const { status, loading, error, lastUpdated, refetch } = useStatus();

  return (
    <div className="min-h-screen mesh-bg grid-bg flex flex-col">
      <Navbar lastUpdated={lastUpdated} onRefetch={refetch} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-4">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sentinel-muted text-sm mt-0.5">Real-time PC health monitoring</p>
        </motion.div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-sentinel-offline/30 bg-sentinel-offline/10 px-4 py-3 flex items-center gap-2 text-sentinel-offline text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error} — retrying automatically every 15s.
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-52" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
            </div>
            <Skeleton className="h-80" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <StatusCard status={status} onRefetch={refetch} />
            <StatsGrid status={status} />
            <ActivityLog logs={status?.alertLog} />
          </motion.div>
        )}

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sentinel-muted/30 text-xs font-mono-sentinel pb-4"
        >
          PC SENTINEL · POLLING EVERY 15s · ALL TIMES LOCAL
        </motion.p>
      </main>
    </div>
  );
}
