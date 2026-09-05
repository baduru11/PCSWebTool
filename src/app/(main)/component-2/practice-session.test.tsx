import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PracticeSession } from "./practice-session";

const { audioPlay, createObjectURL, fetchWithRetry, recordedBlobs, revokeObjectURL } = vi.hoisted(() => ({
  audioPlay: vi.fn(() => Promise.resolve()),
  createObjectURL: vi.fn((blob: Blob) => (
    blob.type === "audio/wav" ? "blob:recording-audio" : "blob:reference-audio"
  )),
  fetchWithRetry: vi.fn(),
  recordedBlobs: [] as Blob[],
  revokeObjectURL: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: React.ComponentProps<"a">) => <a {...props}>{children}</a>,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/character/character-display", () => ({
  CharacterDisplay: () => <div />,
}));

vi.mock("@/components/character/dialogue-box", () => ({
  DialogueBox: () => <div />,
}));

vi.mock("@/components/practice/audio-recorder", () => ({
  AudioRecorder: ({
    disabled,
    onRecordingComplete,
  }: {
    disabled?: boolean;
    onRecordingComplete: (audioBlob: Blob) => void;
  }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        const audioBlob = new Blob(["learner recording"], { type: "audio/wav" });
        recordedBlobs.push(audioBlob);
        onRecordingComplete(audioBlob);
      }}
    >
      Start Recording
    </button>
  ),
}));

vi.mock("@/components/shared/achievement-toast", () => ({
  useAchievementToast: () => ({ showAchievementToasts: vi.fn() }),
}));

vi.mock("@/components/shared/audio-settings", () => ({
  useAudioSettings: () => ({
    applyTtsVolume: vi.fn(),
    applyUtteranceVolume: vi.fn(),
  }),
}));

vi.mock("@/lib/dialogue", () => ({
  getDialogue: () => "Practice guidance",
}));

vi.mock("@/lib/fetch-retry", () => ({
  fetchWithRetry,
}));

class AudioStub {
  static instances: AudioStub[] = [];

  currentTime = 0;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  readonly src: string;

  constructor(src: string) {
    this.src = src;
    AudioStub.instances.push(this);
  }

  play() {
    return audioPlay();
  }

  pause() {}
}

const character = {
  name: "Sun Wukong",
  personalityPrompt: "",
  voiceId: "x_xiaoyan",
  expressions: {},
};

describe("Component 2 reference audio", () => {
  beforeEach(() => {
    fetchWithRetry.mockReset();
    audioPlay.mockClear();
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();
    recordedBlobs.length = 0;
    AudioStub.instances.length = 0;
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    vi.stubGlobal("Audio", AudioStub);
    vi.stubGlobal("speechSynthesis", { cancel: vi.fn(), speak: vi.fn() });
    vi.stubGlobal("URL", class extends URL {
      static createObjectURL(blob: Blob) {
        return createObjectURL(blob);
      }

      static revokeObjectURL(url: string) {
        revokeObjectURL(url);
      }
    });
    fetchWithRetry.mockImplementation(async (url: string) => {
      if (url === "/api/speech/assess") {
        return {
          ok: true,
          json: vi.fn().mockResolvedValue({
            words: ["平添", "下流", "高科技", "舞姿", "偶然"].map((word) => ({
              word,
              accuracyScore: 88,
              errorType: "None",
              toneScore: 90,
            })),
          }),
        };
      }
      if (url === "/api/ai/feedback") {
        return {
          ok: true,
          json: vi.fn().mockResolvedValue({ feedback: "Good work!" }),
        };
      }
      return {
        ok: true,
        blob: vi.fn().mockResolvedValue(new Blob(["wav"])),
      };
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("plays the complete five-word recording target through iFlytek before recording", async () => {
    render(
      <PracticeSession
        questions={["平添", "下流", "高科技", "舞姿", "偶然"]}
        character={character}
        component={2}
      />,
    );

    await screen.findByRole("button", { name: "平添" });
    fireEvent.click(screen.getByRole("button", { name: /listen to all words/i }));

    await waitFor(() => {
      expect(fetchWithRetry).toHaveBeenCalledWith("/api/tts/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voiceId: "x_xiaoyan",
          text: "平添。下流。高科技。舞姿。偶然。",
        }),
      });
    });
    expect(audioPlay).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: /playing all words/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: "平添" })).toBeDisabled();
    expect(screen.getByRole("button", { name: /start recording/i })).toBeDisabled();
  });

  it("replays the exact learner recording after capture and recovers when playback ends", async () => {
    render(
      <PracticeSession
        questions={["平添", "下流", "高科技", "舞姿", "偶然"]}
        character={character}
        component={2}
      />,
    );

    await screen.findByRole("button", { name: "平添" });
    fireEvent.click(screen.getByRole("button", { name: /start recording/i }));

    const replayButton = await screen.findByRole("button", { name: /listen to my recording/i });
    expect(createObjectURL).toHaveBeenCalledWith(recordedBlobs[0]);

    fireEvent.click(replayButton);

    await waitFor(() => expect(audioPlay).toHaveBeenCalledOnce());
    expect(AudioStub.instances.at(-1)?.src).toBe("blob:recording-audio");
    expect(screen.getByRole("button", { name: /playing my recording/i })).toBeDisabled();

    AudioStub.instances.at(-1)?.onended?.();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /listen to my recording/i })).toBeEnabled();
    });
  });
});
