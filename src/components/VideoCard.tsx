import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface VideoCardProps {
  title: string;
  thumbnail: string;
  isActive: boolean;
}

export function VideoCard({ title, thumbnail, isActive }: VideoCardProps) {
  return (
    <View style={[styles.card, isActive && styles.cardActive]}>
      <Image source={{ uri: thumbnail }} style={styles.thumb} resizeMode="cover" />
      {isActive && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>👂 Ouvindo...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width - 48,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 4,
    borderColor: "transparent",
    backgroundColor: "#1a1a2e",
  },
  cardActive: {
    borderColor: "#e94560",
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 20,
  },
  thumb: {
    width: "100%",
    height: (width - 48) * 0.56,
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#e94560",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
