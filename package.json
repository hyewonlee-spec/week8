import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  RotateCcw,
  ClipboardCheck,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  HeartHandshake,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const COACH = {
  style: "Calm older sibling",
  tagline: "Steady, protective, practical.",
  principle:
    "We are not here to excuse everything or blame you for everything. We are here to read the setup clearly.",
};

const AI_MODEL_PREVIEW = {
  status: "AI model attached preview",
  modelRole: "Reads the whole conversation, chooses the next best question, and returns a structured coaching card.",
  responseShape: ["coach_message", "risk_level", "main_friction", "one_fix_now", "reattribution", "next_time_plan"],
  safety: "Performance support only — not diagnosis, therapy, or an excuse generator.",
};

const EVENT_PLAYBOOKS = {
  interview: {
    label: "Job interview",
    keywords: ["interview", "job", "panel", "recruiter", "hiring", "manager"],
    before:
      "For an interview, your job is to make it easy for tired people to understand your value. Use short examples, clear structure, and ask for clarification if a question is vague.",
    after:
      "Interviews are not pure personality tests. Panel energy, question clarity, room setup, timing, and power dynamics can all affect how confident and fluent you seem.",
    quickFixes: [
      "Prepare one opening sentence: ‘The main thing I’d bring to this role is…’",
      "If a question is vague, ask: ‘Would you like an example from X or Y?’",
      "Answer in three beats: situation, action, result.",
    ],
  },
  exam: {
    label: "Exam",
    keywords: ["exam", "test", "quiz", "assessment", "final", "paper"],
    before:
      "For an exam, protect your working memory. Check instructions twice, anchor your timing, and do not let one confusing question hijack the whole paper.",
    after:
      "Exams are affected by sleep, room conditions, timing, instructions, and time pressure. A bad exam does not automatically mean you did not understand the material.",
    quickFixes: [
      "Write a tiny timing plan before you start.",
      "Circle unclear instructions and check them before answering.",
      "Skip the first question that jams your brain and return later.",
    ],
  },
  date: {
    label: "First date / social event",
    keywords: ["date", "first date", "restaurant", "dating", "meet up", "coffee"],
    before:
      "For a date, comfort matters. A loud venue, awkward seating, or arriving emotionally fried can make chemistry harder to feel. Choose ease where you can.",
    after:
      "Dates are not clean tests of attractiveness or worth. Venue, timing, nerves, conversation flow, and both people’s day can shape the whole vibe.",
    quickFixes: [
      "Move somewhere quieter if conversation feels like a battle.",
      "Start with one grounded question, not a performance.",
      "If you arrived stressed, name it lightly: ‘My day was a bit full, but I’m happy to be here.’",
    ],
  },
  presentation: {
    label: "Presentation",
    keywords: ["presentation", "present", "slides", "pitch", "talk", "speech", "seminar"],
    before:
      "For a presentation, protect the first minute. Test the tech, know your opening line, and make your structure obvious so the room can follow you.",
    after:
      "Presentations are heavily shaped by audience energy, room setup, tech, time slot, and visibility. Your delivery matters, but the room is part of the performance.",
    quickFixes: [
      "Test the tech before people are watching.",
      "Write your first sentence somewhere visible.",
      "Tell the audience the structure: ‘I’ll cover three things…’",
    ],
  },
  group: {
    label: "Group work / meeting",
    keywords: ["group", "team", "group work", "project", "meeting", "free rider", "free-rider"],
    before:
      "For group work, vague roles create chaos. Name the task, owner, deadline, and next step. Do not rely on everyone magically being responsible.",
    after:
      "Group outcomes are shaped by norms, accountability, role clarity, and free-rider behaviour. Do not absorb a broken structure as a personal failure.",
    quickFixes: [
      "Ask: ‘Who owns which part, and by when?’",
      "Put decisions in writing before the group disperses.",
      "Separate helpful people from vague agreement.",
    ],
  },
  general: {
    label: "Important event",
    keywords: [],
    before:
      "For any important event, your first job is not to become a perfect person. It is to make the situation a little more usable.",
    after:
      "One event is data, not a diagnosis. Read the outcome through your controllables, the setup, and your state on the day.",
    quickFixes: [
      "Fix one small thing in the environment.",
      "Clarify what success looks like.",
      "Decide your first sentence or first action.",
    ],
  },
};

