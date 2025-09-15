import type { PageCopy } from "./types";

// Page copy for the new Dashboard (/dashboard). Mirrors the structure used by other pages.
export const dashboardCopy: PageCopy = {
  heroTitle: {
    learn:   "Start here—your MXTK dashboard.",
    build:   "Your workspace for widgets, docs, and quick actions.",
    operate: "At‑a‑glance status with tools you actually use.",
  },
  heroSub: {
    learn:
      "Pin helpful widgets, follow guided suggestions, and learn as you go. Everything adapts to your Journey Stage.",
    build:
      "Drop in Recent Answers, Resources, and Glossary, wire settings, and let Sherpa propose the next best action.",
    operate:
      "Stay oriented with concise status, quick links, and mode‑aware tips. Make changes with confidence.",
  },
  // Optional descriptive sections (kept short for now).
  sections: [
    {
      heading: {
        learn:   "How this dashboard adapts",
        build:   "Quick wiring for developers",
        operate: "Signals that tune recommendations",
      },
      paragraphs: {
        learn: [
          "Choose your Journey Stage in the header—Training, Preparing, or Conquer—and the dashboard updates copy and suggestions.",
        ],
        build: [
          "Widgets support light settings. Add, move, and resize them; everything persists automatically.",
        ],
        operate: [
          "We observe lightweight signals (pins, dwell, refresh) to surface the next helpful step without being noisy.",
        ],
      },
    },
  ],
};
