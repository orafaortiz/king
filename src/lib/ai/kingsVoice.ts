import { db } from '@/lib/db';

export interface Quote {
  id: string;
  text: string;
  source: string;
  tags: ('morning' | 'night' | 'encouragement' | 'warning' | 'discipline')[];
}

const QUOTES: Quote[] = [
  { id: '1', text: "O preguiçoso deseja e nada tem, mas a alma dos diligentes prospera.", source: "Provérbios 13:4", tags: ['discipline', 'warning'] },
  { id: '2', text: "Seja forte e corajoso. Não se apavore.", source: "Josué 1:9", tags: ['morning', 'encouragement'] },
  { id: '3', text: "A disciplina é o caminho da liberdade.", source: "Jocko Willink", tags: ['discipline'] },
  { id: '4', text: "Não durma enquanto não tiver aprendido algo novo.", source: "Sabedoria", tags: ['night'] },
  { id: '5', text: "O descanso do trabalhador é doce.", source: "Eclesiastes 5:12", tags: ['night', 'encouragement'] },
  { id: '6', text: "Todo trabalho árduo traz proveito, mas o só falar leva à pobreza.", source: "Provérbios 14:23", tags: ['discipline', 'warning'] },
  { id: '7', text: "Governe a sua mente ou ela governará você.", source: "Horácio", tags: ['morning', 'discipline'] }
];

export async function getKingsVoiceMessage(): Promise<Quote> {
  const today = new Date().toISOString().split('T')[0];
  const logs = await db.dailyLogs.where('date').equals(today).toArray();
  const hour = new Date().getHours();

  // Morning (Before 10AM)
  if (hour < 10) {
    return getRandomQuote(['morning']);
  }

  // Night (After 9PM)
  if (hour >= 21) {
    const journalDone = logs.some(l => l.type === 'journal');
    return journalDone 
      ? getRandomQuote(['night', 'encouragement']) 
      : { id: 'alert', text: "O dia ainda não acabou. Faça sua revisão.", source: "O Rei", tags: ['warning'] };
  }

  // Mid-day: Check productivity
  const workDone = logs.some(l => l.type === 'work');
  if (!workDone && hour > 14) {
    return getRandomQuote(['warning', 'discipline']);
  }

  return getRandomQuote(['encouragement', 'discipline']);
}

function getRandomQuote(tags: string[]): Quote {
  const filtered = QUOTES.filter(q => q.tags.some(t => tags.includes(t)));
  const list = filtered.length > 0 ? filtered : QUOTES;
  return list[Math.floor(Math.random() * list.length)];
}
