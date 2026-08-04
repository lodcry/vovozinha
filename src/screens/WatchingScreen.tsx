import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import WebView from "react-native-webview";

const { width, height } = Dimensions.get("window");

interface WatchingScreenProps {
  videoUrl: string;
}

// JS injetado pra auto-clicar pular anúncio quando aparecer
const AUTO_SKIP_JS = `
  (function() {
    function trySkip() {
      const skipBtns = document.querySelectorAll('.ytp-skip-ad-button, .ytp-ad-skip-button');
      skipBtns.forEach(btn => btn.click());
    }
    setInterval(trySkip, 1000);
  })();
  true;
`;

export function WatchingScreen({ videoUrl }: WatchingScreenProps) {
  const webviewRef = useRef<any>(null);

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: videoUrl }}
        style={styles.webview}
        injectedJavaScript={AUTO_SKIP_JS}
        javaScriptEnabled
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  webview: { flex: 1, width, height },
});
