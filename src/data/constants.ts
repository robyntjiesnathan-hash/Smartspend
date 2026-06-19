export const P = {
  green: '#3DBA6A',
  greenDeep: '#1B6E3A',
  greenDark: '#145229',
  lime: '#C6F135',
  limeDeep: '#8DB800',
  limeDark: '#5A7A00',
  yellow: '#FFD84D',
  yellowDark: '#7A5F00',
  purple: '#7B5CF5',
  purpleDark: '#3D1FA3',
  purpleLight: '#EDE9FF',
  coral: '#FF5C5C',
  coralDark: '#8B1A1A',
  coralLight: '#FFEDED',
  teal: '#00C4A7',
  tealDark: '#005C4F',
  tealLight: '#DFFAF6',
  white: '#FFFFFF',
  dark: '#111C11',
  mid: '#2B4A2B',
  muted: '#6B8F6B',
  bg: '#F2FAF4',
  card: '#FFFFFF',
};

export const THEMES = [
  { id: 'forest',   name: 'Forest Green',    locked: false, primary: '#3DBA6A', accent: '#C6F135', bg: '#F2FAF4', desc: 'Default — fresh & natural' },
  { id: 'ocean',    name: 'Ocean Deep',      locked: false, primary: '#0077B6', accent: '#90E0EF', bg: '#EAF6FB', desc: 'Unlocked at Level 2' },
  { id: 'sunset',   name: 'Golden Sunset',   locked: true,  primary: '#E76F51', accent: '#FFD166', bg: '#FFF8F0', desc: 'Unlock at Level 5' },
  { id: 'midnight', name: 'Midnight Purple', locked: true,  primary: '#5E60CE', accent: '#C77DFF', bg: '#F3EFFF', desc: 'Unlock at Level 10' },
  { id: 'cherry',   name: 'Cherry Blossom', locked: true,  primary: '#E83F6F', accent: '#FFB3C6', bg: '#FFF0F5', desc: 'Unlock at Level 20' },
];

export const ACCESSORIES = [
  { id: 'none',    name: 'No accessory', emoji: '',   locked: false, desc: 'Clean look' },
  { id: 'hat',     name: 'Party Hat',    emoji: '🎉', locked: false, desc: 'Always equipped' },
  { id: 'crown',   name: 'Gold Crown',   emoji: '👑', locked: true,  desc: 'Unlock at Level 5' },
  { id: 'glasses', name: 'Cool Shades',  emoji: '😎', locked: true,  desc: 'Unlock at Level 3' },
  { id: 'bow',     name: 'Flower Crown', emoji: '🌸', locked: true,  desc: 'Unlock at Level 7' },
  { id: 'star',    name: 'Star Power',   emoji: '⭐', locked: true,  desc: 'Unlock at Level 10' },
];

export const LEVELS = [
  { lvl: 1,  name: 'Money Beginner',    xp: 0 },
  { lvl: 2,  name: 'Budget Starter',    xp: 150 },
  { lvl: 3,  name: 'Expense Tracker',   xp: 350 },
  { lvl: 4,  name: 'Smart Saver',       xp: 600 },
  { lvl: 5,  name: 'Budget Builder',    xp: 900 },
  { lvl: 6,  name: 'Frugal Fox',        xp: 1200 },
  { lvl: 7,  name: 'Thrift Champion',   xp: 1600 },
  { lvl: 8,  name: 'Nest Egg Ninja',    xp: 2000 },
  { lvl: 9,  name: 'Savings Sage',      xp: 2200 },
  { lvl: 10, name: 'Financial Planner', xp: 2500 },
  { lvl: 11, name: 'Wealth Scout',      xp: 3000 },
  { lvl: 12, name: 'Dollar Dynamo',     xp: 3600 },
  { lvl: 13, name: 'Budget Wizard',     xp: 4200 },
  { lvl: 14, name: 'Penny Powerhouse',  xp: 4900 },
  { lvl: 15, name: 'Prosperity Pro',    xp: 5700 },
  { lvl: 16, name: 'Capital Crafter',   xp: 6500 },
  { lvl: 17, name: 'Wealth Strategist', xp: 7000 },
  { lvl: 18, name: 'Finance Guru',      xp: 7400 },
  { lvl: 19, name: 'Money Mentor',      xp: 7700 },
  { lvl: 20, name: 'Money Master',      xp: 8000 },
];

