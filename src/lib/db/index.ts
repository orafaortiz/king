import Dexie, { type Table } from 'dexie';

export interface DailyLog {
  id?: number;
  date: string; // ISO Date "YYYY-MM-DD"
  type: 'spiritual' | 'physical' | 'work' | 'journal';
  subtype?: string; // e.g., "pushups", "market_research"
  value?: string | number; // e.g., "50", "completed", "Feeling strong"
  completed: boolean;
  timestamp: number;
}

export interface RitualBlock {
  id?: number;
  title: string;
  type: 'morning' | 'afternoon' | 'night';
  items: string[]; // Checklist items
}

export class RitualDatabase extends Dexie {
  dailyLogs!: Table<DailyLog>;
  ritualBlocks!: Table<RitualBlock>;

  constructor() {
    super('RitualReiDB');
    this.version(1).stores({
      dailyLogs: '++id, date, type, timestamp',
      ritualBlocks: '++id, type'
    });
  }
}

export const db = new RitualDatabase();
