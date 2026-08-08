import { Platform } from 'react-native';

export const PRODUCT_IDS: Record<string, string> = {
  monthly: 'smartspend_pro_monthly',   // $4.99/month in Play Console
  yearly:  'smartspend_pro_yearly',    // $59.99/year, 7-day trial
};

export type PurchasePlan = 'yearly' | 'monthly';

export type PurchaseResult =
  | { ok: true }
  | { ok: false; cancelled: boolean; message: string };

// Lazily load the native SDK so web builds don't crash.
function getRC(): typeof import('react-native-purchases').default | null {
  if (Platform.OS === 'web') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('react-native-purchases').default;
  } catch {
    return null;
  }
}

function getApiKey(): string | null {
  if (Platform.OS === 'ios') {
    const k = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
    return k && k !== 'REPLACE_WITH_REVENUECAT_IOS_KEY' ? k : null;
  }
  const k = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';
  return k && k !== 'REPLACE_WITH_REVENUECAT_ANDROID_KEY' ? k : null;
}

// Call once during app startup (from AppContext init).
export function configurePurchases(): void {
  const RC = getRC();
  const apiKey = getApiKey();
  if (!RC || !apiKey) return;
  RC.configure({ apiKey });
}

export async function activatePurchase(plan: PurchasePlan): Promise<PurchaseResult> {
  const RC = getRC();
  const apiKey = getApiKey();
  if (!RC || !apiKey) {
    return { ok: false, cancelled: false, message: 'In-app purchases are not configured yet.' };
  }
  try {
    const offerings = await RC.getOfferings();
    const pkg = plan === 'yearly'
      ? offerings.current?.annual
      : offerings.current?.monthly;
    if (!pkg) return { ok: false, cancelled: false, message: 'Product not available.' };
    const { customerInfo } = await RC.purchasePackage(pkg);
    const isActive = customerInfo.entitlements.active['pro'] !== undefined;
    return isActive ? { ok: true } : { ok: false, cancelled: false, message: 'Purchase did not unlock Pro.' };
  } catch (e: any) {
    if (e?.userCancelled) return { ok: false, cancelled: true, message: '' };
    return { ok: false, cancelled: false, message: e?.message ?? 'Purchase failed.' };
  }
}

export async function restorePurchases(): Promise<PurchaseResult> {
  const RC = getRC();
  const apiKey = getApiKey();
  if (!RC || !apiKey) {
    return { ok: false, cancelled: false, message: 'In-app purchases are not configured yet.' };
  }
  try {
    const customerInfo = await RC.restorePurchases();
    const hasPro = customerInfo.entitlements.active['pro'] !== undefined;
    return hasPro
      ? { ok: true }
      : { ok: false, cancelled: false, message: 'No active subscription found.' };
  } catch (e: any) {
    return { ok: false, cancelled: false, message: e?.message ?? 'Restore failed.' };
  }
}
