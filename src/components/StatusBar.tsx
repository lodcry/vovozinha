import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatusBarProps {
  listening: boolean;
  lastCommand: string;
  mode: "idle" | "browsing" | "watching" | "emergency";
}

export function VovozinhaStatusBar({ listening, lastCommand, mode }: StatusBarProps) {
  const modeLabel = {
    idle: "🏠 Início",
    browsing: "🎬 Escolhendo Dorama",
    watching: "▶️ Assistindo",
    emergency: "🆘 Emergência",
  }[mode];

  return (
    <View style={styles.bar}>
      <View style={[styles.dot, { backgroundColor: listening ? "#4ade80" : "#6b7280" }]} />
      <Text style={styles.mode}>{modeLabel}</Text>
      {lastCommand ? <Text style={styles.cmd}>"{lastCommand}"</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f1a",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  mode: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  cmd: {
    color: "#94a3b8",
    fontSize: 14,
    fontStyle: "italic",
  },
});
