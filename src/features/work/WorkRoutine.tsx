import { useState, useEffect } from 'react';
import { Timer } from '@/components/ui/Timer';
import { GlassCard } from '@/components/ui/GlassCard';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { db } from '@/lib/db';

// Using localStorage for Work/Demands to keep it simple as they are transient "todays"
// For a production app, we would put Demands in Dexie too.

export function WorkRoutine() {
  const [demands, setDemands] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newDemand, setNewDemand] = useState('');
  
  const [blockInput, setBlockInput] = useState('');
  const [currentBlock, setCurrentBlock] = useState('');
  const [blockDuration, setBlockDuration] = useState(60); // Default 60 min for main block

  // Load State
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Demands
    const savedDemands = localStorage.getItem(`demands-${today}`);
    if (savedDemands) setDemands(JSON.parse(savedDemands));

    // Active Block
    const savedBlock = localStorage.getItem('active-work-block');
    if (savedBlock && savedBlock !== "") {
        setCurrentBlock(savedBlock);
        // If restoring, assume 60 min for now or read extra state if we tracked it
    }
  }, []);

  // Save Demands on Change
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`demands-${today}`, JSON.stringify(demands));
  }, [demands]);

  // Save Block on Change
  useEffect(() => {
    localStorage.setItem('active-work-block', currentBlock);
  }, [currentBlock]);

  const addDemand = () => {
    if (!newDemand.trim()) return;
    setDemands(prev => [...prev, { id: Date.now(), text: newDemand, done: false }]);
    setNewDemand('');
  };

  const toggleDemand = (id: number) => {
    setDemands(prev => prev.map(d => d.id === id ? { ...d, done: !d.done } : d));
  };

  const startBlock = (duration: number = 60) => {
    if (blockInput.trim()) {
        setCurrentBlock(blockInput);
        setBlockDuration(duration);
        setBlockInput('');
    }
  };

  const handleFinish = async (name: string, minutes: number) => {
    const date = new Date().toISOString().split('T')[0];
    await db.dailyLogs.add({
       date,
       type: 'work',
       subtype: 'deep_work',
       value: name, 
       completed: true,
       timestamp: Date.now(),
       // We can store duration in metadata if we extend Schema, 
       // or just implies value is duration if subtype was timer. 
       // For now, let's keep value as Name and log it.
    });
    // Log explicit duration entry if needed or just trust the completion.
    // Let's add a separate log for metrics if we want stats to sum time.
    await db.dailyLogs.add({
        date,
        type: 'work',
        subtype: 'work_duration',
        value: minutes.toString(),
        completed: true,
        timestamp: Date.now()
     });

    alert(`Bloco "${name}" salvo (${minutes} min).`);
    setCurrentBlock('');
  };

  return (
    <div className="space-y-6 pb-24">
      <header>
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Construção do Reino</h1>
        <p className="text-zinc-400 text-sm italic">"Só trabalho que cria ativo."</p>
      </header>

      {/* Deep Work Block */}
      <section>
        <h2 className="text-lg font-heading text-white mb-3 flex items-center gap-2">
          <Briefcase size={18} className="text-primary" /> 
          Bloco de Foco
        </h2>
        <GlassCard>
            {!currentBlock ? (
                <div className="flex flex-col gap-3">
                    <input 
                        className="flex-1 bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary text-white"
                        placeholder="Qual o objetivo agora?"
                        value={blockInput}
                        onChange={(e) => setBlockInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && startBlock()}
                    />
                    <div className="flex gap-2">
                        <button 
                            onClick={() => startBlock(60)}
                            disabled={!blockInput.trim()}
                            className="flex-1 bg-primary text-black p-2 rounded-lg disabled:opacity-50 font-medium text-sm"
                        >
                            Iniciar Bloco (60m)
                        </button>
                        <button 
                            onClick={() => startBlock(30)}
                            disabled={!blockInput.trim()}
                            className="flex-1 bg-zinc-800 text-zinc-300 p-2 rounded-lg disabled:opacity-50 text-sm hover:text-white"
                        >
                            Livre (30m)
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Focando em</p>
                    <p className="text-xl font-heading font-bold text-white mb-4 text-primary">{currentBlock}</p>
                    
                    <Timer 
                        initialMinutes={blockDuration} 
                        allowManualFinish
                        onComplete={() => handleFinish(currentBlock, blockDuration)}
                        onManualFinish={(elapsed) => handleFinish(currentBlock, Math.ceil(elapsed / 60))}
                        persistenceId="work-block-timer"
                    />
                    <button onClick={() => {
                        setCurrentBlock('');
                        localStorage.removeItem('timer-work-block-timer');
                    }} className="text-xs text-red-400 mt-4 hover:underline">Cancelar Bloco</button>
                </div>
            )}
        </GlassCard>
      </section>

      {/* Client Demands */}
      <section>
        <h2 className="text-lg font-heading text-white mb-3">Demandas de Clientes</h2>
        <GlassCard>
            <div className="flex gap-2 mb-4">
                <input 
                    value={newDemand}
                    onChange={(e) => setNewDemand(e.target.value)}
                    className="flex-1 bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary text-white"
                    placeholder="Nova demanda..."
                    onKeyDown={(e) => e.key === 'Enter' && addDemand()}
                />
                <button onClick={addDemand} className="bg-zinc-800 text-white p-2 rounded-lg">
                    <Plus size={20} />
                </button>
            </div>
            
            <div className="space-y-2">
                {demands.map(d => (
                    <div key={d.id} className="flex items-center justify-between bg-zinc-900/30 p-3 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                            <input 
                                type="checkbox" 
                                checked={d.done}
                                onChange={() => toggleDemand(d.id)}
                                className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 accent-primary"
                            />
                            <span className={d.done ? "line-through text-zinc-500" : "text-zinc-200"}>{d.text}</span>
                        </div>
                        <button onClick={() => setDemands(demands.filter(x => x.id !== d.id))} className="text-zinc-600 hover:text-red-400">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {demands.length === 0 && <p className="text-zinc-600 text-center text-sm py-2">Nenhuma demanda pendente.</p>}
            </div>
        </GlassCard>
      </section>
    </div>
  );
}
