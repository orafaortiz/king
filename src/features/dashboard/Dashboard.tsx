import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Crown, Sparkles, BarChart2 } from 'lucide-react';
import { getKingsVoiceMessage, type Quote } from '@/lib/ai/kingsVoice';

export function Dashboard() {
  const [decree, setDecree] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return localStorage.getItem(`decree-${today}`) || '';
  });

  const [isEditingDecree, setIsEditingDecree] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`decree-${today}`);
    return !saved;
  });

  const [message, setMessage] = useState<Quote | null>(null);

  useEffect(() => {
    getKingsVoiceMessage().then(setMessage);
  }, []);

  const saveDecree = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`decree-${today}`, decree);
    setIsEditingDecree(false);
  };

  const today = new Date().toISOString().split('T')[0];
  
  const dailyLogs = useLiveQuery(
    () => db.dailyLogs.where('date').equals(today).toArray()
  );

  const calculateProgress = () => {
    if (!dailyLogs) return 0;
    // Simple heuristic: 
    // Spiritual: 3 items
    // Physical: > 0 logs
    // Work: > 0 logs
    // Night: 1 log
    
    let score = 0;
    const spiritual = dailyLogs.filter(l => l.type === 'spiritual').length;
    const physical = dailyLogs.filter(l => l.type === 'physical').length;
    const work = dailyLogs.filter(l => l.type === 'work').length; // Need to log work blocks to DB too!
    const journal = dailyLogs.filter(l => l.type === 'journal').length;

    if (spiritual >= 3) score += 30;
    else score += spiritual * 10;
    
    if (physical > 0) score += 30;
    if (work > 0) score += 20;
    if (journal > 0) score += 20;

    return Math.min(100, score);
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-8 pb-24">
      <header className="space-y-2">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-heading font-bold text-primary flex items-center gap-2">
                <Crown size={28} /> Ritual do REI
            </h1>
            <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-xs font-mono">{today}</span>
                <Link 
                  to="/stats"
                  className="p-2 bg-surface border border-white/10 rounded-full text-zinc-400 hover:text-primary transition-colors"
                >
                  <BarChart2 size={20} />
                </Link>
            </div>
        </div>
        <p className="text-zinc-400 text-sm">"Jeová lidera. Você obedece."</p>
      </header>
      
      {/* Decree Section */}
      <section>
        <GlassCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles size={100} />
            </div>
            
            <h2 className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Decreto do Dia</h2>
            
            {isEditingDecree ? (
                <div className="flex flex-col gap-2">
                    <textarea 
                        autoFocus
                        value={decree}
                        onChange={(e) => setDecree(e.target.value)}
                        placeholder="Defina sua intenção: 1 Espiritual, 1 Produto, 1 Coragem..."
                        className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none h-24"
                    />
                    <button onClick={saveDecree} className="self-end bg-primary text-black px-4 py-2 rounded-lg text-sm font-bold">
                        Selar Decreto
                    </button>
                </div>
            ) : (
                <div onClick={() => setIsEditingDecree(true)} className="cursor-pointer">
                    <p className="text-xl font-heading font-medium text-white italic">"{decree || 'Toque para definir...'}"</p>
                </div>
            )}
        </GlassCard>
      </section>

      {/* Overview & Stats */}
      <section className="grid grid-cols-2 gap-4">
        <GlassCard className="col-span-2 flex items-center justify-between">
            <div>
                <h2 className="text-lg font-heading text-white">Progresso Real</h2>
                <div className="h-2 w-32 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
            </div>
            <span className="text-4xl font-heading font-bold text-primary">{progress}%</span>
        </GlassCard>
      </section>

      {/* AI Agent Placeholder */}
      <section>
        <GlassCard className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/20">
            <h2 className="text-sm font-heading text-indigo-400 mb-2 flex items-center gap-2">
                <Sparkles size={14} /> A Voz da Sabedoria
            </h2>
            <div className="text-zinc-300 italic text-sm">
                "{message?.text || "Buscando sabedoria..."}"
                {message?.source && <span className="block text-right text-xs text-zinc-500 mt-2 not-italic">— {message.source}</span>}
            </div>
        </GlassCard>
      </section>
    </div>
  );
}
