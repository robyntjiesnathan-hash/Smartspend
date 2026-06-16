/**
 * Purchase abstraction layer.
 *
 * Right now this is a stub — activatePurchase resolves immediately.
 * To go live: replace the bodies with calls to RevenueCat
 * (react-native-purchases) or expo-in-app-purchases, keeping the same
 * signatures so no other code needs to change.
 */

export type PurchasePlan = 'yearly' | 'monthly';

export type PurchaseResult =
  | { ok: true }
  | { ok: false; cancelled: boolean; message: string };

export async function activatePurchase(_plan: PurchasePlan): Promise<PurchaseResult> {
  // TODO: replace with RevenueCat Purchases.purchaseProduct(sku)
  // For now, simulate a 1-second network delay so the UX is realistic
  await new Promise(r => setTimeout(r, 1200));
  return { ok: true };
}

export async function restorePurchases(): Promise<PurchaseResult> {
  // TODO: replace with RevenueCat Purchases.restorePurchases()
  await new Promise(r => setTimeout(r, 1000));
  // Stub: no prior purchase to restore
  return { ok: false, cancelled: false, message: 'No previous purchase found for this account.' };
}
