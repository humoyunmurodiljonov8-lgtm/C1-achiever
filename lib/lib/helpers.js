export const COLORS = {
  ink: "#1B2A4A",
  inkLight: "#2C3E63",
  gold: "#C9A227",
  goldLight: "#E5C25C",
  cream: "#FAF8F3",
  paper: "#FFFFFF",
  success: "#2D6A4F",
  successBg: "#E8F3ED",
  danger: "#B23A48",
  dangerBg: "#FBEAEC",
  muted: "#8A8478",
  border: "#E5E0D5"
};

export const CEFR_LEVELS = ["A2", "B1", "B2", "C1", "C2"];

export function speak(text, { rate = 0.95 } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = rate;
  utter.lang = "en-GB";
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith("en"));
  if (enVoice) utter.voice = enVoice;
  window.speechSynthesis.speak(utter);
  return utter;
}

export function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function scoreToCefr(pct) {
  if (pct >= 85) return "C2";
  if (pct >= 65) return "C1";
  if (pct >= 45) return "B2";
  if (pct >= 25) return "B1";
  return "A2";
}
