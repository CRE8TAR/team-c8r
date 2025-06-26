import axios from "axios";
import { SUPPORTED_LANGUAGES } from "@/constants/avatarConstants.ts";
import { uploadAudioToVercelBlob } from "@/utils/avatarUtils.ts";

// Import SDK dynamically to handle server-side rendering
let sdk: typeof import("microsoft-cognitiveservices-speech-sdk") | undefined;

const loadSpeechSDK = async () => {
  if (!sdk) {
    try {
      sdk = await import("microsoft-cognitiveservices-speech-sdk");
    } catch (error) {
      console.error(
        "Failed to load microsoft-cognitiveservices-speech-sdk:",
        error
      );
      throw new Error(
        "Speech SDK is not available. This function must be run server-side."
      );
    }
  }
  return sdk;
};

// Fetch live news from newsdata.io API with language support
export const fetchLiveNews = async (
  query = "action",
  limit = 10,
  language: keyof typeof SUPPORTED_LANGUAGES = "en"
) => {
  try {
    const langCode = SUPPORTED_LANGUAGES[language]?.apiCode || "en";

    const url =
      `https://newsdata.io/api/1/latest?` +
      `q=${query}` +
      `&language=${langCode}` +
      `&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}` +
      `&size=${limit}`;

    const response = await axios.get(url);

    if (response.data && response.data.results) {
      return response.data.results.map(
        (news: {
          title: string;
          description: string;
          source_id: string;
          link: string;
        }) => ({
          title: news.title,
          description: news.description || "No description available",
          source: news.source_id,
          url: news.link,
          language: language,
        })
      );
    }
    return [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

// Azure lip sync generator with language support — No local file used
export const generateVisemesAzure = async (
  text: string,
  gender: string,
  language = "en"
) => {
  const sdk = await loadSpeechSDK();

  const speechKey = process.env.AZURE_SPEECH_KEY;
  const serviceRegion = process.env.AZURE_REGION;

  if (!speechKey || !serviceRegion) {
    throw new Error(
      "Azure Speech Key or Region is not defined in environment variables."
    );
  }

  const langConfig =
    SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES] ||
    SUPPORTED_LANGUAGES.en;

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    speechKey,
    serviceRegion
  );
  speechConfig.speechSynthesisVoiceName =
    gender === "male" ? langConfig.maleVoice : langConfig.femaleVoice;
  speechConfig.speechSynthesisOutputFormat =
    sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;

  const visemes: { start: number; visemeId: number; value: string }[] = [];

  return new Promise((resolve, reject) => {
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    synthesizer.visemeReceived = (
      _s,
      e: { audioOffset: number; visemeId: number }
    ) => {
      visemes.push({
        start: e.audioOffset / 10_000_000, // to seconds
        visemeId: e.visemeId,
        value: visemeIdToMouthShape(e.visemeId),
      });
    };

    synthesizer.speakTextAsync(
      text,
      async (
        result: import("microsoft-cognitiveservices-speech-sdk").SpeechSynthesisResult
      ) => {

        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          // Directly access the audio data (ArrayBuffer)
          // @ts-expect-error - This is a workaround for the SDK's type definition issue
          const audioBuffer = Buffer.from(result.privAudioData);

          // Upload audio to Vercel Blob and get the URL
          const blobName = `audio/${Date.now()}.mp3`;
          const audioUrl = await uploadAudioToVercelBlob(audioBuffer, blobName);

          const mouthCues = visemes.map((v, i) => ({
            start: parseFloat(v.start.toFixed(2)),
            end: parseFloat(
              (visemes[i + 1]?.start ?? v.start + 0.3).toFixed(2)
            ),
            value: v.value,
          }));

          resolve({
            audioUrl,
            lipsync: {
              metadata: {
                soundFile: audioUrl,
                duration: mouthCues.at(-1)?.end || 1.5,
                language: language,
              },
              mouthCues,
            },
          });
        } else {
          console.error("Speech synthesis failed:", result.errorDetails);
          reject("Speech synthesis failed.");
        }
        synthesizer.close();
      },
      (err) => {
        console.error("Azure speech error:", err);
        synthesizer.close();
        reject(err);
      }
    );
  });
};

// Map Azure visemeId to basic mouth shapes
export const visemeIdToMouthShape = (id: number) => {
  const visemeMap = {
    0: "X",
    1: "A",
    2: "B",
    3: "C",
    4: "D",
    5: "E",
    6: "F",
    7: "G",
    8: "H",
    9: "I",
    10: "J",
    11: "K",
    12: "L",
    13: "M",
    14: "N",
    15: "O",
    16: "P",
    17: "Q",
    18: "R",
    19: "S",
    20: "T",
  };
  return visemeMap[id as keyof typeof visemeMap] || "X";
};

// Parse response messages from AI
export const parseResponseMessages = (responseText: string) => {
  try {
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) throw new Error("No JSON content found");

    let messages = JSON.parse(jsonMatch[1]);
    if (!Array.isArray(messages)) messages = [messages];
    return messages;
  } catch (error) {
    console.error("Error parsing messages:", error);
    return [
      {
        text: "I'm having trouble understanding that.",
        facialExpression: "default",
        animation: "Talking",
      },
    ];
  }
};
