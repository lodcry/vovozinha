import Tts from "react-native-tts";

export async function initTTS() {
  await Tts.setDefaultLanguage("pt-BR");
  await Tts.setDefaultRate(0.45); // bem devagar, fácil de entender
  await Tts.setDefaultPitch(1.0);
}

export function speak(text: string) {
  Tts.stop();
  Tts.speak(text);
}

export function speakAndWait(text: string): Promise<void> {
  return new Promise((resolve) => {
    Tts.stop();
    const listener = Tts.addEventListener("tts-finish", () => {
      listener.remove();
      resolve();
    });
    Tts.speak(text);
  });
}