const BEFORE_STEPS = [
  {
    id: "event",
    prompt: "Okay, what are you walking into?",
    helper:
      "Example: job interview in 10 minutes, exam tomorrow morning, first date tonight, presentation after lunch.",
  },
  {
    id: "time",
    prompt: "How soon does it start?",
    helper: "Be rough. ‘Now’, ‘10 minutes’, ‘tomorrow’, ‘next week’ all work.",
  },
  {
    id: "friction",
    prompt:
      "What feels off right now — the room, the people, your body, the rules, or something else?",
    helper: "Write it like you’d text a friend. Messy is fine. I’ll sort it.",
  },
  {
    id: "stakes",
    prompt: "What is the main thing you need to protect: confidence, focus, energy, clarity, or calm?",
    helper: "This helps me give advice that is actually useful for this moment.",
  },
  {
    id: "changeable",
    prompt: "What can still be changed before it starts?",
    helper:
      "Tiny counts: water, seat, lighting, asking a clarification question, testing tech, taking two breaths.",
  },
];

const AFTER_STEPS = [
  {
    id: "outcome",
    prompt: "Tell me what happened.",
    helper:
      "Give me the rough version. Better than expected, worse than expected, confusing, unfair, awkward — anything.",
  },
  {
    id: "selfStory",
    prompt: "What harsh story is your brain trying to tell about you?",
    helper:
      "Example: I’m bad at interviews, I’m awkward, I’m not smart enough, I always mess up.",
  },
  {
    id: "controllables",
    prompt: "What parts were genuinely in your control?",
    helper:
      "Preparation, practice, asking questions, communication, time management, emotional regulation.",
  },
  {
    id: "setup",
    prompt: "What parts of the setup made it harder?",
    helper:
      "Room, noise, seating, tech, timing, unclear expectations, power dynamics, tired people, unfair process.",
  },
  {
    id: "state",
    prompt: "What state were you in before or during it?",
    helper: "Sleep, hunger, anxiety, stress, emotional load, illness, overload, dehydration.",
  },
  {
    id: "nextTime",
    prompt: "What would you want to do differently next time?",
    helper: "One practical improvement is enough. No self-attack required.",
  },
];

function detectEventType(text) {
  const lower = text.toLowerCase();
  const found = Object.entries(EVENT_PLAYBOOKS).find(([key, playbook]) => {
    if (key === "general") return false;
    return playbook.keywords.some((word) => lower.includes(word));
  });
  return found ? found[0] : "general";
}

function classifyRisk(text) {
  const lower = text.toLowerCase();

  const redWords = [
    "panic",
    "hostile",
    "unfair",
    "exhausted",
    "freezing",
    "boiling",
    "furnace",
    "unclear",
    "no sleep",
    "slept 2",
    "slept 3",
    "terrible",
    "stacked",
    "tech failure",
    "flickering",
    "sick",
    "crying",
    "rushed",
    "late",
    "power imbalance",
    "impossible",
    "overwhelmed",
    "meltdown",
  ];

  const yellowWords = [
    "tired",
    "hungry",
    "thirsty",
    "nervous",
    "anxious",
    "awkward",
    "cold",
    "hot",
    "noise",
    "loud",
    "dim",
    "fluorescent",
    "distracted",
    "after lunch",
    "morning",
    "8am",
    "confusing",
    "wobbly",
    "bad lighting",
    "bad seat",
    "stress",
    "stressed",
    "annoyed",
    "weird",
  ];

  const redHits = redWords.filter((w) => lower.includes(w)).length;
  const yellowHits = yellowWords.filter((w) => lower.includes(w)).length;

  if (redHits >= 2 || (redHits >= 1 && yellowHits >= 2)) return "red";
  if (redHits >= 1 || yellowHits >= 2) return "yellow";
  if (yellowHits === 1) return "yellow";
  return "green";
}