export const TIPS = [
  { icon: '💡', text: 'Packing lunch 3x a week can save you $150/month.' },
  { icon: '📱', text: 'Set up auto-transfer on payday — pay yourself first!' },
  { icon: '🎯', text: '75% of your Emergency Fund goal is within reach.' },
  { icon: '🔥', text: "You're on a 14-day streak! Tomorrow makes 2 weeks." },
  { icon: '📊', text: 'Entertainment is 19% over budget. Try a free weekend activity.' },
];

export const QUESTS = [
  { id: 'q1', title: 'Emergency Fund', emoji: '🛡️', target: 5000, saved: 3750, col: '#3DBA6A', colD: '#1B6E3A', colL: '#DCF5E7' },
  { id: 'q2', title: 'Holiday Quest',  emoji: '✈️', target: 3000, saved: 900,  col: '#7B5CF5', colD: '#3D1FA3', colL: '#EDE9FF' },
  { id: 'q3', title: 'New Device Goal',emoji: '💻', target: 1200, saved: 720,  col: '#00C4A7', colD: '#005C4F', colL: '#DFFAF6' },
];

export const BUDGETS_DATA = [
  { cat: 'Groceries',     spent: 420, limit: 600, col: '#3DBA6A', icon: '🛒' },
  { cat: 'Transport',     spent: 360, limit: 400, col: '#00C4A7', icon: '🚗' },
  { cat: 'Entertainment', spent: 190, limit: 160, col: '#FF5C5C', icon: '🎬' },
  { cat: 'Dining Out',    spent: 120, limit: 250, col: '#FFD84D', icon: '🍽️' },
  { cat: 'Health',        spent: 280, limit: 350, col: '#7B5CF5', icon: '❤️' },
];

export const CAT_ICON: Record<string, string> = {
  Groceries: '🛒', Transport: '🚗', Entertainment: '🎬',
  'Dining Out': '🍽️', Health: '❤️', Shopping: '🛍️',
  Bills: '📄', Other: '📝', Income: '💰',
};

export function fmtDate(d: string, weekday: 'short' | 'long' = 'long'): string {
  const today = new Date().toISOString().split('T')[0];
  const yest = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (d === today) return 'Today';
  if (d === yest) return 'Yesterday';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday, month: 'short', day: 'numeric' });
}

export const ACHS = [
  { icon: '🏆', title: 'First Budget',  desc: 'Created first budget',   xp: 50,  done: true },
  { icon: '💰', title: 'Saving Streak', desc: 'Saved 7 days running',   xp: 100, done: true },
  { icon: '🔥', title: 'Habit Builder', desc: '30-day tracking streak', xp: 200, done: false },
  { icon: '🎯', title: 'Goal Achiever', desc: 'Complete a savings goal', xp: 150, done: false },
  { icon: '🛡️', title: 'No-Spend Day', desc: 'Zero spend day',          xp: 75,  done: true },
  { icon: '🌟', title: 'Goal Setter',   desc: 'Set first goal',          xp: 50,  done: true },
  { icon: '📅', title: 'Week Warrior',  desc: 'Track 7 days straight',  xp: 100, done: false },
  { icon: '💎', title: 'Budget Expert', desc: 'Under budget 3 months',  xp: 300, done: false },
];

export const WEEKLY = [
  { day: 'Mon', income: 0,    expense: 86 },
  { day: 'Tue', income: 0,    expense: 18 },
  { day: 'Wed', income: 7125, expense: 65 },
  { day: 'Thu', income: 0,    expense: 280 },
  { day: 'Fri', income: 1125, expense: 120 },
  { day: 'Sat', income: 0,    expense: 0 },
  { day: 'Sun', income: 0,    expense: 0 },
];

import { LibraryChallenge } from '../types';

