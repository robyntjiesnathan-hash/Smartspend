/**
 * Store screenshot generator.
 * Produces 5 screenshots × 2 platforms = 10 PNG files.
 * iOS:     1290 × 2796 px  (iPhone 6.7")
 * Android: 1080 × 1920 px
 */

const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const mascotB64 = fs.readFileSync(path.join(ROOT, 'assets/sprout.png')).toString('base64');
const iconB64   = fs.readFileSync(path.join(ROOT, 'assets/icon.png')).toString('base64');
const MASCOT    = `data:image/png;base64,${mascotB64}`;
const ICON      = `data:image/png;base64,${iconB64}`;

// ─── Platform configs ──────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: 'ios',     w: 1290, h: 2796, phonew: 700, phoneh: 1520, scale: 1 },
  { id: 'android', w: 1080, h: 1920, phonew: 560, phoneh: 1215, scale: 1 },
];

// ─── Colour palette (matches app) ─────────────────────────────────────────────
const C = {
  greenDeep: '#1B6E3A', green: '#3DBA6A', lime: '#C6F135', limeDark: '#5A7A00',
  purple: '#7B5CF5', purpleLight: '#EDE9FF', purpleDark: '#3D1FA3',
  teal: '#00C4A7', tealLight: '#DFFAF6',
  coral: '#FF5C5C', coralLight: '#FFEDED',
  yellow: '#FFD84D',
  dark: '#111C11', mid: '#2B4A2B', muted: '#6B8F6B',
  bg: '#F2FAF4', white: '#fff',
};

// ─── Shared CSS ───────────────────────────────────────────────────────────────
const BASE_CSS = (W, H) => `
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:${W}px; height:${H}px; overflow:hidden;
    font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .wrap { width:${W}px; height:${H}px; display:flex; flex-direction:column; align-items:center; }

  /* ── Phone frame ── */
  .phone { border-radius:52px; overflow:hidden; flex-shrink:0;
    box-shadow:0 0 0 10px #111, 0 0 0 14px #2a2a2a, 0 60px 120px rgba(0,0,0,0.55); }
  .phone-inner { width:100%; height:100%; overflow:hidden; background:#F2FAF4; }

  /* ── App header shared ── */
  .app-hdr { padding:20px 18px 14px; }
  .hdr-row  { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
  .hdr-greeting { color:rgba(255,255,255,0.7); font-size:13px; font-weight:700; margin-bottom:2px; }
  .hdr-title  { color:#fff; font-size:26px; font-weight:900; letter-spacing:-1px; }
  .lvl-pill   { background:rgba(0,0,0,0.2); border-radius:12px; padding:6px 14px; text-align:center; }
  .lvl-label  { color:rgba(255,255,255,0.6); font-size:9px; font-weight:800; text-transform:uppercase; }
  .lvl-num    { color:#fff; font-size:16px; font-weight:900; }
  .pro-pill   { background:${C.lime}; border-radius:99px; padding:3px 12px;
                color:${C.limeDark}; font-size:11px; font-weight:900; }
  .xp-row { display:flex; justify-content:space-between; margin-bottom:4px; }
  .xp-name { color:rgba(255,255,255,0.85); font-size:11px; font-weight:700; }
  .xp-pct  { color:rgba(255,255,255,0.6); font-size:10px; }
  .xp-bg   { height:9px; background:rgba(0,0,0,0.2); border-radius:99px; overflow:hidden; margin-bottom:12px; }
  .xp-fill { height:100%; border-radius:99px; background:${C.lime}; }
  .stats-row { display:flex; gap:8px; }
  .stat-box  { flex:1; background:rgba(0,0,0,0.15); border-radius:13px; padding:8px; text-align:center; }
  .stat-lbl  { color:rgba(255,255,255,0.6); font-size:9px; font-weight:800; text-transform:uppercase; margin-bottom:2px; }
  .stat-val  { color:#fff; font-size:13px; font-weight:900; }

  /* ── Cards ── */
  .card { background:#fff; border-radius:18px; margin:0 12px 8px;
    box-shadow:0 2px 8px rgba(0,0,0,0.07); padding:12px 14px; }
  .card-row { display:flex; align-items:center; gap:10px; }
  .cat-icon { width:40px; height:40px; border-radius:13px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
  .sec-lbl { font-size:10px; font-weight:800; color:${C.muted}; text-transform:uppercase; letter-spacing:0.6px; margin:10px 12px 6px; }
  .badge { border-radius:99px; padding:2px 10px; font-size:10px; font-weight:800; display:inline-block; }
`;