function extractThemes(text) {
  const lower = text.toLowerCase();
  const themes = [];

  const checks = [
    {
      key: "Room",
      words: [
        "room",
        "cold",
        "hot",
        "freezing",
        "boiling",
        "lighting",
        "noise",
        "loud",
        "seat",
        "chair",
        "layout",
        "flickering",
        "tech",
        "projector",
        "screen",
        "wobbly",
        "table",
        "aircon",
        "air con",
      ],
    },
    {
      key: "People",
      words: [
        "panel",
        "audience",
        "people",
        "hostile",
        "distracted",
        "tired",
        "exhausted",
        "dominating",
        "free-rider",
        "free rider",
        "power",
        "intimidating",
        "rude",
        "cold audience",
      ],
    },
    {
      key: "My state",
      words: [
        "hungry",
        "tired",
        "sleep",
        "no sleep",
        "dehydrated",
        "thirsty",
        "anxious",
        "panic",
        "stressed",
        "crying",
        "sick",
        "overwhelmed",
        "emotion",
        "emotional",
      ],
    },
    {
      key: "Rules",
      words: [
        "instructions",
        "unclear",
        "expectations",
        "criteria",
        "time pressure",
        "unfair",
        "process",
        "deadline",
        "stacked",
        "rubric",
        "role",
        "rules",
      ],
    },
  ];

  checks.forEach((check) => {
    if (check.words.some((word) => lower.includes(word))) themes.push(check.key);
  });

  return themes.length ? themes : ["General setup"];
}

function containsAny(text, words) {
  const lower = text.toLowerCase();
  return words.some((word) => lower.includes(word));
}

function generateBridge(mode, stepId, answer, answers) {
  const combined = Object.values({ ...answers, [stepId]: answer }).join(" ");
  const eventType = detectEventType(combined);
  const playbook = EVENT_PLAYBOOKS[eventType];
  const themes = extractThemes(combined);

  if (mode === "before") {
    if (stepId === "event") {
      return `Got it — ${playbook.label.toLowerCase()}. I’ll keep this practical. ${playbook.before}`;
    }
    if (stepId === "time") {
      if (containsAny(answer, ["now", "minute", "soon", "about to", "10", "5"])) {
        return "Okay, so we are in quick-protect mode. No big life lesson. Just spot the friction, fix one thing, and get you in steadier.";
      }
      return "Good. Since you have some time, we can think about setup design, not just emergency fixes.";
    }
    if (stepId === "friction") {
      return `That counts. I’m hearing possible friction around ${themes.join(", ")}. That does not mean you cannot do well — it means we should not pretend the setup is neutral.`;
    }
    if (stepId === "stakes") {
      return `Okay. We protect ${answer.toLowerCase()} first. Not everything needs fixing — just the thing most likely to affect your performance.`;
    }
  }

  if (mode === "after") {
    if (stepId === "outcome") {
      return "Okay. I’m not going to let one rough event become a whole identity verdict. We’ll sort the causes first.";
    }
    if (stepId === "selfStory") {
      return "There it is — the brain doing its dramatic little courtroom speech. We’ll treat that as a hypothesis, not a verdict.";
    }
    if (stepId === "controllables") {
      return "Good. That is the useful responsibility bucket: things you can practise, repair, request, or prepare differently next time.";
    }
    if (stepId === "setup") {
      return `Yes. That is the setup bucket. I’m hearing ${themes.join(", ")}. Context does not erase responsibility, but it does change the meaning of the outcome.`;
    }
    if (stepId === "state") {
      return "That matters. A reasonable person performs differently when tired, hungry, stressed, anxious, or emotionally loaded. That is not weakness; it is conditions.";
    }
  }

  return null;
}

