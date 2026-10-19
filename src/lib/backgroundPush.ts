import { supabase } from "@/integrations/supabase/client";

const VAPID_PUBLIC_KEY = "BBW8px1-gujatukPYoSObdQx2lzLM940j1Chs9ZEWeotzkw-PwUFRartd5mekSXTHyz-xN_W1GSRk8vqSZfmcJc";

const b64ToBytes = (b64: string) => {
  const s = atob((b64 + "=".repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
};

export type PushResult = "ok" | "unsupported" | "open-in-new-tab" | "denied" | "ios-install" | "error";

const getCoords = () =>
  new Promise<{ latitude: number; longitude: number }>((resolve) => {
    navigator.geolocation?.getCurrentPosition(
      (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
      () => resolve({ latitude: 21.4225, longitude: 39.8262 }),
      { timeout: 10000 },
    );
  });

/** Registers this phone for server-sent Adhan alerts that arrive even when the app is closed. Call from a tap. */
export async function enableBackgroundAdhan(): Promise<PushResult> {
  if (window.top !== window.self) return "open-in-new-tab";
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const standalone = window.matchMedia("(display-mode: standalone)").matches;
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
    return isIOS && !standalone ? "ios-install" : "unsupported";
  }
  const perm = await Notification.requestPermission();
  if (perm !== "granted") return "denied";
  try {
    const reg = (await navigator.serviceWorker.getRegistration("/")) ?? (await navigator.serviceWorker.register("/sw.js"));
    await navigator.serviceWorker.ready;
    const sub = (await reg.pushManager.getSubscription()) ??
      (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(VAPID_PUBLIC_KEY) }));
    const coords = await getCoords();
    let reminderMinutes = 10;
    try { reminderMinutes = JSON.parse(localStorage.getItem("adhanSettings") || "{}")?.fajr?.reminderMinutes ?? 10; } catch { /* default */ }
    const { error } = await supabase.functions.invoke("adhan-push?action=subscribe", {
      body: { subscription: sub.toJSON(), ...coords, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, reminderMinutes },
    });
    if (error) { console.error("adhan subscribe failed", error); return "error"; }
    localStorage.setItem("backgroundAdhan", "on");
    return "ok";
  } catch (e) {
    console.error(e);
    return "error";
  }
}
