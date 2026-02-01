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
        <GlassCard className="relative overflow-hidden group border-primary/20 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40">
            <div className="absolute -top-10 -right-10 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-primary">
                <Sparkles size={180} />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-primary font-heading text-sm uppercase tracking-widest mb-1 shadow-primary/20 drop-shadow-sm flex items-center gap-2">
                <Crown size={14} /> Decreto do Dia
              </h2>
              
              <p className="text-zinc-400 text-xs mb-4 max-w-md leading-relaxed">
                Declare sua intenção única para hoje. Defina uma meta clara (Espiritual, Produto ou Coragem) que guiará suas ações. "A palavra do Rei não volta vazia."
              </p>
              
              {isEditingDecree ? (
                  <div className="flex flex-col gap-3">
                      <div className="relative">
                        <textarea 
                            autoFocus
                            value={decree}
                            onChange={(e) => setDecree(e.target.value)}
                            placeholder="Escreva seu decreto aqui..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-lg text-white font-medium placeholder:text-zinc-600 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none min-h-[120px] resize-none transition-all"
                        />
                        <div className="absolute bottom-3 right-3">
                          <span className={`${decree.length > 0 ? 'text-primary' : 'text-zinc-700'} text-xs transition-colors`}>
                            {decree.length} chars
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={saveDecree} 
                        className="self-end bg-primary hover:bg-primary/90 text-black px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all transform active:scale-95 shadow-lg shadow-primary/20"
                      >
                          Selar Decreto
                      </button>
                  </div>
              ) : (
                  <div onClick={() => setIsEditingDecree(true)} className="cursor-pointer group/text relative p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors">
                      <p className="text-2xl font-heading font-medium text-white italic leading-relaxed">
                        "{decree || 'Toque para definir o comando do seu dia...'}"
                      </p>
                      <span className="text-xs text-zinc-500 mt-2 block opacity-0 group-hover/text:opacity-100 transition-opacity">
                        Toque para editar
                      </span>
                  </div>
              )}
            </div>
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
