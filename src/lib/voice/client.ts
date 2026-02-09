import WebSocket from "ws";
import type { ExpressionName } from "@/types/character";

const DASHSCOPE_API_KEY = process.env.ALIBABA_DASHSCOPE_API_KEY || process.env.DASHSCOPE_API_KEY;

const EXPRESSION_INSTRUCTIONS: Partial<Record<ExpressionName, string>> = {
  neutral: "Speak naturally and warmly, like a friendly study buddy.",
  happy: "Speak with a cheerful, bright tone full of energy and joy.",
  proud: "Speak with warm pride and admiration, celebrating achievement.",
  excited: "Speak with high energy and enthusiasm, truly thrilled.",
  thinking: "Speak thoughtfully and gently, as if carefully considering.",
  encouraging: "Speak with warm encouragement, supportive and motivating.",
  teasing: "Speak playfully with a light, teasing tone.",
  surprised: "Speak with gentle surprise, showing care and concern.",
  listening: "Speak softly and attentively.",
  disappointed: "Speak gently with slight concern, still supportive.",
};

/**
 * Academic TTS — clear, consistent Putonghua for reading vocab, passages, sentences.
 * Uses qwen3-tts-flash HTTP API.
 */
export async function synthesizeAcademic(params: {
  voiceId: string;
  text: string;
}): Promise<Buffer> {
  // Truncate to 600 char limit
  const text = params.text.slice(0, 600);

  const response = await fetch(
    "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen3-tts-flash",
        input: {
          text: text,
        },
        parameters: {
          voice: params.voiceId,
          language_type: "Chinese",
          speed: 1.0, // Standard speed for natural pronunciation
          pitch: 0, // Neutral pitch - no variation
          volume: 50, // Standard volume
          seed: 42, // Fixed seed for deterministic output
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Qwen3 Academic TTS API error:", errorBody);
    throw new Error(`Qwen3 Academic TTS error: ${response.status} - ${errorBody}`);
  }

  const result = await response.json();
  const audioUrl = result?.output?.audio?.url;

  if (!audioUrl) {
    console.error("Qwen3 Academic TTS: no audio URL in response", JSON.stringify(result));
    throw new Error("Qwen3 Academic TTS: no audio URL in response");
  }

  // Download the WAV file
  const audioResponse = await fetch(audioUrl);
  if (!audioResponse.ok) {
    throw new Error(`Failed to download audio: ${audioResponse.status}`);
  }

  const arrayBuffer = await audioResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Companion TTS — expressive, personality-driven voice for character dialogue.
 * Uses qwen3-tts-instruct-flash-realtime WebSocket API.
 */
export async function synthesizeCompanion(params: {
  voiceId: string;
  text: string;
  expression?: ExpressionName;
}): Promise<Buffer> {
  if (!DASHSCOPE_API_KEY) {
    throw new Error("DASHSCOPE_API_KEY is not configured");
  }

  const instructions =
    EXPRESSION_INSTRUCTIONS[params.expression ?? "neutral"] ??
    EXPRESSION_INSTRUCTIONS.neutral!;

  return new Promise<Buffer>((resolve, reject) => {
    // Try multiple auth methods for DashScope WebSocket
    const url = `wss://dashscope-intl.aliyuncs.com/api-ws/v1/realtime?model=qwen3-tts-instruct-flash-realtime`;
    console.log("[Companion TTS] Connecting to WebSocket with API key...");
    const ws = new WebSocket(url, {
      headers: {
        "Authorization": `Bearer ${DASHSCOPE_API_KEY}`,
        "X-DashScope-API-Key": DASHSCOPE_API_KEY!,
      },
    });

    const pcmChunks: Buffer[] = [];
    let resolved = false;

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        ws.close();
        reject(new Error("Companion TTS timed out after 30s"));
      }
    }, 30000);

    ws.on("error", (err) => {
      clearTimeout(timeout);
      if (!resolved) {
        resolved = true;
        reject(new Error(`Companion TTS WebSocket error: ${err.message}`));
      }
    });

    ws.on("close", () => {
      clearTimeout(timeout);
      if (!resolved) {
        resolved = true;
        // Build WAV from collected PCM chunks
        const pcmBuffer = Buffer.concat(pcmChunks);
        const wavBuffer = addWavHeader(pcmBuffer, 24000, 1, 16);
        resolve(wavBuffer);
      }
    });

    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === "session.created") {
          // Send session.update with voice config
          ws.send(
            JSON.stringify({
              type: "session.update",
              session: {
                voice: params.voiceId,
                instructions,
                optimize_instructions: true,
                response_format: "pcm",
                sample_rate: 24000,
              },
            })
          );

          // Send text
          ws.send(
            JSON.stringify({
              type: "input_text_buffer.append",
              delta: params.text,
            })
          );

          // Signal we're done sending input
          ws.send(JSON.stringify({ type: "session.finish" }));
        } else if (msg.type === "response.audio.delta") {
          // Collect base64-encoded PCM chunks
          if (msg.delta) {
            pcmChunks.push(Buffer.from(msg.delta, "base64"));
          }
        } else if (
          msg.type === "session.finished" ||
          msg.type === "response.done"
        ) {
          // All audio received — close the socket
          clearTimeout(timeout);
          if (!resolved) {
            resolved = true;
            ws.close();
            const pcmBuffer = Buffer.concat(pcmChunks);
            const wavBuffer = addWavHeader(pcmBuffer, 24000, 1, 16);
            resolve(wavBuffer);
          }
        } else if (msg.type === "error") {
          clearTimeout(timeout);
          if (!resolved) {
            resolved = true;
            ws.close();
            reject(
              new Error(
                `Companion TTS server error: ${msg.error?.message ?? JSON.stringify(msg)}`
              )
            );
          }
        }
      } catch {
        // Ignore non-JSON messages
      }
    });
  });
}

/**
 * Formats multiple words with pauses for TTS reading.
 * Uses Chinese period (。) for consistent ~0.75s pauses between words.
 * Periods create a sentence boundary which produces more uniform timing
 * compared to commas which vary depending on context.
 */
export function formatWordsWithPauses(words: string[]): string {
  return words.join("。");
}

/**
 * Add a WAV header to raw PCM data.
 */
function addWavHeader(
  pcm: Buffer,
  sampleRate: number,
  numChannels: number,
  bitsPerSample: number
): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcm.length;
  const headerSize = 44;

  const header = Buffer.alloc(headerSize);
  // RIFF chunk
  header.write("RIFF", 0);
  header.writeUInt32LE(dataSize + headerSize - 8, 4);
  header.write("WAVE", 8);
  // fmt sub-chunk
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // sub-chunk size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  // data sub-chunk
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcm]);
}