// ─── Phone-screen content per screenshot ─────────────────────────────────────

function homeContent(pw) {
  const f = pw < 600 ? 0.82 : 1;
  return `
  <div style="background:${C.green}">
    <div class="app-hdr">
      <div class="hdr-row">
        <div><div class="hdr-greeting">Good morning</div><div class="hdr-title">SmartSpend</div></div>
        <div class="lvl-pill"><div class="lvl-label">Level</div><div class="lvl-num">5</div></div>
      </div>
      <div class="xp-row"><span class="xp-name">Budget Builder</span><span class="xp-pct">80%</span></div>
      <div class="xp-bg"><div class="xp-fill" style="width:80%"></div></div>
      <div class="stats-row">
        <div class="stat-box"><div class="stat-lbl">Balance</div><div class="stat-val">$6,486</div></div>
        <div class="stat-box"><div class="stat-lbl">Streak</div><div class="stat-val">🔥 14d</div></div>
        <div class="stat-box"><div class="stat-lbl">Health</div><div class="stat-val">82/100</div></div>
      </div>
    </div>
  </div>
  <div style="background:${C.lime};display:flex;align-items:center;padding:10px 14px;gap:10px">
    <img src="${MASCOT}" style="width:${Math.round(70*f)}px;height:${Math.round(70*f)}px;object-fit:contain">
    <div>
      <div style="font-size:9px;font-weight:800;color:${C.limeDark};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px">Sprout says</div>
      <div style="font-size:${Math.round(12*f)}px;font-weight:700;color:${C.dark};line-height:1.4">Every dollar tracked grows your money tree! 🌱</div>
    </div>
  </div>
  <div style="background:${C.dark};display:flex;align-items:center;padding:10px 14px;gap:10px">
    <span style="font-size:16px">💡</span>
    <div style="flex:1;color:rgba(255,255,255,0.88);font-size:${Math.round(11*f)}px;font-weight:700;line-height:1.5">Packing lunch 3x a week can save you $150/month.</div>
    <div style="background:rgba(255,255,255,0.12);border-radius:8px;padding:4px 10px;color:rgba(255,255,255,0.7);font-size:10px;font-weight:800;white-space:nowrap">Next</div>
  </div>
  <div class="sec-lbl">RECENT TRANSACTIONS</div>
  ${[
    ['💰','Salary','Income','Today','+$7,125','#DCF5E7',C.greenDeep],
    ['🛒','Whole Foods','Groceries','Today','-$86','#F5F5F5',C.dark],
    ['🎬','Netflix','Entertainment','Yesterday','-$18','#F5F5F5',C.dark],
    ['🚗','Gas Station','Transport','Yesterday','-$65','#F5F5F5',C.dark],
  ].map(([ic,note,cat,date,amt,bg,col]) => `
    <div style="background:#fff;margin:0 10px 7px;border-radius:16px;padding:10px 12px;display:flex;align-items:center;gap:10px;box-shadow:0 1px 6px rgba(0,0,0,0.06)">
      <div style="width:38px;height:38px;border-radius:12px;background:${bg};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${ic}</div>
      <div style="flex:1"><div style="font-weight:800;font-size:${Math.round(12*f)}px;color:${C.dark}">${note}</div><div style="color:${C.muted};font-size:10px;font-weight:600">${cat} · ${date}</div></div>
      <div style="font-weight:900;font-size:${Math.round(13*f)}px;color:${col}">${amt}</div>
    </div>`).join('')}`;
}

