import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY!;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION!;

export interface PronunciationAssessmentResult {
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  pronunciationScore: number;
  words: Array<{
    word: string;
    accuracyScore: number;
    errorType: string;
  }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AzureWord = Record<string, any>;

/**
 * Create a push stream from a WAV buffer.
 * Skips the 44-byte WAV header and pushes raw PCM data.
 */
function createPushStreamFromBuffer(audioBuffer: Buffer): sdk.PushAudioInputStream {
  const format = sdk.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1);
  const pushStream = sdk.AudioInputStream.createPushStream(format);
  const pcmData = audioBuffer.subarray(44);
  const arrayBuffer = pcmData.buffer.slice(pcmData.byteOffset, pcmData.byteOffset + pcmData.byteLength) as ArrayBuffer;
  pushStream.write(arrayBuffer);
  pushStream.close();
  return pushStream;
}

/**
 * Parse word data from Azure's NBest JSON response.
 */
function parseWords(nbest: AzureWord): Array<{ word: string; accuracyScore: number; errorType: string }> {
  return (nbest?.Words || []).map((w: AzureWord) => ({
    word: w.Word as string,
    accuracyScore: (w.PronunciationAssessment?.AccuracyScore as number) ?? 0,
    errorType: (w.PronunciationAssessment?.ErrorType as string) ?? "None",
  }));
}

/**
 * Short audio assessment (< 30s) — uses recognizeOnceAsync with enableMiscue.
 * Best for C1, C2, C3 (small word groups and quiz audio).
 */
async function assessShort(
  audioBuffer: Buffer,
  referenceText: string,
  language: string
): Promise<PronunciationAssessmentResult> {
  const speechConfig = sdk.SpeechConfig.fromSubscription(AZURE_SPEECH_KEY, AZURE_SPEECH_REGION);
  speechConfig.speechRecognitionLanguage = language;

  const pushStream = createPushStreamFromBuffer(audioBuffer);
  const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);

  const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
    referenceText,
    sdk.PronunciationAssessmentGradingSystem.HundredMark,
    sdk.PronunciationAssessmentGranularity.Word,
    true // enableMiscue for omission/insertion detection
  );

  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  pronunciationConfig.applyTo(recognizer);

  return new Promise<PronunciationAssessmentResult>((resolve, reject) => {
    recognizer.recognizeOnceAsync(
      (result) => {
        try {
          if (result.reason === sdk.ResultReason.NoMatch) {
            recognizer.close();
            resolve({
              accuracyScore: 0,
              fluencyScore: 0,
              completenessScore: 0,
              pronunciationScore: 0,
              words: [],
            });
            return;
          }

          const pronResult = sdk.PronunciationAssessmentResult.fromResult(result);
          const jsonStr = result.properties.getProperty(
            sdk.PropertyId.SpeechServiceResponse_JsonResult
          );
          const json = JSON.parse(jsonStr);
          const nbest = json.NBest?.[0];

          recognizer.close();
          resolve({
            accuracyScore: pronResult.accuracyScore,
            fluencyScore: pronResult.fluencyScore,
            completenessScore: pronResult.completenessScore,
            pronunciationScore: pronResult.pronunciationScore,
            words: parseWords(nbest),
          });
        } catch (err) {
          recognizer.close();
          reject(err);
        }
      },
      (err) => {
        recognizer.close();
        reject(new Error(`Recognition failed: ${err}`));
      }
    );
  });
}

/**
 * Long audio assessment (> 30s) — uses continuous recognition.
 * Best for C4 (passage reading) and C5 (3-min speaking).
 * enableMiscue is NOT supported in continuous mode.
 */
