import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { db } from '@/lib/db';
import { Save } from 'lucide-react';

export function NightRoutine() {
  const [answers, setAnswers] = useState({
    faithful: '',
    weak: '',
    adjust: '',
    emotional: ''
  });

  const saveNightLog = async () => {
    const date = new Date().toISOString().split('T')[0];
    await db.dailyLogs.add({
      date,
      type: 'journal',
      value: JSON.stringify(answers),
      completed: true,
      timestamp: Date.now()
    });
    alert("Dia entregue. Descanse, Rei.");
    setAnswers({ faithful: '', weak: '', adjust: '', emotional: '' });
  };

  return (
    <div className="space-y-6 pb-24">
      <header>
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Alinhamento Noturno</h1>
        <p className="text-zinc-400 text-sm italic">"Rei bíblico sente, mas não é governado."</p>
      </header>

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); saveNightLog(); }}>
        
        <GlassCard>
          <h2 className="text-lg font-heading mb-4 text-white">Revisão Honesta</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Onde fui fiel?</label>
              <textarea 
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-sm focus:border-primary focus:outline-none text-white h-20"
                value={answers.faithful}
                onChange={e => setAnswers({...answers, faithful: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Onde fui fraco?</label>
              <textarea 
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-sm focus:border-primary focus:outline-none text-white h-20"
                value={answers.weak}
                onChange={e => setAnswers({...answers, weak: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">O ajuste para amanhã</label>
              <input 
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-sm focus:border-primary focus:outline-none text-white"
                value={answers.adjust}
                onChange={e => setAnswers({...answers, adjust: e.target.value})}
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-heading mb-4 text-white">Entrega Emocional</h2>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Fale da dor, solidão, ou gratidão</label>
          <textarea 
            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-sm focus:border-primary focus:outline-none text-white h-32"
            placeholder="Entrego a Ti..."
            value={answers.emotional}
            onChange={e => setAnswers({...answers, emotional: e.target.value})}
          />
        </GlassCard>

        <button 
          type="submit"
          className="w-full py-4 bg-primary text-black font-heading font-bold rounded-xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Entregar o Dia
        </button>
      </form>
    </div>
  );
}