function budgetContent(pw) {
  const f = pw < 600 ? 0.82 : 1;
  const categories = [
    { cat:'Groceries', pct:70, col:'#3DBA6A', icon:'🛒', spent:'$420', limit:'$600' },
    { cat:'Transport',  pct:90, col:'#00C4A7', icon:'🚗', spent:'$360', limit:'$400' },
    { cat:'Entertainment', pct:119, col:'#FF5C5C', icon:'🎬', spent:'$190', limit:'$160', over:true },
    { cat:'Dining Out', pct:48, col:'#FFD84D', icon:'🍽️', spent:'$120', limit:'$250' },
    { cat:'Health',     pct:80, col:'#7B5CF5', icon:'❤️', spent:'$280', limit:'$350' },
  ];
  return `
  <div style="background:#0077B6;padding:20px 18px 16px">
    <div style="color:rgba(255,255,255,0.65);font-size:12px;font-weight:700;margin-bottom:2px">June 2026</div>
    <div style="color:#fff;font-size:24px;font-weight:900;letter-spacing:-1px;margin-bottom:16px">Budget overview</div>
    <div style="display:flex;gap:10px">
      <div style="flex:1;background:rgba(0,0,0,0.18);border-radius:14px;padding:12px;text-align:center">
        <div style="color:rgba(255,255,255,0.6);font-size:9px;font-weight:800;text-transform:uppercase;margin-bottom:3px">Spent</div>
        <div style="font-size:17px;font-weight:900;color:${C.coral}">$1,370</div>
      </div>
      <div style="flex:1;background:rgba(0,0,0,0.18);border-radius:14px;padding:12px;text-align:center">
        <div style="color:rgba(255,255,255,0.6);font-size:9px;font-weight:800;text-transform:uppercase;margin-bottom:3px">Budget</div>
        <div style="font-size:17px;font-weight:900;color:${C.lime}">$1,760</div>
      </div>
    </div>
  </div>
  <div class="sec-lbl" style="margin-top:12px">CATEGORIES</div>
  ${categories.map(b => `
    <div style="background:#fff;margin:0 10px 8px;border-radius:18px;padding:12px 13px;box-shadow:0 1px 6px rgba(0,0,0,0.06)">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <div style="width:40px;height:40px;border-radius:13px;background:${b.col}22;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${b.icon}</div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-weight:900;font-size:${Math.round(13*f)}px;color:${C.dark}">${b.cat}</span>
            ${b.over ? `<span style="background:${C.coralLight};color:#8B1A1A;border-radius:99px;padding:2px 8px;font-size:9px;font-weight:800">Over!</span>` : ''}
          </div>
          <div style="color:${C.muted};font-size:10px;font-weight:700">${b.spent} of ${b.limit}</div>
        </div>
        <div style="font-weight:900;font-size:14px;color:${b.over ? C.coral : b.col}">${Math.min(b.pct,100)}%</div>
      </div>
      <div style="height:8px;background:#EDF0ED;border-radius:99px;overflow:hidden">
        <div style="height:100%;width:${Math.min(100,b.pct)}%;border-radius:99px;background:${b.over ? C.coral : b.col}"></div>
      </div>
    </div>`).join('')}`;
}

