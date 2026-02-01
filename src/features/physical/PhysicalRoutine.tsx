import { useState, useEffect } from 'react';
import { Timer } from '@/components/ui/Timer';
import { GlassCard } from '@/components/ui/GlassCard';
import { Plus, Minus, Save, Check } from 'lucide-react';
import { db } from '@/lib/db';

export function PhysicalRoutine() {
  const [exercises, setExercises] = useState([
    { id: 'pushups', name: 'Flexões', reps: 0 },
    { id: 'squats', name: 'Agachamentos', reps: 0 },
    { id: 'core', name: 'Core (min)', reps: 0 }
  ]);
  const [isSaved, setIsSaved] = useState(false);

  // Load from DB
  useEffect(() => {
    const loadState = async () => {
        const today = new Date().toISOString().split('T')[0];
        const logs = await db.dailyLogs
            .where('date').equals(today)
            .and(l => l.type === 'physical')
            .toArray();

        // Update local state with DB values
        setExercises(prev => prev.map(ex => {
            const log = logs.find(l => l.subtype === ex.id);
            return log ? { ...ex, reps: parseInt(log.value as string) || 0 } : ex;
        }));
    };
    loadState();
  }, []);

  const updateReps = (id: string, delta: number) => {
    setExercises(prev => prev.map(ex => 
      ex.id === id ? { ...ex, reps: Math.max(0, ex.reps + delta) } : ex
    ));
    setIsSaved(false); // Reset saved state on change
  };

  const saveLog = async () => {
    const date = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    
    await db.transaction('rw', db.dailyLogs, async () => {
      // First, remove existing physical logs for today to avoid duplicates/messy accumulation
      const existingIds = await db.dailyLogs
        .where('date').equals(date)
        .and(l => l.type === 'physical')
        .primaryKeys();
        
      await db.dailyLogs.bulkDelete(existingIds as number[]);

      // Add fresh logs
      for (const ex of exercises) {
        if (ex.reps > 0) {
          await db.dailyLogs.add({
            date,
            type: 'physical',
            subtype: ex.id,
            value: ex.reps.toString(),
            completed: true,
            timestamp
          });
        }
      }
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24">
      <header>
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Treino do Rei</h1>
        <p className="text-zinc-400 text-sm italic">"Domínio próprio. Constância. Obediência."</p>
      </header>

      <GlassCard className="mb-6">
        <h2 className="text-sm font-heading text-white mb-2">Duração do Treino</h2>
        <Timer 
            initialMinutes={45} 
            allowManualFinish
            label="Tempo de Sessão"
            onComplete={() => alert("Tempo limite de treino atingido.")}
            onManualFinish={async (elapsed) => {
                const date = new Date().toISOString().split('T')[0];
                const minutes = Math.ceil(elapsed / 60);
                await db.dailyLogs.add({
                    date,
                    type: 'physical',
                    subtype: 'workout_duration',
                    value: minutes.toString(),
                    completed: true,
                    timestamp: Date.now()
                });
                alert(`Duração salva: ${minutes} min.`);
            }}
        />
      </GlassCard>

      <div className="space-y-4">
        {exercises.map((ex) => (
          <GlassCard key={ex.id} className="flex items-center justify-between">
            <span className="font-heading font-medium text-lg">{ex.name}</span>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => updateReps(ex.id, -5)}
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center active:scale-90 transition-transform"
              >
                <Minus size={18} />
              </button>
              
              <span className="w-8 text-center font-bold text-xl">{ex.reps}</span>
              
              <button 
                onClick={() => updateReps(ex.id, 5)}
                className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center active:scale-90 transition-transform"
              >
                <Plus size={18} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      <button 
        onClick={saveLog}
        className="w-full py-4 bg-primary text-black font-heading font-bold rounded-xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
      >
        {isSaved ? <Check size={20} /> : <Save size={20} />}
        {isSaved ? "Salvo" : "Registrar Treino"}
      </button>
    </div>
  );
}
