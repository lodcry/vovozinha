import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { speak } from "../utils/tts";

const { width } = Dimensions.get("window");

interface IdleScreenProps {
  listening: boolean;
}

export function IdleScreen({ listening }: IdleScreenProps) {
  useEffect(() => {
    speak("Olá! Pode falar o nome do Dorama que quer ver.");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌸</Text>
      <Text style={styles.title}>Vovozinha</Text>
      <Text style={styles.sub}>Fale o nome do Dorama</Text>
      <View style={[styles.mic, { backgroundColor: listening ? "#e94560" : "#2d2d44" }]}>
        <Text style={styles.micEmoji}>{listening ? "🎙️" : "🔇"}</Text>
      </View>
      <Text style={styles.sos}>Em caso de emergência, fale "socorro"</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  emoji: { fontSize: 80 },
  title: {
    color: "#e94560",
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 2,
  },
  sub: {
    color: "#e2e8f0",
    fontSize: 24,
    fontWeight: "400",
  },
  mic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  micEmoji: { fontSize: 52 },
  sos: {
    color: "#6b7280",
    fontSize: 16,
    marginTop: 32,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
