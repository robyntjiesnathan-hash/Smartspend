import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Only configure on native (notifications don't exist on web)
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function requestNotifPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  return Notifications.scheduleNotificationAsync({
    content: {
      title: '🌱 SmartSpend reminder',
      body: "Don't forget to log today's spending and keep your streak alive!",
    },
    trigger: { hour: 20, minute: 0, repeats: true } as any,
  });
}

export async function scheduleWeeklySummary(): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  return Notifications.scheduleNotificationAsync({
    content: {
      title: '📊 Weekly summary ready',
      body: 'Tap to see how your spending looked this week.',
    },
    trigger: { weekday: 2, hour: 9, minute: 0, repeats: true } as any,
  });
}

export async function scheduleStreakAlert(): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  return Notifications.scheduleNotificationAsync({
    content: {
      title: '🔥 Streak at risk!',
      body: "Log something today or you'll lose your streak. Keep it going!",
    },
    trigger: { hour: 21, minute: 30, repeats: true } as any,
  });
}

export async function scheduleMascotTip(): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  const tips = [
    'Packing lunch 3× a week can save you $150/month.',
    'Set up auto-transfer on payday — pay yourself first!',
    'Review your subscriptions — most people save $40–60/mo.',
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  return Notifications.scheduleNotificationAsync({
    content: {
      title: '🌱 Sprout says...',
      body: tip,
    },
    trigger: { hour: 10, minute: 0, repeats: true } as any,
  });
}

export async function cancelNotif(id: string): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelScheduledNotificationAsync(id);
}