async function assessLong(
  audioBuffer: Buffer,
  referenceText: string,
  language: string
): Promise<PronunciationAssessmentResult> {
  const speechConfig = sdk.SpeechConfig.fromSubscription(AZURE_SPEECH_KEY, AZURE_SPEECH_REGION);
  speechConfig.speechRecognitionLanguage = language;

  const pushStream = createPushStreamFromBuffer(audioBuffer);
  const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);

  const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
    referenceText,
    sdk.PronunciationAssessmentGradingSystem.HundredMark,
    sdk.PronunciationAssessmentGranularity.Word,
    false // enableMiscue not supported in continuous mode
  );

  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  pronunciationConfig.applyTo(recognizer);

  interface Segment {
    accuracyScore: number;
    fluencyScore: number;
    duration: number;
  }

  const segments: Segment[] = [];
  const allWords: Array<{ word: string; accuracyScore: number; errorType: string }> = [];

  return new Promise<PronunciationAssessmentResult>((resolve, reject) => {
    let settled = false;

    const timeout = setTimeout(() => {
      if (settled) return;
      recognizer.stopContinuousRecognitionAsync(
        () => { recognizer.close(); },
        () => { recognizer.close(); }
      );
      settled = true;
      reject(new Error("Continuous recognition timed out after 120 seconds"));
    }, 120_000);

    recognizer.recognized = (_, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        try {
          const pronResult = sdk.PronunciationAssessmentResult.fromResult(e.result);
          const jsonStr = e.result.properties.getProperty(
            sdk.PropertyId.SpeechServiceResponse_JsonResult
          );
          const json = JSON.parse(jsonStr);
          const nbest = json.NBest?.[0];
          const nbestWords: AzureWord[] = nbest?.Words || [];

          let segmentDuration = 0;
          for (const w of nbestWords) {
            segmentDuration += w.Duration || 0;
            allWords.push({
              word: w.Word,
              accuracyScore: w.PronunciationAssessment?.AccuracyScore ?? 0,
              errorType: w.PronunciationAssessment?.ErrorType ?? "None",
            });
          }

          segments.push({
            accuracyScore: pronResult.accuracyScore,
            fluencyScore: pronResult.fluencyScore,
            duration: segmentDuration,
          });
        } catch (err) {
          console.error("[Azure Speech] Error parsing recognition result:", err);
        }
      }
    };

    recognizer.canceled = (_, e) => {
      if (e.reason === sdk.CancellationReason.Error) {
        clearTimeout(timeout);
        recognizer.close();
        if (!settled) { settled = true; reject(new Error(`Recognition canceled: ${e.errorDetails}`)); }
      }
      // EndOfStream cancellation is expected — sessionStopped will handle resolve
    };

    recognizer.sessionStopped = () => {
      clearTimeout(timeout);
      recognizer.close();
      if (settled) return;
      settled = true;

      if (segments.length === 0) {
        resolve({
          accuracyScore: 0,
          fluencyScore: 0,
          completenessScore: 0,
          pronunciationScore: 0,
          words: [],
        });
        return;
      }

      // Duration-weighted accuracy and fluency (matching Azure's official sample)
      const totalDuration = segments.reduce((sum, s) => sum + s.duration, 0);
      let accuracyScore: number;
      let fluencyScore: number;

      if (totalDuration > 0) {
        accuracyScore = segments.reduce((sum, s) => sum + s.duration * s.accuracyScore, 0) / totalDuration;
        fluencyScore = segments.reduce((sum, s) => sum + s.duration * s.fluencyScore, 0) / totalDuration;
      } else {
        accuracyScore = segments.reduce((sum, s) => sum + s.accuracyScore, 0) / segments.length;
        fluencyScore = segments.reduce((sum, s) => sum + s.fluencyScore, 0) / segments.length;
      }

      // Completeness: recognized characters vs reference text characters
      const refChars = referenceText.replace(/[。！？；，、：""''（）《》\s]/g, "").length;
      const recognizedChars = allWords
        .filter(w => w.errorType !== "Insertion")
        .reduce((sum, w) => sum + w.word.length, 0);
      const completenessScore = Math.min(100, Math.round((recognizedChars / Math.max(1, refChars)) * 100));

      // PronScore: weighted combination (lowest score gets highest weight)
      const scores = [accuracyScore, completenessScore, fluencyScore].sort((a, b) => a - b);
      const pronunciationScore = scores[0] * 0.4 + scores[1] * 0.2 + scores[2] * 0.4;

      resolve({
        accuracyScore: Math.round(accuracyScore * 10) / 10,
        fluencyScore: Math.round(fluencyScore * 10) / 10,
        completenessScore,
        pronunciationScore: Math.round(pronunciationScore * 10) / 10,
        words: allWords,
      });
    };

    recognizer.startContinuousRecognitionAsync(
      () => {},
      (err) => {
        clearTimeout(timeout);
        recognizer.close();
        reject(new Error(`Failed to start continuous recognition: ${err}`));
      }
    );
  });
}

/**
 * REST API fallback for short audio (original implementation).
 */
async function assessREST(
  audioBuffer: Buffer,
  referenceText: string,
  language: string
): Promise<PronunciationAssessmentResult> {
  const config = {
    ReferenceText: referenceText,
    GradingSystem: "HundredMark",
    Granularity: "Word",
    Dimension: "Comprehensive",
  };

  const encodedConfig = Buffer.from(JSON.stringify(config)).toString("base64");

  const response = await fetch(
    `https://${AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${language}&format=detailed`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
        "Pronunciation-Assessment": encodedConfig,
        "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        Accept: "application/json",
      },
      body: new Uint8Array(audioBuffer),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Azure Speech REST API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  const nbest = data.NBest?.[0];
  if (!nbest) throw new Error("No pronunciation assessment in REST response");

  const assessment = nbest.PronunciationAssessment || nbest;
  if (!assessment.AccuracyScore && assessment.AccuracyScore !== 0) {
    throw new Error("No pronunciation scores in REST response");
  }

  return {
    accuracyScore: assessment.AccuracyScore,
    fluencyScore: assessment.FluencyScore,
    completenessScore: assessment.CompletenessScore,
    pronunciationScore: assessment.PronScore,
    words: (nbest.Words || []).map((w: AzureWord) => ({
      word: w.Word as string,
      accuracyScore: ((w.PronunciationAssessment?.AccuracyScore ?? w.AccuracyScore) as number) ?? 0,
      errorType: ((w.PronunciationAssessment?.ErrorType ?? w.ErrorType) as string) ?? "None",
    })),
  };
}

/**
 * Main entry point for pronunciation assessment.
 * Uses SDK for primary assessment, falls back to REST for short audio.
 */
export async function assessPronunciation(
  audioBuffer: Buffer,
  referenceText: string,
  language: string = "zh-CN",
  mode: "short" | "long" = "short"
): Promise<PronunciationAssessmentResult> {
  try {
    if (mode === "long") {
      return await assessLong(audioBuffer, referenceText, language);
    }
    return await assessShort(audioBuffer, referenceText, language);
  } catch (sdkError) {
    console.warn("[Azure Speech] SDK assessment failed, falling back to REST:", sdkError);
    if (mode === "short") {
      return await assessREST(audioBuffer, referenceText, language);
    }
    throw sdkError;
  }
}