function chooseImmediateFix(combined, eventType, changeable) {
  const lower = combined.toLowerCase();
  const playbook = EVENT_PLAYBOOKS[eventType] || EVENT_PLAYBOOKS.general;

  if (containsAny(lower, ["unclear", "instructions", "criteria", "expectations", "rubric", "rules"])) {
    return {
      title: "Clarify the target",
      body:
        "Ask one small clarification question before you begin: ‘Can I quickly check what success looks like here?’ This is not neediness. It is aiming before you shoot.",
    };
  }

  if (containsAny(lower, ["tech", "projector", "screen", "microphone", "slides", "wifi", "connection"])) {
    return {
      title: "Remove the tech tax",
      body:
        "Test the tech before you start, even if it feels slightly awkward. Tech friction steals confidence because it makes you look and feel less prepared than you are.",
    };
  }

  if (containsAny(lower, ["seat", "chair", "layout", "wobbly", "table", "back", "see", "hear"])) {
    return {
      title: "Change the physical setup",
      body:
        "Move seats, adjust the table, or reposition yourself if you can. A better seat is not a luxury; it changes power, comfort, and attention.",
    };
  }

  if (containsAny(lower, ["hungry", "dehydrated", "thirsty", "blood sugar", "headache"])) {
    return {
      title: "Fuel the machine",
      body:
        "Get water or a small snack now. Your brain does not become more impressive by running on fumes. Basic body maintenance counts as performance support.",
    };
  }

  if (containsAny(lower, ["anxious", "panic", "stressed", "overwhelmed", "nervous", "shaking"])) {
    return {
      title: "Shrink the moment",
      body:
        "Do a 20-second reset: feet down, slow exhale, unclench jaw, then decide only your first sentence or first action. Do not try to solve the whole event in your head.",
    };
  }

  if (containsAny(lower, ["noise", "loud", "distracting", "interruptions", "echo"])) {
    return {
      title: "Reduce one distraction",
      body:
        "Move, close a door, use headphones before it starts, or calmly name the noise if appropriate. Your focus is not weak just because the room is fighting it.",
    };
  }

  if (containsAny(lower, ["tired", "exhausted", "panel", "audience", "after lunch", "bored", "distracted"])) {
    return {
      title: "Make it easy for tired people",
      body:
        "Use extra structure. Start with the headline, then give the example. Tired people do not follow mystery novels; they follow clear signposts.",
    };
  }

  return {
    title: "Use the smallest available fix",
    body: changeable
      ? `Use this: ${changeable}. Keep it small. The point is not to perfect the setup — it is to make the next part more usable.`
      : playbook.quickFixes[0],
  };
}

function makeBeforeSummary(answers) {
  const combined = Object.values(answers).join(" ");
  const risk = classifyRisk(combined);
  const themes = extractThemes(combined);
  const eventType = detectEventType(combined);
  const playbook = EVENT_PLAYBOOKS[eventType] || EVENT_PLAYBOOKS.general;

  const event = answers.event || "this event";
  const time = answers.time || "soon";
  const stakes = answers.stakes || "your performance";
  const changeable = answers.changeable || "one small thing";
  const fix = chooseImmediateFix(combined, eventType, changeable);

  const label = risk === "red" ? "Red setup" : risk === "yellow" ? "Yellow setup" : "Green setup";
  const icon = risk === "red" ? AlertTriangle : risk === "yellow" ? ShieldCheck : ClipboardCheck;

  const mainRead =
    risk === "green"
      ? "The setup sounds mostly workable. This is a fair enough moment to trust your preparation."
      : risk === "yellow"
        ? `There is manageable friction around ${themes.join(", ")}. It is not a disaster, but it is worth adjusting before you begin.`
        : `This setup has real friction around ${themes.join(", ")}. Treat this as a compromised setup, not a clean test of your ability.`;

  const carryLine =
    risk === "red"
      ? "This may not be a clean test of me. I will do the next useful thing clearly."
      : risk === "yellow"
        ? "There is friction, but I can still protect my performance."
        : "The setup is workable. I can trust my preparation.";

  const strategy =
    risk === "red"
      ? "Lower the demand for perfection. Aim for clear, steady, and recoverable. If something goes wrong, do not treat it as proof about your ability."
      : risk === "yellow"
        ? "Make one adjustment, then stop scanning for problems. Too much checking can become its own distraction."
        : "Do not over-manage the situation. Begin cleanly and let your preparation do some of the work.";

  return {
    type: "summary",
    mode: "before",
    label,
    icon,
    risk,
    copyText: `Environment Audit — Before
${label}
Event: ${event}
Main read: ${mainRead}
One fix now: ${fix.body}
Carry-in sentence: ${carryLine}`,
    sections: [
      { title: "Event", body: `${event} — starts ${time}.` },
      { title: "Main read", body: mainRead },
      { title: "Coach read", body: playbook.before },
      { title: fix.title, body: fix.body },
      { title: `Protect ${stakes}`, body: strategy },
      { title: "Carry-in sentence", body: carryLine },
    ],
  };
}

function softenSelfStory(story) {
  if (!story) return "This event does not get to become a whole identity story.";
  return `Instead of treating “${story}” as a verdict, treat it as a stress-story that needs evidence.`;
}

