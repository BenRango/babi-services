import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useCallback } from "react";

export interface VoiceRecording {
  uri: string;
  dureeSec: number;
}

/**
 * Enregistrement de notes vocales (expo-audio, pas expo-av — déprécié sur cette
 * version d'Expo). Pensé pour les prestataires peu lettrés côté chat client↔presta.
 */
export function useVoiceRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder, 100);

  const start = useCallback(async (): Promise<boolean> => {
    const { granted } = await requestRecordingPermissionsAsync();
    if (!granted) return false;
    await recorder.prepareToRecordAsync();
    recorder.record();
    return true;
  }, [recorder]);

  const stop = useCallback(async (): Promise<VoiceRecording | null> => {
    await recorder.stop();
    if (!recorder.uri) return null;
    return { uri: recorder.uri, dureeSec: Math.max(1, Math.round(state.durationMillis / 1000)) };
  }, [recorder, state.durationMillis]);

  return {
    isRecording: state.isRecording,
    durationMillis: state.durationMillis,
    start,
    stop,
  };
}
