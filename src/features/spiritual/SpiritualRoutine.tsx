import { useState, useEffect } from 'react';
import { Timer } from '@/components/ui/Timer';
import { GlassCard } from '@/components/ui/GlassCard';
import { CheckCircle2, Circle } from 'lucide-react';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils/cn';

export function SpiritualRoutine() {
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const checklist = [
    { id: 'bible', label: 'Leitura Bíblica' },
    { id: 'prayer', label: 'Oração (Agradecimento e Direção)' },
    { id: 'meditation', label: 'Silêncio Interno' }
  ];

  // Load state from DB on mount
  useEffect(() => {
    const loadState = async () => {
        const today = new Date().toISOString().split('T')[0];
        const logs = await db.dailyLogs
            .where('date').equals(today)
            .and(l => l.type === 'spiritual' && l.completed)
            .toArray();
        
        const completedIds = logs.map(l => l.subtype || '');
        setCompletedItems(completedIds);
    };
    loadState();
  }, []);

  const handleCheck = async (id: string) => {
    const isChecked = completedItems.includes(id);
    const date = new Date().toISOString().split('T')[0];

    if (isChecked) {
        // Uncheck: Remove from UI and delete from DB
        setCompletedItems(prev => prev.filter(i => i !== id));
        const logToDelete = await db.dailyLogs
            .where('date').equals(date)
            .and(l => l.type === 'spiritual' && l.subtype === id)
            .first();
        if (logToDelete?.id) await db.dailyLogs.delete(logToDelete.id);
    } else {
        // Check: Add to UI and DB
        setCompletedItems(prev => [...prev, id]);
        await db.dailyLogs.add({
            date,
            type: 'spiritual',
            subtype: id,
            value: 'completed',
            completed: true,
            timestamp: Date.now()
        });
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <header>
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Ritual Espiritual</h1>
        <p className="text-zinc-400 text-sm italic">"Hoje não ajo por mim. Ajo em alinhamento."</p>
      </header>

      <Timer 
        initialMinutes={30} 
        label="Alimento Espiritual" 
        allowManualFinish
        onComplete={async () => {
          const date = new Date().toISOString().split('T')[0];
          await db.dailyLogs.add({
            date,
            type: 'spiritual',
            subtype: 'timer_session',
            value: '30', // minutes
            completed: true,
            timestamp: Date.now()
          });
          alert("Tempo espiritual concluído. O espírito foi alimentado.");
        }}
        onManualFinish={async (elapsedSeconds) => {
            const date = new Date().toISOString().split('T')[0];
            const minutes = Math.ceil(elapsedSeconds / 60);
            await db.dailyLogs.add({
              date,
              type: 'spiritual',
              subtype: 'timer_session_partial',
              value: minutes.toString(),
              completed: true,
              timestamp: Date.now()
            });
            alert(`Sessão salva: ${minutes} minutos.`);
        }}
      />

      <h2 className="text-xl font-heading mt-8 mb-4">Checklist Diário</h2>
      <div className="space-y-3">
        {checklist.map((item) => {
          const isChecked = completedItems.includes(item.id);
          return (
            <GlassCard 
              key={item.id} 
              variant="interactive"
              onClick={() => handleCheck(item.id)}
              className="flex items-center gap-4 py-4"
            >
              <div className={cn("transition-colors", isChecked ? "text-primary" : "text-zinc-600")}>
                {isChecked ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </div>
              <span className={cn("font-medium", isChecked && "text-zinc-400 line-through text-zinc-500")}>
                {item.label}
              </span>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