function makeAfterSummary(answers) {
  const combined = Object.values(answers).join(" ");
  const themes = extractThemes(combined);
  const risk = classifyRisk(combined);
  const eventType = detectEventType(combined);
  const playbook = EVENT_PLAYBOOKS[eventType] || EVENT_PLAYBOOKS.general;

  const selfStory = answers.selfStory || "I failed";
  const controllables = answers.controllables || "some parts of preparation, communication, or choices";
  const setup = answers.setup || "some features of the situation";
  const state = answers.state || "your state on the day";
  const nextTime = answers.nextTime || "choose one setup or preparation change before the next event";

  const verdict =
    risk === "red"
      ? "This does not sound like a pure test of your ability. There were enough situational or state-based factors that self-blame would be an inaccurate reading."
      : risk === "yellow"
        ? "This sounds partly about your performance and partly about the setup. The useful move is to improve your controllables without turning the whole outcome into a character flaw."
        : "This may have been a reasonably fair event, but it still deserves a balanced read. Even fair events are shaped by state, timing, and context.";

  const balancedResponsibility =
    "A fair read has three buckets: what you could control, what the setup contributed, and what your state made harder or easier. You only learn properly when all three are visible.";

  const nextPlan =
    eventType === "interview"
      ? "Before the next interview, prepare two concise examples and one clarification line for vague questions."
      : eventType === "exam"
        ? "Before the next exam, protect sleep where possible, arrive early enough to settle, and write a timing plan before answering."
        : eventType === "date"
          ? "Before the next date, choose a venue that supports conversation and give yourself a small buffer after stressful commitments."
          : eventType === "presentation"
            ? "Before the next presentation, test the tech, write your opening line, and make the structure visible in the first minute."
            : eventType === "group"
              ? "Before the next group task, clarify roles, owners, deadlines, and accountability in writing."
              : "Before the next event, make one setup change and one preparation change. Keep it specific enough that future-you can actually do it.";

  return {
    type: "summary",
    mode: "after",
    label: "Reattribution reset",
    icon: Sparkles,
    risk,
    copyText: `Environment Audit — After
${verdict}
What was yours: ${controllables}
What was not fully yours: ${setup}
State on the day: ${state}
Do not turn this into: ${selfStory}
Next time: ${nextTime}`,
    sections: [
      { title: "First verdict", body: verdict },
      { title: "Balanced responsibility", body: balancedResponsibility },
      { title: "What was yours", body: controllables },
      {
        title: "What was not fully yours",
        body: `${setup}. Main setup themes: ${themes.join(", ")}. ${playbook.after}`,
      },
      { title: "State on the day", body: state },
      { title: "Do not turn this into", body: softenSelfStory(selfStory) },
      { title: "Your next-time move", body: nextTime },
      { title: "Coach suggestion", body: nextPlan },
      {
        title: "More accurate conclusion",
        body: `This was not simply “${selfStory}.” A better read is: the outcome was shaped by your controllables, your state, and the setup around you. That gives you something to learn from without making one event your whole identity.`,
      },
    ],
  };
}

function initialMessages() {
  return [
    {
      role: "coach",
      content:
        "I’m your Environment Audit Coach. Think of me as the calm older sibling outside the room with you: steady, protective, and practical.",
    },
    {
      role: "coach",
      content:
        "I’ll help you check the setup before an important event, or make sense of what happened after without jumping straight to self-blame.",
    },
    {
      role: "coach",
      content: "Choose a mode to start.",
    },
  ];
}

