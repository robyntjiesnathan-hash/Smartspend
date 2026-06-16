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
  { lvl: 1,  name: 'Money Beginner',   xp: 0 },
  { lvl: 2,  name: 'Budget Starter',   xp: 150 },
  { lvl: 3,  name: 'Expense Tracker',  xp: 350 },
  { lvl: 4,  name: 'Smart Saver',      xp: 600 },
  { lvl: 5,  name: 'Budget Builder',   xp: 900 },
  { lvl: 10, name: 'Financial Planner',xp: 2500 },
  { lvl: 20, name: 'Money Master',     xp: 8000 },
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

export const TXNS = [
  { label: 'Whole Foods Market', amount: -86,   cat: 'Groceries',     icon: '🛒', date: 'Today' },
  { label: 'Salary',             amount: 7125,  cat: 'Income',        icon: '💳', date: 'Today' },
  { label: 'Netflix',            amount: -18,   cat: 'Entertainment', icon: '🎬', date: 'Yesterday' },
  { label: 'Gas Station',        amount: -65,   cat: 'Transport',     icon: '⛽', date: 'Yesterday' },
  { label: 'Freelance',          amount: 1125,  cat: 'Income',        icon: '💰', date: 'Mon' },
  { label: 'Health Insurance',   amount: -280,  cat: 'Health',        icon: '❤️', date: 'Mon' },
];

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

export const INIT_CHALLENGES = [
  { title: '7-Day Awareness',     desc: 'Log every expense for 7 days', days: 7, done: 5, xp: 150, col: '#7B5CF5', colL: '#EDE9FF', colD: '#3D1FA3' },
  { title: 'Save $500 This Week', desc: 'Put aside $500 before Sunday', days: 7, done: 3, xp: 200, col: '#3DBA6A', colL: '#DCF5E7', colD: '#1B6E3A' },
  { title: 'No Takeout Week',     desc: 'Cook at home every day',       days: 7, done: 2, xp: 100, col: '#00C4A7', colL: '#DFFAF6', colD: '#005C4F' },
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

export const fmt = (n: number) => '$' + Math.abs(n).toLocaleString('en-US');
export const pct = (a: number, b: number) => Math.min(100, Math.round((a / b) * 100));

export function getLvl(xp: number) {
  let c = LEVELS[0], n = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) { c = LEVELS[i]; n = LEVELS[i + 1] || LEVELS[i]; }
  }
  const inn = xp - c.xp, inn2 = n.xp - c.xp;
  return { c, n, p: n === c ? 100 : Math.min(100, Math.round((inn / inn2) * 100)), inn, inn2 };
}
