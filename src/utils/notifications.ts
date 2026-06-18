import { Platform } from 'react-native';

// Lazy-load expo-notifications only on native to keep it out of the web bundle
// (its web shim contains code that breaks Safari's strict-mode parser)
const getNotifs = () =>
  Platform.OS !== 'web' ? require('expo-notifications') : null;

export async function requestNotifPermission(): Promise<boolean> {
  const N = getNotifs();
  if (!N) return false;
  const { status: existing } = await N.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await N.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(): Promise<string | null> {
  const N = getNotifs();
  if (!N) return null;
  return N.scheduleNotificationAsync({
    content: {
      title: '🌱 SmartSpend reminder',
      body: "Don't forget to log today's spending and keep your streak alive!",
    },
    trigger: { hour: 20, minute: 0, repeats: true } as any,
  });
}

export async function scheduleWeeklySummary(): Promise<string | null> {
  const N = getNotifs();
  if (!N) return null;
  return N.scheduleNotificationAsync({
    content: {
      title: '📊 Weekly summary ready',
      body: 'Tap to see how your spending looked this week.',
    },
    trigger: { weekday: 2, hour: 9, minute: 0, repeats: true } as any,
  });
}

export async function scheduleStreakAlert(): Promise<string | null> {
  const N = getNotifs();
  if (!N) return null;
  return N.scheduleNotificationAsync({
    content: {
      title: '🔥 Streak at risk!',
      body: "Log something today or you'll lose your streak. Keep it going!",
    },
    trigger: { hour: 21, minute: 30, repeats: true } as any,
  });
}

export async function scheduleMascotTip(): Promise<string | null> {
  const N = getNotifs();
  if (!N) return null;
  const tips = [
    'Packing lunch 3× a week can save you $150/month.',
    'Set up auto-transfer on payday — pay yourself first!',
    'Review your subscriptions — most people save $40–60/mo.',
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  return N.scheduleNotificationAsync({
    content: { title: '🌱 Sprout says...', body: tip },
    trigger: { hour: 10, minute: 0, repeats: true } as any,
  });
}

export async function cancelNotif(id: string): Promise<void> {
  const N = getNotifs();
  if (!N) return;
  await N.cancelScheduledNotificationAsync(id);
}

