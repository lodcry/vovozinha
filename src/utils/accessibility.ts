import { NativeModules, NativeEventEmitter } from "react-native";

const { VovozinhaAccessibility } = NativeModules;
const emitter = new NativeEventEmitter(VovozinhaAccessibility);

export async function clickSkipAd(): Promise<boolean> {
  return VovozinhaAccessibility.clickByText(["Pular anúncio", "Skip Ads", "Skip Ad", "PULAR"]);
}

export async function clickClose(): Promise<boolean> {
  return VovozinhaAccessibility.clickClose();
}

export async function scrollDown(): Promise<void> {
  return VovozinhaAccessibility.scroll("down");
}

export async function scrollUp(): Promise<void> {
  return VovozinhaAccessibility.scroll("up");
}

export async function pressBack(): Promise<void> {
  return VovozinhaAccessibility.pressBack();
}

export async function pressHome(): Promise<void> {
  return VovozinhaAccessibility.pressHome();
}

export async function clickPlayPause(): Promise<boolean> {
  return VovozinhaAccessibility.clickPlayPause();
}

export async function seekBackward(): Promise<boolean> {
  return VovozinhaAccessibility.seekBackward();
}

export async function seekForward(): Promise<boolean> {
  return VovozinhaAccessibility.seekForward();
}

export async function getVideoTitlesOnScreen(): Promise<string[]> {
  return VovozinhaAccessibility.getVideoTitles();
}

export async function clickVideoByIndex(index: number): Promise<boolean> {
  return VovozinhaAccessibility.clickVideoByIndex(index);
}

export function onAccessibilityEvent(callback: (event: any) => void) {
  return emitter.addListener("AccessibilityEvent", callback);
}
