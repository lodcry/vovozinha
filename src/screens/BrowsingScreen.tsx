import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import WebView from "react-native-webview";
import { VideoCard } from "../components/VideoCard";
import { speak, speakAndWait } from "../utils/tts";
import { clickVideoByIndex, getVideoTitlesOnScreen } from "../utils/accessibility";
import { YOUTUBE_SEARCH_BASE, DORAMA_DEFAULT_QUERY } from "../config/contacts";

const { width, height } = Dimensions.get("window");

interface BrowsingScreenProps {
  query?: string;
  onConfirm: () => void;
  onCancel: () => void;
  externalCommand: string | null;
}

export function BrowsingScreen({ query, onConfirm, externalCommand }: BrowsingScreenProps) {
  const [videos, setVideos] = useState<{ title: string; thumbnail: string; index: number }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const webviewRef = useRef<any>(null);
  const searchQuery = query || DORAMA_DEFAULT_QUERY;
  const url = `${YOUTUBE_SEARCH_BASE}${encodeURIComponent(searchQuery)}`;

  // Injeta JS no WebView pra extrair títulos e thumbs dos vídeos
  const INJECT_JS = `
    (function() {
      function extractVideos() {
        const items = document.querySelectorAll('ytd-video-renderer');
        const results = [];
        items.forEach((item, i) => {
          if (i >= 8) return;
          const titleEl = item.querySelector('#video-title');
          const thumbEl = item.querySelector('img');
          if (titleEl && thumbEl) {
            results.push({
              title: titleEl.innerText.trim(),
              thumbnail: thumbEl.src,
              index: i
            });
          }
        });
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'VIDEOS', data: results }));
      }
      setTimeout(extractVideos, 3000);
    })();
    true;
  `;

  function onWebViewMessage(event: any) {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === "VIDEOS" && msg.data.length > 0) {
        setVideos(msg.data);
        setLoading(false);
        announceCurrentVideo(msg.data, 0);
      }
    } catch {}
  }

  async function announceCurrentVideo(list: typeof videos, index: number) {
    const video = list[index];
    if (!video) return;
    await speakAndWait(`${video.title}. Quer ver esse?`);
  }

  useEffect(() => {
    if (!externalCommand) return;

    if (externalCommand === "CONFIRMAR_VIDEO") {
      speak("Abrindo agora!");
      clickVideoByIndex(currentIndex);
      onConfirm();
    } else if (externalCommand === "REJEITAR_VIDEO" || externalCommand === "PROXIMO") {
      const next = currentIndex + 1 < videos.length ? currentIndex + 1 : 0;
      setCurrentIndex(next);
      announceCurrentVideo(videos, next);
    } else if (externalCommand === "VOLTAR") {
      const prev = currentIndex - 1 >= 0 ? currentIndex - 1 : videos.length - 1;
      setCurrentIndex(prev);
      announceCurrentVideo(videos, prev);
    }
  }, [externalCommand]);

  return (
    <View style={styles.container}>
      {/* WebView invisível só pra extrair dados */}
      <WebView
        ref={webviewRef}
        source={{ uri: url }}
        style={styles.hiddenWeb}
        injectedJavaScript={INJECT_JS}
        onMessage={onWebViewMessage}
        javaScriptEnabled
      />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#e94560" />
          <Text style={styles.loadingText}>Buscando Doramas...</Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(v) => String(v.index)}
          renderItem={({ item }) => (
            <VideoCard
              title={item.title}
              thumbnail={item.thumbnail}
              isActive={item.index === currentIndex}
            />
          )}
          contentContainerStyle={styles.list}
          scrollEnabled={false}
        />
      )}

      <View style={styles.hint}>
        <Text style={styles.hintText}>Fale "esse" para assistir • "próximo" para o seguinte</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  hiddenWeb: { width: 0, height: 0, opacity: 0 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  loadingText: { color: "#e2e8f0", fontSize: 20, fontWeight: "600" },
  list: { padding: 24 },
  hint: {
    backgroundColor: "#1a1a2e",
    padding: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#2d2d44",
  },
  hintText: { color: "#94a3b8", fontSize: 14 },
});
