/**
 * Purchase abstraction layer.
 *
 * CURRENT STATE: stub that resolves immediately for UI development.
 *
 * TO GO LIVE (RevenueCat):
 *   1. npm install react-native-purchases
 *   2. Add "react-native-purchases" to expo plugins in app.json
 *   3. Create products in App Store Connect + Google Play Console:
 *        iOS/Android product IDs must match PRODUCT_IDS below exactly
 *   4. Add those products to a RevenueCat Entitlement called "pro"
 *   5. Replace stub bodies below with the RevenueCat calls shown in comments
 *   6. Call Purchases.configure({ apiKey: REVENUECAT_API_KEY }) in App.tsx
 *
 * RevenueCat dashboard: https://app.revenuecat.com
 */

// ─── Product IDs ─────────────────────────────────────────────────────────────
// These must match exactly what you create in App Store Connect / Google Play.
export const PRODUCT_IDS: Record<string, string> = {
  monthly: 'smartspend_pro_monthly',   // e.g. $4.99/month
  yearly:  'smartspend_pro_yearly',    // e.g. $59.99/year (7-day trial)
};

// ─── RevenueCat API key (replace before release) ─────────────────────────────
export const REVENUECAT_API_KEY = {
  ios:     'REPLACE_WITH_REVENUECAT_IOS_KEY',
  android: 'REPLACE_WITH_REVENUECAT_ANDROID_KEY',
};

// ─── Types ────────────────────────────────────────────────────────────────────
export type PurchasePlan = 'yearly' | 'monthly';

export type PurchaseResult =
  | { ok: true }
  | { ok: false; cancelled: boolean; message: string };

// ─── activatePurchase ─────────────────────────────────────────────────────────
export async function activatePurchase(plan: PurchasePlan): Promise<PurchaseResult> {
  /*
   * RevenueCat implementation (uncomment when ready):
   *
   * import Purchases from 'react-native-purchases';
   * try {
   *   const offerings = await Purchases.getOfferings();
   *   const pkg = plan === 'yearly'
   *     ? offerings.current?.annual
   *     : offerings.current?.monthly;
   *   if (!pkg) return { ok: false, cancelled: false, message: 'Product not available.' };
   *   await Purchases.purchasePackage(pkg);
   *   return { ok: true };
   * } catch (e: any) {
   *   if (e.userCancelled) return { ok: false, cancelled: true, message: '' };
   *   return { ok: false, cancelled: false, message: e.message ?? 'Purchase failed.' };
   * }
   */
  await new Promise(r => setTimeout(r, 1200));
  return { ok: true };
}

// ─── restorePurchases ─────────────────────────────────────────────────────────
export async function restorePurchases(): Promise<PurchaseResult> {
  /*
   * RevenueCat implementation (uncomment when ready):
   *
   * import Purchases from 'react-native-purchases';
   * try {
   *   const info = await Purchases.restorePurchases();
   *   const hasPro = info.entitlements.active['pro'] !== undefined;
   *   if (hasPro) return { ok: true };
   *   return { ok: false, cancelled: false, message: 'No active subscription found.' };
   * } catch (e: any) {
   *   return { ok: false, cancelled: false, message: e.message ?? 'Restore failed.' };
   * }
   */
  await new Promise(r => setTimeout(r, 1000));
  return { ok: false, cancelled: false, message: 'No previous purchase found for this account.' };
}
