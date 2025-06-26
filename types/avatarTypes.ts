export interface LipsyncData {
  metadata: {
    soundFile: string; // URL of the audio file
    duration: number; // Duration of the audio in seconds
    language: string; // Language of the audio
  };
  mouthCues: Array<{
    start: number; // Start time of the viseme in seconds
    end: number; // End time of the viseme in seconds
    value: string; // Mouth shape or viseme value
  }>;
}
export interface VisemeResponse {
  audioUrl: string; // URL of the synthesized audio file
  lipsync: LipsyncData; // Viseme data for lip synchronization
}
