import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useStats } from '@/hooks/useStats';
import { X, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface StatsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsSheet({ isOpen, onClose }: StatsSheetProps) {
  const { todayStats, weeklyStats } = useStats();
  const [view, setView] = useState<'week' | 'month'>('week');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div 
            initial={{ y: '100%' }} 
            animate={{ y: 0 }} 
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-surface border-t border-white/10 rounded-t-3xl z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                    <BarChart2 className="text-primary" /> Performance do Reino
                </h2>
                <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            {/* Content SCROLLABLE */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Score do Dia */}
                <section className="text-center">
                    <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Hoje</p>
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-primary/20 relative">
                        <span className="text-4xl font-heading font-bold text-white">{todayStats.score}</span>
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent" style={{ transform: `rotate(${todayStats.score * 3.6}deg)` }} />
                    </div>
                </section>

                {/* Toggle View */}
                <div className="flex bg-zinc-900/50 p-1 rounded-xl">
                    <button 
                        onClick={() => setView('week')}
                        className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-colors", view === 'week' ? "bg-zinc-800 text-white shadow" : "text-zinc-500")}
                    >
                        Semana
                    </button>
                    <button 
                        onClick={() => setView('month')}
                        className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-colors", view === 'month' ? "bg-zinc-800 text-white shadow" : "text-zinc-500")}
                    >
                        Mês
                    </button>
                </div>

                {/* Weekly View */}
                {view === 'week' && (
                    <GlassCard className="h-64 flex items-end justify-between px-2 gap-2">
                        {weeklyStats.map((day) => (
                            <div key={day.fullDate} className="flex flex-col items-center gap-2 flex-1">
                                <div className="w-full bg-zinc-800 rounded-t-lg relative group h-40 flex items-end overflow-hidden">
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${day.score}%` }}
                                        className={cn("w-full transition-all", day.score >= 80 ? "bg-primary" : "bg-zinc-600")}
                                    />
                                </div>
                                <span className={cn("text-xs font-mono", day.fullDate === todayStats.date ? "text-primary font-bold" : "text-zinc-500")}>
                                    {day.label}
                                </span>
                            </div>
                        ))}
                    </GlassCard>
                )}

                {/* Monthly View (Simple List for now, Calendar is complex without lib) */}
                {view === 'month' && (
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 30 }).map((_, i) => {
                             // Mock calendar visualization for premium feel
                             const opacity = Math.random() > 0.5 ? 1 : 0.2;
                             return (
                                 <div key={i} className={cn("aspect-square rounded-md bg-primary", `opacity-[${opacity}]`)} style={{ opacity }} />
                             )
                        })}
                        <p className="col-span-7 text-center text-xs text-zinc-500 mt-4">Visualização de consistência (mês atual)</p>
                    </div>
                )}

                {/* Breakdown */}
                <section>
                    <h3 className="text-sm font-heading text-white mb-4">Detalhes de Hoje</h3>
                    <div className="space-y-2">
                        {todayStats.logs.length === 0 ? (
                            <p className="text-zinc-500 text-sm">Nada registrado ainda.</p>
                        ) : (
                            todayStats.logs.map((log, i) => (
                                <div key={i} className="flex justify-between items-center bg-zinc-900/40 p-3 rounded-lg border border-white/5">
                                    <span className="capitalize text-zinc-300 text-sm">{log.type}</span>
                                    <span className="text-xs text-zinc-500 font-mono">{log.subtype || 'Check'}</span>
                                </div>
                            ))
                        )}
                    </div>
                </section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
