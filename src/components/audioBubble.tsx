import { Colors, Fonts } from "@/constants/theme";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Pause, Play } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AudioBubbleProps {
  uri: string;
  dureeSec: number;
  moi: boolean;
}

function formatDuree(sec: number): string {
  const total = Math.max(0, Math.round(sec));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioBubble({ uri, dureeSec, moi }: AudioBubbleProps) {
  const player = useAudioPlayer({ uri });
  const status = useAudioPlayerStatus(player);

  const toggle = () => {
    if (status.playing) {
      player.pause();
      return;
    }
    if (status.duration > 0 && status.currentTime >= status.duration) {
      player.seekTo(0);
    }
    player.play();
  };

  const dureeAffichee = status.duration > 0 ? status.duration : dureeSec;
  const progress = dureeAffichee > 0 ? Math.min(status.currentTime / dureeAffichee, 1) : 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.playButton, moi ? styles.playButtonMoi : styles.playButtonAutre]}
        onPress={toggle}
      >
        {status.playing ? (
          <Pause size={14} color={moi ? "#FFFFFF" : Colors.brand.encre} />
        ) : (
          <Play size={14} color={moi ? "#FFFFFF" : Colors.brand.encre} />
        )}
      </TouchableOpacity>
      <View style={styles.waveTrack}>
        <View
          style={[
            styles.waveProgress,
            { width: `${progress * 100}%` },
            moi ? styles.waveProgressMoi : styles.waveProgressAutre,
          ]}
        />
      </View>
      <Text style={[styles.duree, { color: moi ? "rgba(255,255,255,0.85)" : Colors.light.textSecondary }]}>
        {formatDuree(dureeAffichee)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 160,
    gap: 8,
  },
  playButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonMoi: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  playButtonAutre: {
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  waveTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.12)",
    overflow: "hidden",
  },
  waveProgress: {
    height: 4,
    borderRadius: 2,
  },
  waveProgressMoi: {
    backgroundColor: "#FFFFFF",
  },
  waveProgressAutre: {
    backgroundColor: "#EC7412",
  },
  duree: {
    fontFamily: Fonts.body,
    fontSize: 11,
  },
});