export const CHALLENGE_LIBRARY: LibraryChallenge[] = [
  // Habits — purple
  { id: 'log7',     emoji: '📝', cat: 'Habits',    title: '7-Day Tracker',       desc: 'Log every expense for 7 days straight',            days: 7,  xp: 150, col: '#7B5CF5', colL: '#EDE9FF', colD: '#3D1FA3' },
  { id: 'log14',    emoji: '🏅', cat: 'Habits',    title: '2-Week Habit',        desc: 'Track your spending for 14 consecutive days',       days: 14, xp: 300, col: '#7B5CF5', colL: '#EDE9FF', colD: '#3D1FA3' },
  { id: 'log30',    emoji: '🏆', cat: 'Habits',    title: '30-Day Champion',     desc: 'Log expenses every single day for a full month',    days: 30, xp: 600, col: '#7B5CF5', colL: '#EDE9FF', colD: '#3D1FA3' },
  // Budget — teal / red / green
  { id: 'noeat',    emoji: '🍳', cat: 'Budget',    title: 'Cook at Home Week',   desc: 'Skip dining out and cook every meal for 7 days',    days: 7,  xp: 150, col: '#00C4A7', colL: '#DFFAF6', colD: '#005C4F' },
  { id: 'noshop',   emoji: '🛍️', cat: 'Budget',    title: 'No Shopping Week',    desc: 'Avoid non-essential purchases for 7 days',           days: 7,  xp: 150, col: '#FF5C5C', colL: '#FFEDED', colD: '#8B1A1A' },
  { id: 'budget7',  emoji: '🎯', cat: 'Budget',    title: 'Budget Discipline',   desc: 'Stay within budget in every category for 7 days',   days: 7,  xp: 200, col: '#3DBA6A', colL: '#DCF5E7', colD: '#1B6E3A' },
  { id: 'coffee',   emoji: '☕', cat: 'Budget',    title: 'No Coffee Shop Week', desc: 'Make coffee at home — skip the café for 7 days',    days: 7,  xp: 100, col: '#E76F51', colL: '#FFF0ED', colD: '#7A3000' },
  // Savings — yellow / green
  { id: 'save100',  emoji: '💰', cat: 'Savings',   title: 'Save $100 Challenge', desc: 'Put aside $100 before the end of this week',        days: 7,  xp: 200, col: '#FFD84D', colL: '#FFF8E0', colD: '#7A5F00' },
  { id: 'nospend3', emoji: '🛡️', cat: 'Savings',   title: 'No-Spend Days',       desc: 'Have 3 zero-expense days this week',                days: 7,  xp: 125, col: '#3DBA6A', colL: '#DCF5E7', colD: '#1B6E3A' },
  { id: 'goal1',    emoji: '🌟', cat: 'Savings',   title: 'Set Your First Goal', desc: 'Create a savings goal and make your first deposit',  days: 3,  xp: 75,  col: '#FFD84D', colL: '#FFF8E0', colD: '#7A5F00' },
  // Awareness — blue
  { id: 'review3',  emoji: '📊', cat: 'Awareness', title: 'Weekly Reviewer',     desc: 'Open the weekly summary 3 times this week',         days: 3,  xp: 75,  col: '#0077B6', colL: '#EAF6FB', colD: '#003D5C' },
  { id: 'budget3',  emoji: '📋', cat: 'Awareness', title: 'Budget Planner',      desc: 'Set budgets for at least 3 spending categories',     days: 3,  xp: 100, col: '#0077B6', colL: '#EAF6FB', colD: '#003D5C' },
];

export const PRO_FEATURES = [
  { icon: '🏆', title: 'Level & XP System',    desc: 'Track your financial rank and earn XP' },
  { icon: '📈', title: 'Weekly Summary',        desc: 'Full income vs expense breakdown charts' },
  { icon: '🎯', title: 'Unlimited Quests',      desc: 'Set as many savings goals as you like' },
  { icon: '🎨', title: 'Themes & Accessories',  desc: 'Unlock all app themes and Sprout looks' },
  { icon: '📊', title: 'Advanced Budgets',      desc: 'Detailed per-category spend insights' },
  { icon: '🔥', title: 'Streak & Challenges',   desc: 'Habit-building with rewards and badges' },
  { icon: '🤖', title: 'AI Spending Tips',      desc: 'Personalised weekly financial advice' },
  { icon: '☁️', title: 'Cloud Sync & Backup',   desc: 'Your data safe across all devices' },
];

export const FREE_VS_PRO = [
  { feat: 'Expense logging',      free: true,  note: 'Up to 10/month' },
  { feat: 'Basic budgets',        free: true,  note: '3 categories' },
  { feat: '1 savings quest',      free: true,  note: 'Single goal only' },
  { feat: 'Levels & XP',          free: false, note: 'Pro only' },
  { feat: 'Weekly summaries',     free: false, note: 'Pro only' },
  { feat: 'Themes & accessories', free: false, note: 'Pro only' },
  { feat: 'Challenges & streaks', free: false, note: 'Pro only' },
];

const _nf = new Intl.NumberFormat('en-US');
export const fmt = (n: number) => '$' + _nf.format(Math.abs(n));
export const pct = (a: number, b: number) => Math.min(100, Math.round((a / b) * 100));

export function getLvl(xp: number) {
  let c = LEVELS[0], n = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) { c = LEVELS[i]; n = LEVELS[i + 1] || LEVELS[i]; }
  }
  const inn = xp - c.xp, inn2 = n.xp - c.xp;
  return { c, n, p: n === c ? 100 : Math.min(100, Math.round((inn / inn2) * 100)), inn, inn2 };
}
