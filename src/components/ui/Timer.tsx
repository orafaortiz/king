import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils/cn';

interface TimerProps {
  initialMinutes: number;
  onComplete?: () => void;
  onManualFinish?: (elapsedSeconds: number) => void;
  label?: string;
  allowManualFinish?: boolean;
  persistenceId?: string;
}

export function Timer({ initialMinutes, onComplete, onManualFinish, label, allowManualFinish = false, persistenceId }: TimerProps) {
  // Persistence Helper
  const loadState = () => {
    if (!persistenceId) return null;
    const saved = localStorage.getItem(`timer-${persistenceId}`);
    if (!saved) return null;
    try {
        return JSON.parse(saved);
    } catch {
        return null;
    }
  };

  const [seconds, setSeconds] = useState<number>(() => {
    const saved = loadState();
    if (saved) {
        // If it was running, catch up to now
        if (saved.isActive) {
            const elapsedSinceSave = Math.floor((Date.now() - saved.timestamp) / 1000);
            return Math.max(0, saved.seconds - elapsedSinceSave);
        }
        return saved.seconds;
    }
    return initialMinutes * 60;
  });

  const [isActive, setIsActive] = useState(() => {
    const saved = loadState();
    // If we loaded state and it resulted in 0 seconds, we shouldn't be active (it finished while away)
    if (saved) return saved.isActive;
    return false;
  });

  const totalSeconds = initialMinutes * 60;

  // Persist State
  useEffect(() => {
    if (persistenceId) {
        // If finished (0 and not active), we might want to clear, but let's let the explicit handlers do it
        // actually, we should save the current state regardless so we resume correctly
        localStorage.setItem(`timer-${persistenceId}`, JSON.stringify({
            seconds,
            isActive,
            timestamp: Date.now()
        }));
    }
  }, [seconds, isActive, persistenceId]);

  const clearPersistence = () => {
      if (persistenceId) localStorage.removeItem(`timer-${persistenceId}`);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      clearPersistence(); // Clear when done
      onComplete?.();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, onComplete]);

  const toggle = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setSeconds(initialMinutes * 60);
    clearPersistence();
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((initialMinutes * 60 - seconds) / (initialMinutes * 60)) * 100;

  return (
    <GlassCard className="flex flex-col items-center justify-center py-8 relative overflow-hidden">
      {/* Background Progress Bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-1000 ease-linear" 
        style={{ width: `${progress}%` }} 
      />
      
      {label && <span className="text-zinc-400 mb-2 uppercase tracking-widest text-xs">{label}</span>}
      
      <div className="text-6xl font-heading font-bold tabular-nums tracking-tight text-white mb-6">
        {formatTime(seconds)}
      </div>

      <div className="flex gap-4">
        <button 
          onClick={toggle}
          className={cn(
            "p-4 rounded-full transition-all active:scale-95",
            isActive ? "bg-secondary text-white" : "bg-primary text-black"
          )}
        >
          {isActive ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
        </button>
        <button 
          onClick={reset}
          className="p-4 rounded-full bg-surface/50 text-zinc-400 hover:text-white transition-colors"
          title="Reiniciar"
        >
          <RotateCcw size={20} />
        </button>
        {allowManualFinish && isActive && (
             <button 
                onClick={() => {
                    setIsActive(false);
                    clearPersistence();
                    onManualFinish?.(totalSeconds - seconds);
                }}
                className="px-4 py-2 rounded-full bg-green-900/50 text-green-400 border border-green-800 hover:bg-green-900 transition-colors text-sm font-bold uppercase tracking-wide"
             >
                Concluir
             </button>
        )}
      </div>
    </GlassCard>
  );
}
