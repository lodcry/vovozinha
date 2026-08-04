import React, { useEffect, useRef, useState } from "react";
import { AppState, View, StyleSheet, Alert } from "react-native";
import Voice from "@react-native-voice/voice";
import { initTTS, speak } from "./utils/tts";
import { matchCommand } from "./commands";
import {
  clickSkipAd,
  clickClose,
  scrollDown,
  scrollUp,
  pressBack,
  pressHome,
  clickPlayPause,
  seekBackward,
  seekForward,
} from "./utils/accessibility";
import { triggerEmergency } from "./utils/emergency";
import { IdleScreen } from "./screens/IdleScreen";
import { BrowsingScreen } from "./screens/BrowsingScreen";
import { WatchingScreen } from "./screens/WatchingScreen";
import { VovozinhaStatusBar } from "./components/StatusBar";

type Mode = "idle" | "browsing" | "watching" | "emergency";

export default function App() {
  const [mode, setMode] = useState<Mode>("idle");
  const [listening, setListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [browseQuery, setBrowseQuery] = useState("");
  const [watchUrl, setWatchUrl] = useState("");
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const restartTimer = useRef<any>(null);

  useEffect(() => {
    initTTS();
    setupVoice();
    startListening();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  function setupVoice() {
    Voice.onSpeechResults = (e) => {
      const spoken = e.value?.[0] || "";
      if (!spoken) return;
      handleSpoken(spoken);
    };

    Voice.onSpeechEnd = () => {
      // reinicia escuta automaticamente após 500ms
      restartTimer.current = setTimeout(() => startListening(), 500);
    };

    Voice.onSpeechError = () => {
      restartTimer.current = setTimeout(() => startListening(), 1000);
    };
  }

  async function startListening() {
    try {
      await Voice.start("pt-BR");
      setListening(true);
    } catch {}
  }

  async function handleSpoken(text: string) {
    setLastCommand(text);
    const cmd = matchCommand(text);
    if (!cmd) return;

    // Emergência tem prioridade absoluta
    if (cmd.action === "SOCORRO") {
      setMode("emergency");
      await triggerEmergency();
      setTimeout(() => setMode("idle"), 5000);
      return;
    }

    // Modo navegação: delega pro BrowsingScreen via pendingCommand
    if (mode === "browsing") {
      setPendingCommand(cmd.action);
      setTimeout(() => setPendingCommand(null), 300);
      return;
    }

    // Modo assistindo: comandos de player
    if (mode === "watching") {
      switch (cmd.action) {
        case "PULAR_ANUNCIO": await clickSkipAd(); speak("Pulando."); break;
        case "FECHAR": pressBack(); setMode("idle"); break;
        case "PAUSAR": await clickPlayPause(); break;
        case "ROLAR_BAIXO": await scrollDown(); break;
        case "ROLAR_CIMA": await scrollUp(); break;
        case "VOLTAR": pressBack(); break;
        case "VOLTAR_SEGUNDOS": await seekBackward(); speak("Voltando dez segundos."); break;
        case "AVANCAR_SEGUNDOS": await seekForward(); speak("Avançando dez segundos."); break;
        case "HOME": pressHome(); setMode("idle"); break;
      }
      return;
    }

    // Modo idle
    if (cmd.action === "BUSCAR_DORAMA" && cmd.payload) {
      setBrowseQuery(cmd.payload);
      setMode("browsing");
      speak(`Buscando ${cmd.payload}`);
      return;
    }

    // Comandos globais sempre funcionam
    switch (cmd.action) {
      case "FECHAR": await clickClose(); break;
      case "PULAR_ANUNCIO": await clickSkipAd(); break;
      case "ROLAR_BAIXO": await scrollDown(); break;
      case "ROLAR_CIMA": await scrollUp(); break;
      case "VOLTAR": pressBack(); break;
      case "HOME": pressHome(); break;
    }
  }

  return (
    <View style={styles.root}>
      <VovozinhaStatusBar
        listening={listening}
        lastCommand={lastCommand}
        mode={mode}
      />

      {mode === "idle" && <IdleScreen listening={listening} />}

      {mode === "browsing" && (
        <BrowsingScreen
          query={browseQuery}
          externalCommand={pendingCommand}
          onConfirm={() => setMode("watching")}
          onCancel={() => setMode("idle")}
        />
      )}

      {mode === "watching" && <WatchingScreen videoUrl={watchUrl} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0f0f1a" },
});
