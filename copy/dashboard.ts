// /copy/dashboard.ts
import type { PageCopy } from "./types";

export const dashboardCopy: PageCopy = {
    heroTitle: {
        learn: "Start here—your MXTK dashboard.",
        build: "Your MXTK dashboard—wire, test, ship.",
        operate: "Operate confidently—your MXTK control room.",
    },

    heroSub: {
        learn:
            "Pin helpful widgets, follow guided suggestions, and learn as you go. Everything adapts to your Journey Stage.",
        build:
            "Mode-aware panels group docs, examples, and live data so you can integrate quickly and prove flows end-to-end.",
        operate:
            "A concise view of attestations, custody, and activity—tuned for oversight, with links to evidence you can verify.",
    },

    // These two keys are what your page expects:
    adaptTitle: {
        learn: "How this dashboard adapts",
        build: "How this dashboard adapts",
        operate: "How this dashboard adapts",
    },
    adaptSub: {
        learn:
            "Choose your Journey Stage in the header—Training, Preparing, or Conquer—and the dashboard updates copy and suggestions.",
        build:
            "Switch modes to change the suggestions and defaults. Your pinned widgets stay put.",
        operate:
            "Operate mode prioritizes clarity, status, and next actions. Switch anytime.",
    },

    pillars: [
        {
            title: {
                learn: "Guided, not crowded",
                build: "Focused while you build",
                operate: "Signal over noise",
            },
            body: {
                learn:
                    "We start with the essentials: recent answers, a glossary spotlight, and a few high-signal resources.",
                build:
                    "Surface the right examples, SDK calls, and endpoints. Open the Guide when you need deeper context.",
                operate:
                    "Status, attestations, and key links stay front-and-center. Everything else is one click away.",
            },
        },
        {
            title: {
                learn: "Adapts to your mode",
                build: "Mode-aware content",
                operate: "Operate in your lane",
            },
            body: {
                learn:
                    "Switch between Learn, Build, and Operate in the header—the dashboard copy and suggestions update instantly.",
                build:
                    "Examples, snippets, and runbooks change with the mode so you see what’s relevant to the job at hand.",
                operate:
                    "Policy notes and audit-friendly links appear where you need them; you can still dive to raw evidence.",
            },
        },
        {
            title: {
                learn: "Refine with Sherpa",
                build: "Ask for the next step",
                operate: "Get a precise answer",
            },
            body: {
                learn:
                    "Tell Sherpa what you’re trying to do. It will suggest widgets, rearrange panels, and point you to proof.",
                build:
                    "Use the Guide to request code paths or API shapes; pin what works so it lives on your dashboard.",
                operate:
                    "Ask for attestation freshness, custody notes, or reconciliation hooks—links include where to verify.",
            },
        },
    ],

    sections: [
        {
            heading: {
                learn: "How this dashboard adapts",
                build: "How this dashboard adapts",
                operate: "How this dashboard adapts",
            },
            paragraphs: {
                learn: [
                    "Choose your Journey Stage in the header—Training, Preparing, or Conquer—and the dashboard updates copy and suggestions.",
                    "As you interact, we keep what you use most and suggest what’s missing. You can always undo changes.",
                ],
                build: [
                    "Switch modes in the header to see different presets. Build mode emphasizes examples, SDK calls, and test flows.",
                    "Pin the panels you need. The layout persists automatically and travels with your session.",
                ],
                operate: [
                    "Operate mode favors evidence and status first. You can still switch modes without losing your layout.",
                    "Everything links to a source you can verify—validators, custody notes, or on-chain identifiers.",
                ],
            },
            highlight: {
                learn: "Tip: Use the Guide to ask for a suggested layout for what you’re doing right now.",
                build: "Tip: Ask Sherpa to pin the latest example for a given flow—mint, lock, or attest.",
                operate: "Tip: Ask for a quick attestations recap with freshness windows and links.",
            },
        },

        {
            heading: {
                learn: "What you’ll see first",
                build: "What you’ll see first",
                operate: "What you’ll see first",
            },
            paragraphs: {
                learn: [
                    "Recent Answers, a rotating Glossary Spotlight, and a short Resources lane to get oriented quickly.",
                ],
                build: [
                    "Resources and examples tailored to integration tasks, plus a recent answers panel for fast recall.",
                ],
                operate: [
                    "Evidence-forward panels: attestations, custody notes, and recent activity—with links to the raw records.",
                ],
            },
        },

        {
            heading: {
                learn: "Make it yours",
                build: "Make it yours",
                operate: "Make it yours",
            },
            paragraphs: {
                learn: [
                    "Drag to rearrange, resize to fit, and remove what you don’t need. Ask Sherpa to add a panel when you’re ready.",
                ],
                build: [
                    "Pin the flows you’re actively wiring. Rename sections or add a notes panel for quick scratch work.",
                ],
                operate: [
                    "Keep the critical view up front. Collapse sections you don’t use and surface links your team relies on.",
                ],
            },
        },
    ],
};