function progressContent(pw) {
  const f = pw < 600 ? 0.82 : 1;
  const challenges = [
    { title:'7-Day Awareness', desc:'Log every expense for 7 days', done:5, days:7, xp:150, col:'#7B5CF5', colL:'#EDE9FF', colD:'#3D1FA3' },
    { title:'Save $500 This Week', desc:'Put aside $500 before Sunday', done:3, days:7, xp:200, col:'#3DBA6A', colL:'#DCF5E7', colD:'#1B6E3A' },
  ];
  return `
  <div style="background:${C.greenDeep};padding:20px 18px 14px;text-align:center">
    <div style="color:rgba(255,255,255,0.55);font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4px">FINANCIAL JOURNEY</div>
    <div style="color:#fff;font-size:22px;font-weight:900;letter-spacing:-0.8px;margin-bottom:14px">Your progress</div>
    <img src="${MASCOT}" style="width:${Math.round(100*f)}px;height:${Math.round(100*f)}px;object-fit:contain">
  </div>
  <div style="background:${C.lime};padding:14px 18px">
    <div style="color:${C.limeDark};font-size:11px;font-weight:800;text-transform:uppercase;text-align:center;margin-bottom:4px">Level 5 · Budget Builder</div>
    <div style="color:${C.dark};font-size:28px;font-weight:900;text-align:center;margin-bottom:4px">720 <span style="font-size:14px">total XP</span></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:4px">
      <span style="color:${C.limeDark};font-size:11px;font-weight:800">720 / 900 XP</span>
      <span style="color:${C.limeDark};font-size:11px;font-weight:800">80%</span>
    </div>
    <div style="height:10px;background:rgba(0,0,0,0.12);border-radius:99px;overflow:hidden;margin-bottom:4px">
      <div style="height:100%;width:80%;background:${C.greenDeep};border-radius:99px"></div>
    </div>
    <div style="color:${C.limeDark};font-size:10px;font-weight:700;text-align:right">Next: Frugal Fox</div>
  </div>
  <div class="sec-lbl" style="margin-top:10px">ACTIVE CHALLENGES</div>
  ${challenges.map(ch => `
    <div style="background:#fff;margin:0 10px 8px;border-radius:18px;padding:12px 14px;box-shadow:0 1px 6px rgba(0,0,0,0.06)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-weight:900;font-size:${Math.round(13*f)}px;color:${C.dark};margin-bottom:2px">${ch.title}</div>
          <div style="color:${C.muted};font-size:10px;font-weight:700">${ch.desc}</div>
        </div>
        <span style="background:${ch.colL};color:${ch.colD};border-radius:99px;padding:3px 9px;font-size:10px;font-weight:800">+${ch.xp} XP</span>
      </div>
      <div style="display:flex;gap:5px;margin-bottom:8px">
        ${Array.from({length:ch.days},(_,i)=>`<div style="flex:1;height:7px;border-radius:99px;background:${i<ch.done?ch.col:'#E8EDE8'}"></div>`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="color:${C.muted};font-size:11px;font-weight:700">Day ${ch.done}/${ch.days}</span>
        <div style="background:${ch.col};border-radius:10px;padding:6px 13px;color:#fff;font-size:11px;font-weight:800">Mark today</div>
      </div>
    </div>`).join('')}`;
}

function addContent(pw) {
  const f = pw < 600 ? 0.82 : 1;
  const CATS = ['Groceries','Transport','Entertainment','Dining Out','Health','Shopping'];
  return `
  <div style="background:${C.green};padding:20px 18px 18px">
    <div style="background:rgba(255,255,255,0.2);border-radius:10px;padding:6px 13px;display:inline-block;margin-bottom:14px">
      <span style="color:#fff;font-size:12px;font-weight:800">← Back</span>
    </div>
    <div style="color:rgba(255,255,255,0.65);font-size:12px;font-weight:700;margin-bottom:2px">Every dollar earns +25 XP</div>
    <div style="color:#fff;font-size:24px;font-weight:900;letter-spacing:-1px;margin-bottom:16px">Log transaction</div>
    <div style="display:flex;background:rgba(0,0,0,0.18);border-radius:14px;padding:4px">
      <div style="flex:1;background:#fff;border-radius:11px;padding:10px;text-align:center">
        <span style="font-size:13px;font-weight:800;color:#8B1A1A">Expense</span>
      </div>
      <div style="flex:1;padding:10px;text-align:center">
        <span style="font-size:13px;font-weight:800;color:rgba(255,255,255,0.7)">Income</span>
      </div>
    </div>
  </div>
  <div style="padding:14px 12px;display:flex;flex-direction:column;gap:10px">
    <div style="background:#fff;border-radius:18px;padding:14px 16px;box-shadow:0 1px 6px rgba(0,0,0,0.06)">
      <div style="font-size:10px;font-weight:800;color:${C.muted};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px">AMOUNT</div>
      <div style="font-size:${Math.round(28*f)}px;font-weight:900;color:${C.dark}">$86.50</div>
    </div>
    <div style="background:#fff;border-radius:18px;padding:14px 16px;box-shadow:0 1px 6px rgba(0,0,0,0.06)">
      <div style="font-size:10px;font-weight:800;color:${C.muted};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px">DESCRIPTION</div>
      <div style="font-size:${Math.round(15*f)}px;font-weight:700;color:${C.dark}">Whole Foods Market</div>
    </div>
    <div style="background:#fff;border-radius:18px;padding:14px 16px;box-shadow:0 1px 6px rgba(0,0,0,0.06)">
      <div style="font-size:10px;font-weight:800;color:${C.muted};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">CATEGORY</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${CATS.map(c => `<span style="padding:6px 12px;border-radius:99px;background:${c==='Groceries'?C.green:'#EDF0ED'};color:${c==='Groceries'?'#fff':C.mid};font-size:11px;font-weight:800">${c}</span>`).join('')}
      </div>
    </div>
    <div style="background:${C.lime};border-radius:18px;padding:12px 16px">
      <div style="font-size:${Math.round(12*f)}px;font-weight:800;color:${C.greenDeep}">Logging earns +25 XP and keeps your 14-day streak alive!</div>
    </div>
    <div style="background:${C.dark};border-radius:18px;padding:16px;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,0.25)">
      <span style="color:#fff;font-size:15px;font-weight:900">Log transaction — +25 XP</span>
    </div>
  </div>`;
}

function proContent(pw) {
  const f = pw < 600 ? 0.82 : 1;
  const features = [
    ['🏆','Level & XP System','Track your financial rank and earn XP'],
    ['📈','Weekly Summary','Full income vs expense breakdown charts'],
    ['🎯','Unlimited Quests','Set as many savings goals as you like'],
    ['🎨','Themes & Accessories','Unlock all app themes and Sprout looks'],
    ['📊','Advanced Budgets','Detailed per-category spend insights'],
    ['🔥','Streak & Challenges','Habit-building with rewards and badges'],
  ];
  return `
  <div style="background:#1B6E3A;padding:18px 18px 16px">
    <div style="background:#C6F135;border-radius:99px;padding:3px 12px;display:inline-block;margin-bottom:8px">
      <span style="font-size:10px;font-weight:900;color:#145229;letter-spacing:0.5px">SMARTSPEND PRO</span>
    </div>
    <div style="display:flex;align-items:center;gap:14px">
      <img src="${MASCOT}" style="width:${Math.round(72*f)}px;height:${Math.round(72*f)}px;object-fit:contain">
      <div style="color:#fff;font-size:20px;font-weight:900;letter-spacing:-0.8px;line-height:1.2">Unlock your full financial potential</div>
    </div>
  </div>
  <div style="padding:12px">
    <div style="display:flex;background:#E4EDE4;border-radius:14px;padding:4px;margin-bottom:12px">
      <div style="flex:1;background:#fff;border-radius:11px;padding:9px;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,0.1)">
        <span style="font-size:12px;font-weight:800;color:#1B6E3A">Yearly</span>
      </div>
      <div style="flex:1;padding:9px;text-align:center">
        <span style="font-size:12px;font-weight:800;color:#6B8F6B">Monthly</span>
      </div>
    </div>
    <div style="background:#1B6E3A;border-radius:20px;padding:18px;margin-bottom:6px">
      <span style="background:#C6F135;border-radius:99px;padding:3px 12px;font-size:10px;font-weight:900;color:#145229;display:inline-block;margin-bottom:10px">Best value — save 58%</span>
      <div style="display:flex;align-items:flex-end;gap:4px;margin-bottom:3px">
        <span style="color:#fff;font-size:${Math.round(36*f)}px;font-weight:900;line-height:1">$4.99</span>
        <span style="color:rgba(255,255,255,0.7);font-size:13px;font-weight:700;padding-bottom:5px">/mo</span>
      </div>
      <div style="color:rgba(255,255,255,0.65);font-size:11px;font-weight:700">Billed $59.99/yr</div>
    </div>
    <div style="background:#111C11;border-radius:18px;padding:15px;text-align:center;margin-bottom:10px;box-shadow:0 4px 14px rgba(0,0,0,0.3)">
      <span style="color:#fff;font-size:15px;font-weight:900">Start free trial →</span>
    </div>
    ${features.map(([ic,t,d]) => `
    <div style="background:#fff;border-radius:15px;padding:10px 12px;margin-bottom:7px;display:flex;align-items:center;gap:10px;box-shadow:0 1px 5px rgba(0,0,0,0.06)">
      <div style="width:36px;height:36px;border-radius:11px;background:#DCF5E7;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">${ic}</div>
      <div style="flex:1"><div style="font-weight:800;font-size:${Math.round(12*f)}px;color:${C.dark};margin-bottom:1px">${t}</div><div style="color:${C.muted};font-size:10px;font-weight:600">${d}</div></div>
      <span style="color:${C.green};font-size:14px;font-weight:900">✓</span>
    </div>`).join('')}
  </div>`;
}

// ─── Screenshot designs ───────────────────────────────────────────────────────
const SCREENS = [
  {
    id: '01-home',
    bg1: '#145229', bg2: '#2A7D42',
    headline: 'Your Money Tree Is Growing',
    subline:  'Track spending, earn XP, and build\nlasting financial habits — every day.',
    getContent: homeContent,
  },
  {
    id: '02-budgets',
    bg1: '#004F8F', bg2: '#0096C7',
    headline: 'Smart Budgets.\nZero Stress.',
    subline:  'Set limits per category and get instant\nalertes the moment you go over.',
    getContent: budgetContent,
  },
  {
    id: '03-progress',
    bg1: '#3D1FA3', bg2: '#7B5CF5',
    headline: 'Level Up Your\nFinances',
    subline:  'Complete daily challenges, unlock\nachievements, and climb 20 levels.',
    getContent: progressContent,
  },
  {
    id: '04-add',
    bg1: '#1B6E3A', bg2: '#3DBA6A',
    headline: 'Log in Seconds.\nEarn XP Instantly.',
    subline:  'Every transaction earns 25 XP and\nkeeps your streak alive. It takes 5 taps.',
    getContent: addContent,
  },
  {
    id: '05-pro',
    bg1: '#0D1F0D', bg2: '#1B3A2B',
    headline: 'Unlock the\nFull Experience',
    subline:  'Pro gives you every feature — unlimited\ngoals, weekly summaries, and more.',
    getContent: proContent,
  },
];

// ─── HTML builder ─────────────────────────────────────────────────────────────
function buildHTML(screen, plat) {
  const { w, h, phonew, phoneh } = plat;
  const sf = w / 1290; // scale factor vs iOS reference

  const headlineFontSize = Math.round(72 * sf);
  const sublineFontSize  = Math.round(32 * sf);
  const topPad = Math.round(80 * sf);
  const iconSize = Math.round(56 * sf);
  const appNameSize = Math.round(28 * sf);
  const sectionGap = Math.round(40 * sf);

  const phoneContent = screen.getContent(phonew);

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
${BASE_CSS(w, h)}
.wrap {
  background: linear-gradient(160deg, ${screen.bg1} 0%, ${screen.bg2} 100%);
  padding: ${topPad}px ${Math.round(30*sf)}px ${Math.round(40*sf)}px;
  justify-content: flex-start;
}
.brand {
  display: flex; align-items: center; gap: ${Math.round(12*sf)}px;
  margin-bottom: ${sectionGap}px; align-self: flex-start;
}
.brand-icon { width:${iconSize}px; height:${iconSize}px; border-radius:${Math.round(16*sf)}px; }
.brand-name { color: rgba(255,255,255,0.9); font-size:${appNameSize}px; font-weight:900; letter-spacing:-0.5px; }
.headline {
  color: #fff;
  font-size: ${headlineFontSize}px;
  font-weight: 900;
  letter-spacing: ${Math.round(-2*sf)}px;
  line-height: 1.08;
  white-space: pre-line;
  text-align: center;
  margin-bottom: ${Math.round(20*sf)}px;
  text-shadow: 0 2px 20px rgba(0,0,0,0.25);
}
.subline {
  color: rgba(255,255,255,0.75);
  font-size: ${sublineFontSize}px;
  font-weight: 600;
  line-height: 1.45;
  text-align: center;
  white-space: pre-line;
  margin-bottom: ${sectionGap}px;
}
.phone {
  width: ${phonew}px;
  height: ${phoneh}px;
  border-radius: ${Math.round(46*sf)}px;
}
.phone-inner { overflow-y: hidden; }
</style></head>
<body><div class="wrap">
  <div class="brand">
    <img src="${ICON}" class="brand-icon">
    <span class="brand-name">SmartSpend</span>
  </div>
  <div class="headline">${screen.headline}</div>
  <div class="subline">${screen.subline}</div>
  <div class="phone">
    <div class="phone-inner" style="height:${phoneh}px">
      <div style="background:#000;height:${Math.round(30*sf)}px;display:flex;align-items:center;justify-content:space-between;padding:0 ${Math.round(20*sf)}px">
        <span style="color:#fff;font-size:${Math.round(11*sf)}px;font-weight:700">9:41</span>
        <span style="color:#fff;font-size:${Math.round(10*sf)}px">●●● 📶 🔋</span>
      </div>
      ${phoneContent}
    </div>
  </div>
</div></body></html>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const plat of PLATFORMS) {
    const outDir = path.join(ROOT, 'store-screenshots', plat.id);
    fs.mkdirSync(outDir, { recursive: true });

    for (const screen of SCREENS) {
      const html = buildHTML(screen, plat);
      const page = await browser.newPage();
      await page.setViewportSize({ width: plat.w, height: plat.h });
      await page.setContent(html, { waitUntil: 'load' });
      await page.waitForTimeout(300);
      const out = path.join(outDir, `${screen.id}.png`);
      await page.screenshot({ path: out, type: 'png', clip: { x:0, y:0, width:plat.w, height:plat.h } });
      await page.close();
      const kb = Math.round(fs.statSync(out).size / 1024);
      console.log(`✓ ${plat.id}/${screen.id}.png  (${kb} KB)`);
    }
  }

  await browser.close();
  console.log('\nDone — 10 screenshots generated.');
})();
