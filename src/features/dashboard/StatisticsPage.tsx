import { GlassCard } from '@/components/ui/GlassCard';
import { useStats } from '@/hooks/useStats';
import { BarChart2 } from 'lucide-react';

export function StatisticsPage() {
  const { todayStats } = useStats();

  return (
    <div className="space-y-6 pb-24">
       <header className="flex items-center gap-3">
            <div className="bg-primary/20 p-3 rounded-full">
                <BarChart2 className="text-primary" size={24} />
            </div>
            <div>
                <h1 className="text-3xl font-heading font-bold text-white">Consistência</h1>
                <p className="text-zinc-400 text-sm italic">"Resultados vêm da frequência."</p>
            </div>
       </header>

       {/* Score do Dia - Big & Clean */}
       <section className="flex flex-col items-center justify-center py-8">
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Background Circle */}
                <div className="absolute inset-0 border-8 border-zinc-800 rounded-full" />
                {/* Progress (using Conic Gradient) */}
                <div 
                    className="absolute inset-0 rounded-full"
                    style={{ 
                        background: `conic-gradient(var(--color-primary) ${todayStats.score * 3.6}deg, transparent 0deg)`,
                        mask: 'radial-gradient(transparent 55%, black 60%)',
                        WebkitMask: 'radial-gradient(transparent 55%, black 60%)'
                    }}
                />
                
                <div className="flex flex-col items-center">
                    <span className="text-6xl font-heading font-bold text-white">{todayStats.score}</span>
                    <span className="text-zinc-500 text-xs uppercase tracking-widest mt-1">Pontos Hoje</span>
                </div>
            </div>
       </section>

        {/* Detailed Breakdown - Clean List */}
        <section>
            <h2 className="text-lg font-heading text-white mb-4">Registro do Dia</h2>
            <div className="space-y-3">
                {todayStats.logs.length === 0 ? (
                    <GlassCard className="text-center py-8">
                        <p className="text-zinc-500">O livro da vida está em branco hoje.</p>
                        <p className="text-zinc-600 text-sm mt-1">Comece seu ritual.</p>
                    </GlassCard>
                ) : (
                    todayStats.logs.map((log, i) => (
                        <GlassCard key={i} className="flex justify-between items-center py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <div>
                                    <span className="capitalize font-medium text-zinc-200 block leading-tight">
                                        {log.type === 'spiritual' ? 'Espírito' : 
                                         log.type === 'physical' ? 'Corpo' : 
                                         log.type === 'work' ? 'Reino' : 'Noite'}
                                    </span>
                                    {/* Show duration or value if it's numeric/time related */}
                                    {(!isNaN(Number(log.value)) || log.subtype?.includes('duration') || log.subtype?.includes('timer')) && (
                                        <span className="text-xs text-primary font-mono block">
                                            {log.value} {log.subtype?.includes('duration') || log.subtype?.includes('timer') ? 'min' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm text-zinc-400 font-mono block">
                                    {log.subtype && !log.subtype.includes('duration') && !log.subtype.includes('timer') 
                                        ? log.subtype.replace(/_/g, ' ') 
                                        : log.type === 'work' ? log.value : 'Sessão'}
                                </span>
                            </div>
                        </GlassCard>
                    ))
                )}
            </div>
        </section>
    </div>
  );
}
