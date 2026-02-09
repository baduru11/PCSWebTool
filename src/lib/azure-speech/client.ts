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

export async function assessPronunciation(
  audioBuffer: Buffer,
  referenceText: string,
  language: string = "zh-CN"
): Promise<PronunciationAssessmentResult> {
  const pronunciationAssessmentConfig = {
    ReferenceText: referenceText,
    GradingSystem: "HundredMark",
    Granularity: "Word",
    Dimension: "Comprehensive",
  };

  const encodedConfig = Buffer.from(
    JSON.stringify(pronunciationAssessmentConfig)
  ).toString("base64");

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
    console.error("Azure Speech API error body:", errorBody);
    throw new Error(`Azure Speech API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  const nbest = data.NBest?.[0];

  if (!nbest) {
    console.error("Azure response missing NBest array:", JSON.stringify(data));
    throw new Error("No pronunciation assessment in response");
  }

  // Check if scores are in PronunciationAssessment object or directly on NBest
  const assessment = nbest.PronunciationAssessment || nbest;

  if (!assessment.AccuracyScore && assessment.AccuracyScore !== 0) {
    console.error("Azure response missing pronunciation scores:", JSON.stringify(data));
    throw new Error("No pronunciation assessment in response");
  }

  return {
    accuracyScore: assessment.AccuracyScore,
    fluencyScore: assessment.FluencyScore,
    completenessScore: assessment.CompletenessScore,
    pronunciationScore: assessment.PronScore,
    words: (nbest.Words || []).map((w: Record<string, unknown>) => {
      // Handle both flat and nested PronunciationAssessment structures
      const wa = (w as Record<string, unknown>).PronunciationAssessment as Record<string, unknown> | undefined;
      return {
        word: w.Word as string,
        accuracyScore: ((wa?.AccuracyScore ?? w.AccuracyScore) as number) ?? 0,
        errorType: ((wa?.ErrorType ?? w.ErrorType) as string) ?? "None",
      };
    }),
  };
}