export default function EnvironmentAuditCoachApp() {
  const [mode, setMode] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [summary, setSummary] = useState(null);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef(null);

  const steps = mode === "before" ? BEFORE_STEPS : mode === "after" ? AFTER_STEPS : [];
  const currentStep = steps[stepIndex];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, summary]);

  function beginMode(nextMode) {
    const selectedSteps = nextMode === "before" ? BEFORE_STEPS : AFTER_STEPS;
    setMode(nextMode);
    setStepIndex(0);
    setAnswers({});
    setSummary(null);
    setCopied(false);
    setInput("");
    setMessages([
      {
        role: "coach",
        content:
          nextMode === "before"
            ? "Okay. We’ll do this quickly and kindly. No spiral, no over-analysis — just enough to protect your performance."
            : "Okay. We’ll slow the blame spiral down and sort the outcome into what was yours, what was the setup, and what state you were in.",
      },
      {
        role: "coach",
        content: selectedSteps[0].prompt,
        helper: selectedSteps[0].helper,
      },
    ]);
  }

  function submitAnswer() {
    if (!mode || !currentStep || !input.trim()) return;

    const answer = input.trim();
    const updatedAnswers = { ...answers, [currentStep.id]: answer };
    const userMessage = { role: "user", content: answer };
    const bridge = generateBridge(mode, currentStep.id, answer, answers);
    const nextIndex = stepIndex + 1;

    if (nextIndex < steps.length) {
      const nextStep = steps[nextIndex];
      setAnswers(updatedAnswers);
      setStepIndex(nextIndex);
      setInput("");
      setMessages((prev) => [
        ...prev,
        userMessage,
        ...(bridge ? [{ role: "coach", content: bridge }] : []),
        {
          role: "coach",
          content: nextStep.prompt,
          helper: nextStep.helper,
        },
      ]);
    } else {
      const finalSummary = mode === "before" ? makeBeforeSummary(updatedAnswers) : makeAfterSummary(updatedAnswers);
      setAnswers(updatedAnswers);
      setInput("");
      setMessages((prev) => [
        ...prev,
        userMessage,
        ...(bridge ? [{ role: "coach", content: bridge }] : []),
        {
          role: "coach",
          content:
            mode === "before"
              ? "Here’s the setup read. Use it like a small handrail, not a full report."
              : "Here’s the more accurate read before your brain turns this into a personality verdict.",
        },
      ]);
      setSummary(finalSummary);
    }
  }

  function reset() {
    setMode(null);
    setStepIndex(0);
    setAnswers({});
    setInput("");
    setSummary(null);
    setCopied(false);
    setMessages(initialMessages());
  }

  async function copySummary() {
    if (!summary?.copyText) return;
    try {
      await navigator.clipboard.writeText(summary.copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const progress = useMemo(() => {
    if (!mode) return 0;
    return Math.round(((stepIndex + (summary ? 1 : 0)) / steps.length) * 100);
  }, [mode, stepIndex, steps.length, summary]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-4">
          <Card className="rounded-2xl shadow-sm border-slate-200">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-slate-900 text-white grid place-items-center shadow-sm">
                  <HeartHandshake size={22} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Environment Audit Coach</h1>
                  <p className="text-sm text-slate-500">{COACH.style}: {COACH.tagline}</p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {AI_MODEL_PREVIEW.status}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm leading-relaxed text-slate-600">
                <p>
                  Use this before interviews, exams, dates, presentations, or group work. It helps separate performance from the room, people, rules, and your state on the day.
                </p>
                <p className="font-medium text-slate-800">{COACH.principle}</p>
                <p className="text-xs rounded-2xl bg-white border border-slate-200 p-3 text-slate-600">
                  In the real AI version, this would not follow a fixed script. The model would read your answer, decide whether to ask a follow-up, and generate a tailored coaching response.
                </p>
              </div>

              <div className="grid gap-2">
                <Button
                  onClick={() => beginMode("before")}
                  className={`justify-between rounded-2xl py-6 ${mode === "before" ? "bg-slate-900" : ""}`}
                >
                  <span className="flex items-center gap-2"><ShieldCheck size={18} /> Before Event</span>
                  <ArrowRight size={18} />
                </Button>
                <Button
                  onClick={() => beginMode("after")}
                  variant={mode === "after" ? "default" : "outline"}
                  className="justify-between rounded-2xl py-6"
                >
                  <span className="flex items-center gap-2"><Sparkles size={18} /> After Event</span>
                  <ArrowRight size={18} />
                </Button>
              </div>

              {mode && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{mode === "before" ? "Fast setup scan" : "Reattribution reset"}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-slate-900 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <Button onClick={reset} variant="ghost" className="w-full rounded-2xl gap-2">
                <RotateCcw size={16} /> Reset
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border-slate-200">
            <CardContent className="p-5 space-y-3">
              <div className="flex gap-2 items-center font-semibold">
                <Lightbulb size={18} /> Coach rules
              </div>
              <ul className="text-sm text-slate-600 space-y-2 leading-relaxed">
                <li>• One event is data, not a diagnosis.</li>
                <li>• Fix what you can before the event.</li>
                <li>• Afterward, split the outcome into controllables, setup, and state.</li>
                <li>• A bad setup is context, not a free pass.</li>
                <li>• Responsibility should create a next step, not a self-attack.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border-slate-200 bg-slate-950 text-white">
            <CardContent className="p-5 space-y-4">
              <div className="flex gap-2 items-center font-semibold">
                <Sparkles size={18} /> AI model layer
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{AI_MODEL_PREVIEW.modelRole}</p>
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold">Structured response</div>
                <div className="flex flex-wrap gap-2">
                  {AI_MODEL_PREVIEW.responseShape.map((item) => (
                    <span key={item} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-xs leading-relaxed text-slate-300">
                {AI_MODEL_PREVIEW.safety}
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="min-h-[760px] flex flex-col">
          <Card className="rounded-2xl shadow-sm border-slate-200 flex-1 flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Coach chat</h2>
                <p className="text-xs text-slate-500 mb-1">Model behaviour preview: adaptive questions + structured coaching cards</p>
                <p className="text-sm text-slate-500">
                  {mode ? (mode === "before" ? "Before Event mode" : "After Event mode") : "Choose a mode to begin"}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles size={14} /> AI-connected preview
              </div>
            </div>

            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-white to-slate-50">
              <AnimatePresence initial={false}>
                {messages.map((message, idx) => (
                  <motion.div
                    key={`${message.role}-${idx}-${message.content.slice(0, 10)}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${
                        message.role === "user"
                          ? "bg-slate-900 text-white rounded-br-md"
                          : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
                      }`}
                    >
                      {message.role === "coach" && (
                        <div className="mb-1 text-[11px] uppercase tracking-wide text-slate-400 font-semibold">AI coach</div>
                      )}
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      {message.helper && (
                        <p className="text-xs mt-2 leading-relaxed text-slate-500">{message.helper}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {summary && <SummaryCard summary={summary} copied={copied} onCopy={copySummary} />}
              <div ref={scrollRef} />
            </div>

            <div className="p-4 border-t border-slate-200 bg-white">
              {!mode ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  <Button onClick={() => beginMode("before")} className="rounded-2xl py-6 gap-2">
                    <ShieldCheck size={18} /> Start Before Event
                  </Button>
                  <Button onClick={() => beginMode("after")} variant="outline" className="rounded-2xl py-6 gap-2">
                    <Sparkles size={18} /> Start After Event
                  </Button>
                </div>
              ) : summary ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={() => beginMode(mode)} className="rounded-2xl gap-2">
                    <RotateCcw size={16} /> Run this mode again
                  </Button>
                  <Button onClick={reset} variant="outline" className="rounded-2xl">
                    Back to start
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        submitAnswer();
                      }
                    }}
                    placeholder="Type your answer..."
                    className="min-h-[52px] max-h-36 flex-1 resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                  <Button onClick={submitAnswer} className="rounded-2xl px-4" disabled={!input.trim()}>
                    <Send size={18} />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

function SummaryCard({ summary, copied, onCopy }) {
  const Icon = summary.icon || ClipboardCheck;
  const riskClasses = {
    green: "border-emerald-200 bg-emerald-50/60",
    yellow: "border-amber-200 bg-amber-50/60",
    red: "border-rose-200 bg-rose-50/60",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 shadow-sm ${riskClasses[summary.risk] || "border-slate-200 bg-white"}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 grid place-items-center shadow-sm">
            <Icon size={20} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Structured AI output</div>
            <h3 className="text-lg font-semibold">{summary.label}</h3>
            <p className="text-sm text-slate-600">
              {summary.mode === "before"
                ? "A quick read of the setup before you go in."
                : "A balanced read before self-blame takes over."}
            </p>
          </div>
        </div>
        <Button onClick={onCopy} variant="outline" size="sm" className="rounded-2xl gap-2 shrink-0">
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <div className="grid gap-3">
        {summary.sections.map((section, idx) => (
          <div key={`${section.title}-${idx}`} className="rounded-2xl bg-white/80 border border-white p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">{section.title}</div>
            <div className="text-sm md:text-base leading-relaxed text-slate-800">{section.body}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
