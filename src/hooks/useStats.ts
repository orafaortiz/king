import { useLiveQuery } from 'dexie-react-hooks';
import { db, type DailyLog } from '@/lib/db';
import { format, eachDayOfInterval, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface DailyStats {
  date: string;
  score: number;
  logs: DailyLog[];
}

export function useStats() {
  const today = new Date();
  // const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Unused
  // const monthStart = startOfMonth(today); // Unused

  const allLogs = useLiveQuery(() => db.dailyLogs.toArray(), []);

  const calculateDailyScore = (logs: DailyLog[]) => {
    let score = 0;
    const spiritual = logs.filter(l => l.type === 'spiritual' && l.completed).length;
    const physical = logs.filter(l => l.type === 'physical' && l.completed).length;
    const work = logs.filter(l => l.type === 'work' && l.completed).length;
    const journal = logs.filter(l => l.type === 'journal' && l.completed).length;

    // Simple heuristic matching Dashboard logic
    if (spiritual >= 3) score += 30; else score += spiritual * 10;
    if (physical > 0) score += 30;
    if (work > 0) score += 20; // Ideally tracked by hours or blocks
    if (journal > 0) score += 20;

    return Math.min(100, score);
  };

  const getDayStats = (date: Date): DailyStats => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const logs = allLogs?.filter(l => l.date === dateStr) || [];
    return {
      date: dateStr,
      score: calculateDailyScore(logs),
      logs
    };
  };

  // Weekly Stats (last 7 days for trend or current week)
  const getWeeklyStats = () => {
    const days = eachDayOfInterval({ start: subDays(today, 6), end: today });
    return days.map(day => {
        const stats = getDayStats(day);
        return {
            label: format(day, 'EEE', { locale: ptBR }),
            day: format(day, 'd'),
            score: stats.score,
            fullDate: stats.date
        };
    });
  };

  // Monthly Stats (Calendar view data)
  const getMonthlyStats = () => {
      // Just return a map of date -> score for the current month
      if (!allLogs) return {};
      const stats: Record<string, number> = {};
      allLogs.forEach(log => {
          if (!stats[log.date]) {
              const dayLogs = allLogs.filter(l => l.date === log.date);
              stats[log.date] = calculateDailyScore(dayLogs);
          }
      });
      return stats;
  };

  return {
    todayStats: getDayStats(today),
    weeklyStats: getWeeklyStats(),
    monthlyStats: getMonthlyStats(),
    calculateDailyScore
  };
}
