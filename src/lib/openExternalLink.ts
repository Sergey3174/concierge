import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";

export async function openExternalLink(url: string) {
  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url });
    return;
  }

  window.location.assign(url);
}
