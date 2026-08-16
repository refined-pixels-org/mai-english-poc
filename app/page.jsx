"use client"

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Home, BookOpen, Headphones, PenTool, Mic, BarChart3, User, Search,
  Play, Pause, RotateCcw, Check, X, Flame, ChevronRight, ChevronLeft,
  Volume2, Clock, Award, ArrowRight, Menu, Bookmark, BookmarkCheck,
  RefreshCw, Square, Star, TrendingUp, Layers, Gauge, ChevronDown,
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

/* ============================================================
   DESIGN TOKENS
   Palette: ink #1D1A2E · bg #FAF9FC · surface #FFFFFF
   primary indigo #4338CA · secondary violet #7C3AED
   teal #0E9B8E (mastery) · amber #F2A63A (streak) · rose #E15B4D (errors)
   Display: Fraunces · Body/UI: Inter · Data/Bands: IBM Plex Mono
   Signature: the "Band Meter" — an IELTS 4.0→9.0 tick gauge reused
   across hero, dashboard and skill headers as the throughline motif.
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap');

.ielts-app { --ink:#1D1A2E; --ink-soft:#635E7A; --ink-faint:#9490A8;
  --bg:#FAF9FC; --surface:#FFFFFF; --border:#E7E3F3;
  --primary:#4338CA; --primary-dim:#EEEDFC; --primary-line:#D9D6F7;
  --secondary:#7C3AED; --teal:#0E9B8E; --teal-dim:#E4F5F3;
  --amber:#DE8F1F; --amber-dim:#FBF0DD; --rose:#D6503F; --rose-dim:#FBEAE7;
  font-family:'Inter',sans-serif; color:var(--ink); background:var(--bg);
  min-height:100vh; }
.ielts-app * { box-sizing:border-box; }
.f-display { font-family:'Fraunces',serif; }
.f-mono { font-family:'IBM Plex Mono',monospace; letter-spacing:-0.01em; }

.topnav { position:sticky; top:0; z-index:40; background:rgba(250,249,252,0.9); backdrop-filter:blur(10px); border-bottom:1px solid var(--border); }
.topnav-inner { max-width:1180px; margin:0 auto; padding:0 24px; height:64px; display:flex; align-items:center; justify-content:space-between; gap:24px; }
.brand { display:flex; align-items:center; gap:9px; font-weight:700; font-size:17px; cursor:pointer; }
.brand-mark { width:28px; height:28px; border-radius:8px; background:linear-gradient(135deg,var(--primary),var(--secondary)); display:flex; align-items:center; justify-content:center; color:#fff; font-family:'Fraunces',serif; font-weight:700; font-size:14px; flex-shrink:0; }
.navlinks { display:flex; align-items:center; gap:2px; }
.navlink { display:flex; align-items:center; gap:6px; padding:8px 12px; border-radius:8px; font-size:14px; font-weight:600; color:var(--ink-soft); cursor:pointer; border:none; background:none; transition:.15s; white-space:nowrap; }
.navlink:hover { background:var(--primary-dim); color:var(--primary); }
.navlink.active { background:var(--primary-dim); color:var(--primary); }
.navlink-icon-only { padding:8px; border-radius:8px; color:var(--ink-soft); cursor:pointer; border:none; background:none; display:flex; }
.navlink-icon-only:hover, .navlink-icon-only.active { background:var(--primary-dim); color:var(--primary); }

.page { max-width:1180px; margin:0 auto; padding:36px 24px 80px; }
.page-narrow { max-width:860px; margin:0 auto; padding:36px 24px 80px; }

/* Buttons */
.btn { font-family:'Inter',sans-serif; font-weight:600; font-size:14px; border-radius:10px; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:7px; transition:.15s; padding:11px 18px; }
.btn-primary { background:var(--ink); color:#fff; }
.btn-primary:hover { background:var(--primary); }
.btn-secondary { background:var(--surface); color:var(--ink); border:1.5px solid var(--border); }
.btn-secondary:hover { border-color:var(--primary); color:var(--primary); }
.btn-ghost { background:none; color:var(--ink-soft); padding:8px 12px; }
.btn-ghost:hover { color:var(--primary); }
.btn:disabled { opacity:.45; cursor:not-allowed; }
.btn-sm { padding:8px 13px; font-size:13px; }

/* Cards */
.card { background:var(--surface); border:1px solid var(--border); border-radius:16px; }
.card-pad { padding:22px; }
.card-hover { cursor:pointer; transition:.18s; }
.card-hover:hover { border-color:var(--primary-line); box-shadow:0 8px 24px -12px rgba(67,56,202,0.18); transform:translateY(-2px); }

/* Badges */
.badge { display:inline-flex; align-items:center; gap:5px; font-size:11.5px; font-weight:700; padding:4px 9px; border-radius:99px; text-transform:uppercase; letter-spacing:.04em; }
.badge-band { font-family:'IBM Plex Mono',monospace; background:var(--primary-dim); color:var(--primary); }
.badge-easy { background:var(--teal-dim); color:var(--teal); }
.badge-medium { background:var(--amber-dim); color:var(--amber); }
.badge-hard { background:var(--rose-dim); color:var(--rose); }
.badge-neutral { background:#F1EFF8; color:var(--ink-soft); }

/* Progress bars */
.pbar-track { height:8px; border-radius:99px; background:#EFEDF7; overflow:hidden; }
.pbar-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,var(--primary),var(--secondary)); }

/* Skill color accents */
.acc-writing { --skill:#4338CA; --skill-dim:#EEEDFC; }
.acc-reading { --skill:#0E9B8E; --skill-dim:#E4F5F3; }
.acc-listening { --skill:#7C3AED; --skill-dim:#F3ECFD; }
.acc-speaking { --skill:#DE8F1F; --skill-dim:#FBF0DD; }

.hero { padding:64px 0 40px; }
.hero-grid { display:grid; grid-template-columns:1.1fr 0.9fr; gap:48px; align-items:center; }
@media (max-width:860px) { .hero-grid { grid-template-columns:1fr; } .navlinks-labels { display:none; } }

.skillgrid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
@media (max-width:900px) { .skillgrid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:520px) { .skillgrid { grid-template-columns:1fr; } .hero { padding:40px 0 28px; } .topnav-inner { padding:0 16px; } .page { padding:24px 16px 64px; } }

.lesson-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
@media (max-width:900px) { .lesson-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:600px) { .lesson-grid { grid-template-columns:1fr; } }

.tabrow { display:flex; gap:4px; border-bottom:1.5px solid var(--border); margin-bottom:24px; overflow-x:auto; }
.tabbtn { padding:11px 4px; margin-right:22px; font-weight:700; font-size:14.5px; color:var(--ink-faint); background:none; border:none; border-bottom:2.5px solid transparent; cursor:pointer; white-space:nowrap; }
.tabbtn.active { color:var(--ink); border-color:var(--primary); }

.vocabword { color:var(--primary); font-weight:700; border-bottom:1.5px dotted var(--primary-line); cursor:pointer; }
.vocabword:hover { background:var(--primary-dim); }

.passage-text { font-size:16.5px; line-height:1.85; color:var(--ink); font-family:'Fraunces',serif; font-weight:500; }

.flashcard { background:linear-gradient(150deg,var(--primary) 0%,var(--secondary) 100%); border-radius:20px; color:#fff; padding:40px 32px; min-height:220px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; cursor:pointer; }

.chip { padding:8px 14px; border-radius:99px; border:1.5px solid var(--border); font-size:13px; font-weight:600; color:var(--ink-soft); background:var(--surface); cursor:pointer; white-space:nowrap; }
.chip.active { background:var(--ink); color:#fff; border-color:var(--ink); }

.gauge-tick-label { font-family:'IBM Plex Mono',monospace; font-size:10px; fill:var(--ink-faint); }
`;

/* ============================================================
   SAMPLE DATA
   ============================================================ */

const SKILLS = [
  { id:"writing", label:"Writing", icon:PenTool, blurb:"Task 1 & Task 2 essays, topic vocabulary, model structures.", progress:48, className:"acc-writing" },
  { id:"reading", label:"Reading", icon:BookOpen, blurb:"Passages with in-context vocabulary and answer explanations.", progress:72, className:"acc-reading" },
  { id:"listening", label:"Listening", icon:Headphones, blurb:"Dictation, note-taking and exam-style listening drills.", progress:65, className:"acc-listening" },
  { id:"speaking", label:"Speaking", icon:Mic, blurb:"Part 1–3 practice with cue cards and recorded feedback.", progress:55, className:"acc-speaking" },
];

const BAND_LEVELS = ["4.0–5.0","5.5–6.0","6.5–7.0","7.5–8.0+"];

const WRITING_TOPICS = [
  { id:"education", name:"Education", wordCount:64, essaysWritten:3 },
  { id:"environment", name:"Environment", wordCount:71, essaysWritten:2 },
  { id:"technology", name:"Technology", wordCount:58, essaysWritten:4 },
  { id:"health", name:"Health", wordCount:49, essaysWritten:1 },
  { id:"work", name:"Work", wordCount:52, essaysWritten:0 },
  { id:"society", name:"Society", wordCount:45, essaysWritten:0 },
  { id:"crime", name:"Crime", wordCount:38, essaysWritten:0 },
  { id:"government", name:"Government", wordCount:41, essaysWritten:0 },
  { id:"transportation", name:"Transportation", wordCount:33, essaysWritten:0 },
  { id:"globalization", name:"Globalization", wordCount:47, essaysWritten:0 },
];

// Fully populated vocab set for one topic (Education) across all four bands
const EDUCATION_VOCAB = {
  "4.0–5.0": [
    { word:"school", pos:"n.", vi:"trường học", def:"A place where children go to learn.", example:"Most children start school at age six.", collocations:["go to school","primary school"], synonyms:["institution"] },
    { word:"study", pos:"v.", vi:"học tập", def:"To spend time learning about a subject.", example:"She studies every evening after dinner.", collocations:["study hard","study for an exam"], synonyms:["learn"] },
    { word:"teacher", pos:"n.", vi:"giáo viên", def:"A person who helps students learn.", example:"Our teacher explained the lesson twice.", collocations:["strict teacher","class teacher"], synonyms:["instructor"] },
  ],
  "5.5–6.0": [
    { word:"curriculum", pos:"n.", vi:"chương trình học", def:"The subjects taught in a school or course.", example:"The new curriculum includes more practical skills.", collocations:["national curriculum","broad curriculum"], synonyms:["syllabus"] },
    { word:"academic performance", pos:"n. phrase", vi:"thành tích học tập", def:"How well a student does in their studies.", example:"Sleep quality can affect academic performance.", collocations:["improve academic performance","poor academic performance"], synonyms:["scholastic achievement"] },
    { word:"tuition fees", pos:"n.", vi:"học phí", def:"Money paid for instruction, especially at university.", example:"Tuition fees have risen sharply this decade.", collocations:["pay tuition fees","rising tuition fees"], synonyms:["school fees"] },
  ],
  "6.5–7.0": [
    { word:"rote learning", pos:"n. phrase", vi:"học vẹt", def:"Memorising facts through repetition rather than understanding.", example:"Critics argue rote learning discourages creativity.", collocations:["rely on rote learning","move away from rote learning"], synonyms:["memorisation"] },
    { word:"extracurricular activities", pos:"n. phrase", vi:"hoạt động ngoại khóa", def:"Activities outside the standard curriculum.", example:"Extracurricular activities help students build soft skills.", collocations:["engage in extracurricular activities"], synonyms:["after-school activities"] },
    { word:"streamline (education)", pos:"v.", vi:"tinh giản, hợp lý hóa", def:"To make a system more efficient by simplifying it.", example:"The ministry aims to streamline the admissions process.", collocations:["streamline the syllabus"], synonyms:["simplify"] },
  ],
  "7.5–8.0+": [
    { word:"pedagogical approach", pos:"n. phrase", vi:"phương pháp sư phạm", def:"A particular method or philosophy of teaching.", example:"A student-centred pedagogical approach tends to boost engagement.", collocations:["adopt a pedagogical approach"], synonyms:["teaching methodology"] },
    { word:"meritocratic", pos:"adj.", vi:"trọng dụng nhân tài", def:"Based on ability and achievement rather than wealth or class.", example:"Supporters claim standardised testing makes admissions more meritocratic.", collocations:["meritocratic system"], synonyms:["merit-based"] },
    { word:"disparities in access", pos:"n. phrase", vi:"sự chênh lệch trong tiếp cận", def:"Unequal opportunities to obtain something, e.g. education.", example:"Rural areas still face disparities in access to quality schooling.", collocations:["widen disparities in access","address disparities in access"], synonyms:["access gaps"] },
  ],
};

const STRUCTURES = [
  { title:"Task 2 Opinion Essay Opener", text:"While some people believe that ___, others argue that ___. This essay will discuss both perspectives before concluding with my own view." },
  { title:"Cause–Effect Linker", text:"One of the primary reasons for this is ___, which in turn leads to ___." },
  { title:"Task 1 Overview Sentence", text:"Overall, it is clear that ___ experienced the most significant change, while ___ remained comparatively stable." },
];

const READING_LESSONS = [
  { id:"climate-cities", title:"Climate Change and Modern Cities", topic:"Environment", difficulty:"Intermediate", time:12, vocabBand:"6.0–7.0", completion:0 },
  { id:"gig-economy", title:"The Rise of the Gig Economy", topic:"Work", difficulty:"Upper-Intermediate", time:14, vocabBand:"6.5–7.5", completion:65 },
  { id:"memory-science", title:"How Memory Really Works", topic:"Health", difficulty:"Advanced", time:16, vocabBand:"7.0–8.0", completion:0 },
  { id:"urban-farming", title:"Urban Farming Movements", topic:"Environment", difficulty:"Beginner", time:8, vocabBand:"4.5–5.5", completion:100 },
  { id:"ai-workplace", title:"Artificial Intelligence in the Workplace", topic:"Technology", difficulty:"Advanced", time:15, vocabBand:"7.0–8.0+", completion:20 },
  { id:"migration-patterns", title:"Global Migration Patterns", topic:"Society", difficulty:"Intermediate", time:11, vocabBand:"6.0–6.5", completion:0 },
];

const CLIMATE_PASSAGE = [
  "Cities generate over seventy percent of global carbon emissions, yet they occupy only a small fraction of the Earth's land surface. This ",
  {w:"paradox", def:"a statement or situation that seems contradictory but may be true", vi:"nghịch lý", pos:"n.", pron:"/ˈpærədɒks/"},
  " has pushed urban planners to rethink how modern cities are designed. Traditional infrastructure, built decades ago without climate concerns in mind, is proving increasingly ",
  {w:"inadequate", def:"not enough or not good enough for a purpose", vi:"không đủ, không thỏa đáng", pos:"adj.", pron:"/ɪnˈædɪkwət/"},
  " for handling extreme weather events such as flash floods and heatwaves.",
  "\n\nIn response, a growing number of cities have adopted what planners call 'green infrastructure' — an approach that integrates natural systems, such as rain gardens and urban forests, directly into the built environment. Proponents argue this strategy is far more ",
  {w:"resilient", def:"able to recover quickly from difficulties", vi:"có khả năng phục hồi", pos:"adj.", pron:"/rɪˈzɪliənt/"},
  " than concrete-based flood defences alone, since vegetation can absorb excess rainfall while simultaneously cooling the surrounding air.",
  "\n\nCritics, however, caution that green infrastructure requires significant upfront investment and long-term maintenance, and that without careful planning it risks becoming a ",
  {w:"cosmetic", def:"affecting only the appearance of something, not its substance", vi:"mang tính hình thức, bề ngoài", pos:"adj.", pron:"/kɒzˈmetɪk/"},
  " gesture rather than a genuine solution. Whether cities can scale these interventions quickly enough remains an open question."
];

const READING_QUESTIONS = [
  { q:"According to the passage, cities are responsible for what share of global emissions?", options:["Under 30%","Around 50%","Over 70%","Nearly 100%"], answer:2, explain:"The first sentence states cities generate over seventy percent of global carbon emissions." },
  { q:"What is 'green infrastructure' as described in the passage?", options:["A tax on emissions","Natural systems integrated into the built environment","A ban on concrete construction","A new type of public transport"], answer:1, explain:"Paragraph 2 defines it as an approach integrating natural systems like rain gardens and urban forests into the built environment." },
  { q:"What concern do critics raise about green infrastructure?", options:["It increases flooding","It requires high upfront cost and upkeep","It is illegal in most cities","It only works in rural areas"], answer:1, explain:"Paragraph 3 notes critics caution about significant upfront investment and long-term maintenance." },
];

const LISTENING_DICTATION = [
  { id:1, difficulty:"Easy", transcript:"The museum opens at nine o'clock every morning except Monday." },
  { id:2, difficulty:"Medium", transcript:"Applicants must submit their forms before the end of the month to be considered." },
  { id:3, difficulty:"Hard", transcript:"Despite the forecast, the outdoor exhibition will proceed as scheduled unless conditions worsen significantly." },
  { id:4, difficulty:"IELTS", transcript:"Candidates are advised that the listening section consists of four parts, each with ten questions." },
];

const NOTETAKING_LEVELS = [
  { level:1, title:"Booking a Table", desc:"Short sentences, basic information.", keywords:["7:30 PM","table for four","window seat"] },
  { level:2, title:"Planning a Trip", desc:"Short conversation, important keywords.", keywords:["departure 8 AM","two connecting flights","hotel near station"] },
  { level:3, title:"Course Enrolment Call", desc:"Longer conversation, multiple pieces of information.", keywords:["enrolment deadline","scholarship criteria","required documents","payment plan"] },
  { level:4, title:"Lecture: Urban Ecology", desc:"Academic lecture, complex information.", keywords:["biodiversity index","habitat fragmentation","case study: Singapore","research gap"] },
];

const LISTENING_PRACTICE = [
  { id:"lp1", title:"Airport Announcements", type:"Multiple Choice", band:"5.0–5.5", difficulty:"Easy" },
  { id:"lp2", title:"University Orientation Talk", type:"Fill in the Blanks", band:"6.0–6.5", difficulty:"Medium" },
  { id:"lp3", title:"Workplace Meeting", type:"Matching", band:"6.5–7.0", difficulty:"Medium" },
  { id:"lp4", title:"Academic Lecture: Oceanography", type:"Summary Completion", band:"7.0–7.5", difficulty:"Hard" },
];

const SPEAKING_PART1_TOPICS = [
  { id:"hometown", name:"Hometown" }, { id:"family", name:"Family" }, { id:"work", name:"Work" },
  { id:"study", name:"Study" }, { id:"hobbies", name:"Hobbies" }, { id:"food", name:"Food" },
  { id:"travel", name:"Travel" }, { id:"routine", name:"Daily Routine" },
];

const HOMETOWN_CONTENT = {
  question:"Can you describe the place where you grew up?",
  vocab: {
    "4–5": [{ phrase:"a small town", note:"basic description" }, { phrase:"quiet and peaceful", note:"basic description" }],
    "5.5–6": [{ phrase:"a close-knit community", note:"social atmosphere" }, { phrase:"well-connected by public transport", note:"infrastructure" }],
    "6.5–7": [{ phrase:"steeped in history", note:"cultural depth" }, { phrase:"undergone rapid urbanisation", note:"change over time" }],
    "7.5–8+": [{ phrase:"a melting pot of cultures", note:"diversity, idiomatic" }, { phrase:"retained its old-world charm", note:"nuanced description" }],
  },
  sample:"I grew up in a mid-sized town that's steeped in history, with a old quarter that's retained its old-world charm even as the outskirts have undergone rapid urbanisation.",
  mistakes:["Confusing 'hometown' with 'homeland'","Overusing 'nice' and 'beautiful' without specifics"],
};

const CUE_CARDS = [
  {
    id:"memorable-trip", title:"Describe a memorable trip you have taken",
    bullets:["Where you went","Who you went with","What you did there","And explain why it was memorable"],
    vocab:["breathtaking scenery","off the beaten track","an unforgettable experience","immersed myself in the local culture"],
    ideas:["A spontaneous road trip","A cultural exchange abroad","A trip that didn't go as planned"],
    sample:"One trip that stands out was a road trip along the coast with two close friends. We had no fixed itinerary, which meant we could stop wherever the scenery was breathtaking...",
    part3:[
      "Why do people like travelling?", "How has tourism changed in the last twenty years?",
      "Is international tourism always beneficial for a country?", "What impact does tourism have on local communities?",
    ],
  },
];

const VOCAB_MY_LIST = [
  { word:"resilient", meaning:"có khả năng phục hồi", pron:"/rɪˈzɪliənt/", example:"The system proved resilient under pressure.", source:"Reading", skill:"reading", topic:"Environment", difficulty:"6.5–7.0", status:"Learning" },
  { word:"rote learning", meaning:"học vẹt", pron:"/rəʊt ˈlɜːnɪŋ/", example:"Rote learning rarely builds deep understanding.", source:"Writing – Education", skill:"writing", topic:"Education", difficulty:"6.5–7.0", status:"New" },
  { word:"a melting pot of cultures", meaning:"nơi hội tụ nhiều nền văn hóa", pron:"—", example:"The city is a melting pot of cultures.", source:"Speaking – Hometown", skill:"speaking", topic:"Hometown", difficulty:"7.5–8.0+", status:"Familiar" },
  { word:"paradox", meaning:"nghịch lý", pron:"/ˈpærədɒks/", example:"It's a paradox that cities cause so much pollution yet cover so little land.", source:"Reading", skill:"reading", topic:"Environment", difficulty:"7.0–7.5", status:"Mastered" },
  { word:"tuition fees", meaning:"học phí", pron:"/tjuˈɪʃn fiːz/", example:"Tuition fees rose again this year.", source:"Writing – Education", skill:"writing", topic:"Education", difficulty:"5.5–6.0", status:"Mastered" },
  { word:"curriculum", meaning:"chương trình học", pron:"/kəˈrɪkjʊləm/", example:"The school revised its curriculum.", source:"Writing – Education", skill:"writing", topic:"Education", difficulty:"5.5–6.0", status:"Learning" },
];

const RECENT_ACTIVITY = [
  { label:"Completed Reading: Urban Farming Movements", time:"Today, 8:12 AM", tag:"reading" },
  { label:"Practised 24 vocabulary flashcards", time:"Today, 7:50 AM", tag:"vocab" },
  { label:"Dictation set — Medium difficulty (3/4 correct)", time:"Yesterday", tag:"listening" },
  { label:"Recorded Speaking Part 2 — Memorable Trip", time:"2 days ago", tag:"speaking" },
  { label:"Wrote Task 2 essay draft — Technology", time:"3 days ago", tag:"writing" },
];

/* ============================================================
   SMALL REUSABLE COMPONENTS
   ============================================================ */

function DifficultyBadge({ level }) {
  const map = { Easy:"badge-easy", Beginner:"badge-easy", Medium:"badge-medium", Intermediate:"badge-medium",
    "Upper-Intermediate":"badge-medium", Hard:"badge-hard", Advanced:"badge-hard", IELTS:"badge-hard" };
  return <span className={`badge ${map[level] || "badge-neutral"}`}>{level}</span>;
}

function BandBadge({ children }) {
  return <span className="badge badge-band"><Gauge size={11} strokeWidth={2.5}/>Band {children}</span>;
}

function ProgressBar({ value, colorVar }) {
  return (
    <div className="pbar-track">
      <div className="pbar-fill" style={{ width:`${value}%`, ...(colorVar ? { background:colorVar } : {}) }} />
    </div>
  );
}

// Signature element: IELTS band gauge (4.0 -> 9.0)
function BandMeter({ value = 6.5, size = "lg" }) {
  const min = 4, max = 9;
  const pct = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const w = size === "lg" ? 420 : 260;
  const h = size === "lg" ? 100 : 66;
  const trackY = size === "lg" ? 52 : 34;
  const ticks = [4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxWidth:w }}>
      <line x1="6" y1={trackY} x2={w-6} y2={trackY} stroke="#E7E3F3" strokeWidth="6" strokeLinecap="round" />
      <line x1="6" y1={trackY} x2={6 + pct*(w-12)} y2={trackY} stroke="url(#bandGrad)" strokeWidth="6" strokeLinecap="round" />
      <defs>
        <linearGradient id="bandGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4338CA" /><stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      {ticks.map((t,i) => {
        const x = 6 + ((t-min)/(max-min))*(w-12);
        const major = t % 1 === 0;
        return (
          <g key={i}>
            <line x1={x} y1={trackY-(major?9:5)} x2={x} y2={trackY+(major?9:5)} stroke={major ? "#B7B2D6" : "#DAD6ED"} strokeWidth="1.5" />
            {major && <text x={x} y={trackY+22} textAnchor="middle" className="gauge-tick-label">{t.toFixed(1)}</text>}
          </g>
        );
      })}
      <circle cx={6 + pct*(w-12)} cy={trackY} r={size==="lg"?9:7} fill="#1D1A2E" stroke="#fff" strokeWidth="3" />
      <text x={6 + pct*(w-12)} y={trackY - (size==="lg"?18:14)} textAnchor="middle" className="f-mono" fontSize={size==="lg"?20:15} fontWeight="600" fill="#1D1A2E">{value.toFixed(1)}</text>
    </svg>
  );
}

function Section({ eyebrow, title, subtitle, children, right }) {
  return (
    <div style={{ marginBottom:32 }}>
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:12 }}>
        <div>
          {eyebrow && <div className="f-mono" style={{ fontSize:12, fontWeight:600, color:"var(--primary)", marginBottom:6, letterSpacing:".04em" }}>{eyebrow}</div>}
          <h2 className="f-display" style={{ fontSize:24, fontWeight:600, margin:0 }}>{title}</h2>
          {subtitle && <p style={{ color:"var(--ink-soft)", fontSize:14.5, marginTop:6, maxWidth:560 }}>{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function VocabRow({ item, saved, onToggleSave }) {
  return (
    <div className="card card-pad" style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:10, flexWrap:"wrap" }}>
          <span className="f-display" style={{ fontSize:19, fontWeight:600 }}>{item.word}</span>
          <span style={{ fontSize:12.5, color:"var(--ink-faint)", fontStyle:"italic" }}>{item.pos}</span>
          <span className="badge badge-neutral">{item.vi}</span>
        </div>
        <p style={{ fontSize:14, color:"var(--ink-soft)", margin:"8px 0 4px" }}>{item.def}</p>
        <p style={{ fontSize:13.5, color:"var(--ink)", background:"var(--primary-dim)", padding:"7px 10px", borderRadius:8, margin:"6px 0" }}>"{item.example}"</p>
        {item.collocations && (
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>
            {item.collocations.map((c,i)=><span key={i} className="badge badge-neutral">{c}</span>)}
            {item.synonyms?.map((s,i)=><span key={"s"+i} className="badge" style={{ background:"var(--teal-dim)", color:"var(--teal)" }}>≈ {s}</span>)}
          </div>
        )}
      </div>
      <button className="btn-ghost" onClick={onToggleSave} style={{ border:"none", background:"none", cursor:"pointer", color: saved ? "var(--primary)" : "var(--ink-faint)" }} aria-label="Save word">
        {saved ? <BookmarkCheck size={20}/> : <Bookmark size={20}/>}
      </button>
    </div>
  );
}

/* ============================================================
   HOME PAGE
   ============================================================ */

function HomePage({ go }) {
  return (
    <div className="page">
      <div className="hero">
        <div className="hero-grid">
          <div>
            <div className="f-mono" style={{ fontSize:12.5, fontWeight:600, color:"var(--primary)", marginBottom:14, letterSpacing:".04em" }}>IELTS 4.0 → 9.0 · WRITING · LISTENING · READING · SPEAKING</div>
            <h1 className="f-display" style={{ fontSize:"clamp(34px,5vw,54px)", fontWeight:600, lineHeight:1.05, margin:0 }}>
              Build Better English,<br/>One Skill at a Time.
            </h1>
            <p style={{ fontSize:17, color:"var(--ink-soft)", maxWidth:460, marginTop:18, lineHeight:1.6 }}>
              Practice Reading, Listening, Writing, and Speaking with structured lessons, in-context vocabulary, and a dashboard that tracks your real progress toward your target band.
            </p>
            <div style={{ display:"flex", gap:12, marginTop:28, flexWrap:"wrap" }}>
              <button className="btn btn-primary" onClick={()=>go("writing")}>Start Learning <ArrowRight size={16}/></button>
              <button className="btn btn-secondary" onClick={()=>go("reading")}>Explore Lessons</button>
            </div>
          </div>
          <div className="card card-pad" style={{ background:"linear-gradient(160deg,#fff,#F5F3FE)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{ fontSize:13, fontWeight:700, color:"var(--ink-soft)" }}>Your estimated level</span>
              <span className="badge badge-band">Overall</span>
            </div>
            <BandMeter value={6.5} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:20 }}>
              {SKILLS.map(s=>(
                <div key={s.id} className={s.className} style={{ background:"var(--skill-dim)", borderRadius:12, padding:"10px 12px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12.5, fontWeight:700, color:"var(--skill)" }}>
                    <s.icon size={14}/> {s.label}
                  </div>
                  <div className="f-mono" style={{ fontSize:20, fontWeight:600, marginTop:2 }}>{s.progress}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Section eyebrow="Four Skills" title="Pick a skill to practice" subtitle="Every skill follows the same structure — lessons, in-context vocabulary, and clear difficulty levels from Band 4.0 to 8.0+.">
        <div className="skillgrid">
          {SKILLS.map(s=>(
            <div key={s.id} className={`card card-pad card-hover ${s.className}`} onClick={()=>go(s.id)}>
              <div style={{ width:40, height:40, borderRadius:10, background:"var(--skill-dim)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--skill)", marginBottom:14 }}>
                <s.icon size={20}/>
              </div>
              <h3 className="f-display" style={{ fontSize:18, fontWeight:600, margin:"0 0 6px" }}>{s.label}</h3>
              <p style={{ fontSize:13.5, color:"var(--ink-soft)", margin:"0 0 16px", lineHeight:1.5 }}>{s.blurb}</p>
              <ProgressBar value={s.progress} colorVar="var(--skill)" />
              <div style={{ fontSize:12, color:"var(--ink-faint)", marginTop:6 }} className="f-mono">{s.progress}% complete</div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Recommended Next" title="Your current level: Band 6.0" subtitle="A short path to move toward Band 6.5, based on your recent activity.">
        <div className="card card-pad">
          {["Learn 20 vocabulary words","Complete 1 reading lesson","Complete 10 minutes of listening dictation","Practice Speaking Part 2","Write one Task 2 essay"].map((step,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"11px 0", borderBottom: i<4 ? "1px solid var(--border)" : "none" }}>
              <div className="f-mono" style={{ width:26, height:26, borderRadius:99, background:"var(--primary-dim)", color:"var(--primary)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>{i+1}</div>
              <span style={{ fontSize:14.5, fontWeight:500 }}>{step}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Vocabulary System" title="One vocabulary bank, four skills" subtitle="Every word you meet in a reading passage, essay topic, or speaking cue card is saved to a single spaced-repetition bank.">
        <div className="card card-pad" style={{ display:"flex", gap:24, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ flex:1, minWidth:200 }}>
            <div className="f-mono" style={{ fontSize:32, fontWeight:600 }}>1,240</div>
            <div style={{ fontSize:13.5, color:"var(--ink-soft)" }}>words saved across all skills</div>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {["New","Learning","Familiar","Mastered"].map(s=><span key={s} className="badge badge-neutral">{s}</span>)}
          </div>
          <button className="btn btn-secondary" onClick={()=>go("vocabulary")}>Open My Vocabulary <ChevronRight size={15}/></button>
        </div>
      </Section>

      <Section eyebrow="Featured Lessons" title="Jump back in" right={<button className="btn-ghost" onClick={()=>go("reading")} style={{ display:"flex", alignItems:"center", gap:4, cursor:"pointer" }}>See all <ChevronRight size={14}/></button>}>
        <div className="lesson-grid">
          {READING_LESSONS.slice(0,3).map(l=>(
            <div key={l.id} className="card card-pad card-hover" onClick={()=>go("reading",{lesson:l.id})}>
              <DifficultyBadge level={l.difficulty}/>
              <h4 className="f-display" style={{ fontSize:16.5, fontWeight:600, margin:"10px 0 6px" }}>{l.title}</h4>
              <div style={{ fontSize:12.5, color:"var(--ink-faint)", display:"flex", gap:12 }}>
                <span style={{ display:"flex", alignItems:"center", gap:4 }}><Clock size={12}/>{l.time} min</span>
                <span>Band {l.vocabBand}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ============================================================
   WRITING
   ============================================================ */

function WritingSection({ nav, go }) {
  const view = nav.view || "dashboard";
  if (view === "topic") return <WritingTopic topicId={nav.topic} go={go} />;
  return (
    <div className="page">
      <Section eyebrow="Writing" title="Writing Dashboard" subtitle="IELTS-style Task 1 and Task 2 practice, organised by topic vocabulary and structure.">
        <div className="lesson-grid" style={{ marginBottom:28 }}>
          <div className="card card-pad">
            <div style={{ display:"flex", alignItems:"center", gap:8, color:"var(--primary)", fontWeight:700, fontSize:13.5 }}><PenTool size={16}/>Task 1</div>
            <p style={{ fontSize:13, color:"var(--ink-soft)", margin:"8px 0 14px" }}>Describe graphs, charts, maps or processes in 150+ words.</p>
            <button className="btn btn-secondary btn-sm">Practice Task 1</button>
          </div>
          <div className="card card-pad">
            <div style={{ display:"flex", alignItems:"center", gap:8, color:"var(--primary)", fontWeight:700, fontSize:13.5 }}><PenTool size={16}/>Task 2</div>
            <p style={{ fontSize:13, color:"var(--ink-soft)", margin:"8px 0 14px" }}>Argumentative essays in 250+ words on a range of topics.</p>
            <button className="btn btn-secondary btn-sm">Practice Task 2</button>
          </div>
          <div className="card card-pad">
            <div style={{ display:"flex", alignItems:"center", gap:8, color:"var(--primary)", fontWeight:700, fontSize:13.5 }}><Clock size={16}/>Practice History</div>
            <p style={{ fontSize:13, color:"var(--ink-soft)", margin:"8px 0 14px" }}>10 essays written · last one 3 days ago.</p>
            <button className="btn btn-secondary btn-sm">View history</button>
          </div>
        </div>
      </Section>

      <Section eyebrow="Topics" title="Vocabulary by topic" subtitle="Each topic has its own vocabulary set across four band levels — from 4.0 to 8.0+.">
        <div className="lesson-grid">
          {WRITING_TOPICS.map(t=>(
            <div key={t.id} className="card card-pad card-hover" onClick={()=>go("writing",{view:"topic",topic:t.id})}>
              <h4 className="f-display" style={{ fontSize:17, fontWeight:600, margin:"0 0 8px" }}>{t.name}</h4>
              <div style={{ fontSize:12.5, color:"var(--ink-faint)", display:"flex", gap:14 }}>
                <span>{t.wordCount} words</span>
                <span>{t.essaysWritten} essays written</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Structures" title="Useful structures and phrases">
        <div className="lesson-grid">
          {STRUCTURES.map((s,i)=>(
            <div key={i} className="card card-pad">
              <div style={{ fontSize:12.5, fontWeight:700, color:"var(--primary)", marginBottom:8 }}>{s.title}</div>
              <p style={{ fontSize:13.5, color:"var(--ink-soft)", lineHeight:1.55 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function WritingTopic({ topicId, go }) {
  const topic = WRITING_TOPICS.find(t=>t.id===topicId) || WRITING_TOPICS[0];
  const [band, setBand] = useState(BAND_LEVELS[1]);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const isEducation = topicId === "education";
  const words = isEducation ? EDUCATION_VOCAB[band] : sampleVocabFallback(topic.name, band);

  return (
    <div className="page">
      <button className="btn-ghost" style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:4, marginBottom:14 }} onClick={()=>go("writing")}><ChevronLeft size={15}/>Writing</button>
      <Section eyebrow="Writing · Topic" title={topic.name} subtitle={`${topic.wordCount} vocabulary items across four band levels.`}
        right={<button className="btn btn-primary btn-sm" onClick={()=>setPracticeOpen(true)}><Layers size={15}/>Practice Vocabulary</button>}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
          {BAND_LEVELS.map(b=>(
            <button key={b} className={`chip ${band===b?"active":""}`} onClick={()=>setBand(b)}>Band {b}</button>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {words.map((w,i)=><VocabRow key={i} item={w} saved={i%3===0} onToggleSave={()=>{}} />)}
        </div>
      </Section>
      {practiceOpen && <FlashcardModal words={words} onClose={()=>setPracticeOpen(false)} />}
    </div>
  );
}

function sampleVocabFallback(topicName, band) {
  // Lightweight generated placeholders for topics not yet fully authored, kept consistent in shape.
  const seeds = {
    "4.0–5.0":["basic issue","common problem","simple solution"],
    "5.5–6.0":["significant impact","growing concern","practical measure"],
    "6.5–7.0":["underlying factor","long-term consequence","policy intervention"],
    "7.5–8.0+":["multifaceted phenomenon","systemic imbalance","far-reaching implications"],
  };
  return seeds[band].map(word => ({
    word, pos:"phrase", vi:"(bản dịch mẫu)", def:`A phrase commonly used when discussing ${topicName.toLowerCase()} at this band level.`,
    example:`This is especially relevant when discussing ${topicName.toLowerCase()} in an essay.`,
    collocations:[`${word} of ${topicName.toLowerCase()}`], synonyms:["related term"],
  }));
}

function FlashcardModal({ words, onClose }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState("flashcards");
  const w = words[i % words.length];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(29,26,46,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:60, padding:20 }} onClick={onClose}>
      <div className="card" style={{ width:"100%", maxWidth:480, padding:24 }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ display:"flex", gap:6 }}>
            <button className={`chip ${mode==="flashcards"?"active":""}`} onClick={()=>setMode("flashcards")}>Flashcards</button>
            <button className={`chip ${mode==="quiz"?"active":""}`} onClick={()=>setMode("quiz")}>Quiz</button>
          </div>
          <button className="btn-ghost" style={{ cursor:"pointer" }} onClick={onClose}><X size={18}/></button>
        </div>
        {mode === "flashcards" ? (
          <>
            <div className="flashcard" onClick={()=>setFlipped(f=>!f)}>
              {!flipped ? (
                <div className="f-display" style={{ fontSize:28, fontWeight:600 }}>{w.word}</div>
              ) : (
                <div>
                  <div style={{ fontSize:13, opacity:.85, marginBottom:6 }}>{w.vi} · {w.pos}</div>
                  <div style={{ fontSize:15, lineHeight:1.5 }}>{w.def}</div>
                </div>
              )}
              <div style={{ fontSize:11.5, opacity:.75, marginTop:16 }}>Tap card to flip</div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:16 }}>
              <button className="btn btn-secondary btn-sm" onClick={()=>{setFlipped(false); setI(v=>(v-1+words.length)%words.length);}}><ChevronLeft size={15}/>Prev</button>
              <span className="f-mono" style={{ fontSize:12.5, color:"var(--ink-faint)", alignSelf:"center" }}>{i%words.length+1} / {words.length}</span>
              <button className="btn btn-primary btn-sm" onClick={()=>{setFlipped(false); setI(v=>(v+1)%words.length);}}>Next<ChevronRight size={15}/></button>
            </div>
          </>
        ) : <QuizMini words={words} />}
      </div>
    </div>
  );
}

function QuizMini({ words }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const w = words[i % words.length];
  const options = useMemo(()=>{
    const distractors = words.filter(x=>x.word!==w.word).map(x=>x.def).slice(0,3);
    const arr = [w.def, ...distractors];
    return arr.sort(()=>Math.random()-0.5);
  },[i]);
  return (
    <div>
      <div style={{ fontSize:13, color:"var(--ink-soft)", marginBottom:8 }}>Which definition matches:</div>
      <div className="f-display" style={{ fontSize:22, fontWeight:600, marginBottom:14 }}>{w.word}</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {options.map((opt,idx)=>{
          const correct = opt === w.def;
          const show = picked !== null;
          return (
            <button key={idx} onClick={()=>setPicked(idx)} className="btn-secondary" style={{ textAlign:"left", padding:"10px 12px", borderRadius:10, fontSize:13.5, fontWeight:500,
              borderColor: show && correct ? "var(--teal)" : show && picked===idx ? "var(--rose)" : "var(--border)",
              background: show && correct ? "var(--teal-dim)" : show && picked===idx ? "var(--rose-dim)" : "var(--surface)" }}>
              {opt}
            </button>
          );
        })}
      </div>
      <button className="btn btn-primary btn-sm" style={{ marginTop:14 }} onClick={()=>{setPicked(null); setI(v=>(v+1)%words.length);}}>Next word <ChevronRight size={15}/></button>
    </div>
  );
}

/* ============================================================
   READING
   ============================================================ */

function ReadingSection({ nav, go }) {
  if (nav.lesson) return <ReadingLesson lessonId={nav.lesson} go={go} />;
  return (
    <div className="page">
      <Section eyebrow="Reading" title="Reading Dashboard" subtitle="Passages paired with in-context vocabulary, comprehension questions, and explanations.">
        <div className="lesson-grid">
          {READING_LESSONS.map(l=>(
            <div key={l.id} className="card card-pad card-hover" onClick={()=>go("reading",{lesson:l.id})}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <DifficultyBadge level={l.difficulty}/>
                {l.completion === 100 && <span className="badge" style={{ background:"var(--teal-dim)", color:"var(--teal)" }}><Check size={11}/>Done</span>}
              </div>
              <h4 className="f-display" style={{ fontSize:17, fontWeight:600, margin:"12px 0 4px" }}>{l.title}</h4>
              <div style={{ fontSize:12.5, color:"var(--ink-faint)" }}>{l.topic}</div>
              <div style={{ fontSize:12.5, color:"var(--ink-faint)", display:"flex", gap:12, margin:"10px 0" }}>
                <span style={{ display:"flex", alignItems:"center", gap:4 }}><Clock size={12}/>{l.time} min</span>
                <span>Band {l.vocabBand}</span>
              </div>
              {l.completion > 0 && <ProgressBar value={l.completion} />}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function ReadingLesson({ lessonId, go }) {
  const lesson = READING_LESSONS.find(l=>l.id===lessonId) || READING_LESSONS[0];
  const isClimate = lessonId === "climate-cities";
  const passage = isClimate ? CLIMATE_PASSAGE : genericPassage(lesson.title);
  const questions = isClimate ? READING_QUESTIONS : genericQuestions(lesson.title);
  const [activeWord, setActiveWord] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted ? questions.filter((q,i)=>answers[i]===q.answer).length : null;

  return (
    <div className="page-narrow">
      <button className="btn-ghost" style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:4, marginBottom:14 }} onClick={()=>go("reading")}><ChevronLeft size={15}/>Reading</button>
      <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:8 }}>
        <DifficultyBadge level={lesson.difficulty} /><BandBadge>{lesson.vocabBand}</BandBadge>
        <span className="f-mono" style={{ fontSize:12, color:"var(--ink-faint)" }}>{lesson.time} min read</span>
      </div>
      <h1 className="f-display" style={{ fontSize:30, fontWeight:600, margin:"6px 0 20px" }}>{lesson.title}</h1>

      <div className="card card-pad" style={{ marginBottom:24 }}>
        <div className="passage-text">
          {passage.map((chunk,i)=>{
            if (typeof chunk === "string") return <span key={i}>{chunk.split("\n\n").map((p,j)=><React.Fragment key={j}>{j>0 && <><br/><br/></>}{p}</React.Fragment>)}</span>;
            return <span key={i} className="vocabword" onClick={()=>setActiveWord(chunk)}>{chunk.w}</span>;
          })}
        </div>
      </div>

      {activeWord && (
        <div className="card card-pad" style={{ marginBottom:24, borderColor:"var(--primary-line)", background:"var(--primary-dim)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
            <span className="f-display" style={{ fontSize:19, fontWeight:600 }}>{activeWord.w}</span>
            <button className="btn-ghost" style={{ cursor:"pointer" }} onClick={()=>setActiveWord(null)}><X size={16}/></button>
          </div>
          <div style={{ fontSize:12.5, color:"var(--ink-faint)", margin:"2px 0 8px" }}>{activeWord.pron} · {activeWord.pos} · {activeWord.vi}</div>
          <p style={{ fontSize:13.5 }}>{activeWord.def}</p>
        </div>
      )}

      <Section eyebrow="Comprehension" title="Questions">
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {questions.map((q,i)=>(
            <div key={i} className="card card-pad">
              <div style={{ fontWeight:600, fontSize:14.5, marginBottom:10 }}>{i+1}. {q.q}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {q.options.map((opt,oi)=>{
                  const chosen = answers[i]===oi;
                  const showResult = submitted;
                  const isCorrect = oi===q.answer;
                  return (
                    <button key={oi} disabled={submitted} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}
                      className="btn-secondary" style={{ textAlign:"left", padding:"9px 12px", fontSize:13.5, fontWeight:500,
                        borderColor: showResult && isCorrect ? "var(--teal)" : showResult && chosen ? "var(--rose)" : chosen ? "var(--primary)" : "var(--border)",
                        background: showResult && isCorrect ? "var(--teal-dim)" : showResult && chosen && !isCorrect ? "var(--rose-dim)" : chosen ? "var(--primary-dim)" : "var(--surface)" }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && <p style={{ fontSize:12.5, color:"var(--ink-soft)", marginTop:10, borderTop:"1px solid var(--border)", paddingTop:10 }}><strong>Explanation:</strong> {q.explain}</p>}
            </div>
          ))}
        </div>
        {!submitted ? (
          <button className="btn btn-primary" style={{ marginTop:18 }} onClick={()=>setSubmitted(true)} disabled={Object.keys(answers).length < questions.length}>Submit answers</button>
        ) : (
          <div className="card card-pad" style={{ marginTop:18, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:13, color:"var(--ink-soft)" }}>Your score</div>
              <div className="f-mono" style={{ fontSize:26, fontWeight:600 }}>{score} / {questions.length}</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={()=>{setSubmitted(false); setAnswers({});}}><RefreshCw size={14}/>Review mistakes</button>
          </div>
        )}
      </Section>
    </div>
  );
}

function genericPassage(title) {
  return [`This passage on "${title}" explores the key debates in the field, weighing practical `, {w:"implications", def:"likely effects or consequences of an action", vi:"hàm ý, tác động", pos:"n.", pron:"/ˌɪmplɪˈkeɪʃnz/"}, ` against long-standing assumptions. Researchers remain divided on how much weight to give short-term data versus long-term trends, and the debate continues to shape policy today.`];
}
function genericQuestions(title) {
  return [{ q:`What is the main focus of "${title}"?`, options:["A historical timeline","Key debates in the field","A biography","A product review"], answer:1, explain:"The passage opens by stating it explores the key debates in the field." }];
}

/* ============================================================
   LISTENING
   ============================================================ */

function ListeningSection({ nav, go }) {
  const [tab, setTab] = useState(nav.tab || "dictation");
  return (
    <div className="page">
      <Section eyebrow="Listening" title="Listening Dashboard" subtitle="Dictation, note-taking, and exam-style listening drills that scale from easy to IELTS level." />
      <div className="tabrow">
        {[["dictation","Dictation"],["notetaking","Note Taking"],["practice","Listening Practice"]].map(([id,label])=>(
          <button key={id} className={`tabbtn ${tab===id?"active":""}`} onClick={()=>setTab(id)}>{label}</button>
        ))}
      </div>
      {tab==="dictation" && <DictationPanel/>}
      {tab==="notetaking" && <NoteTakingPanel/>}
      {tab==="practice" && <ListeningPracticeList/>}
    </div>
  );
}

function DictationPanel() {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [slow, setSlow] = useState(false);
  const item = LISTENING_DICTATION[idx];

  const words = item.transcript.split(" ");
  const userWords = input.trim().split(/\s+/);

  const play = () => { setPlaying(true); setTimeout(()=>setPlaying(false), slow ? 2800 : 1600); };

  return (
    <div style={{ maxWidth:640 }}>
      <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        {LISTENING_DICTATION.map((d,i)=>(
          <button key={d.id} className={`chip ${idx===i?"active":""}`} onClick={()=>{setIdx(i); setInput(""); setChecked(false);}}>{d.difficulty}</button>
        ))}
      </div>
      <div className="card card-pad">
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
          <button className="btn btn-primary btn-sm" onClick={play}>{playing ? <Pause size={15}/> : <Play size={15}/>}{playing ? "Playing…" : "Play"}</button>
          <button className="btn btn-secondary btn-sm" onClick={play}><RotateCcw size={14}/>Replay</button>
          <button className={`chip ${slow?"active":""}`} onClick={()=>setSlow(s=>!s)}><Volume2 size={13} style={{marginRight:4}}/>Slow</button>
        </div>
        <div style={{ height:44, display:"flex", alignItems:"center", gap:3, marginBottom:18 }}>
          {Array.from({length:40}).map((_,i)=>(
            <div key={i} style={{ width:3, borderRadius:2, background: playing ? "var(--primary)" : "var(--border)",
              height: playing ? `${10+Math.abs(Math.sin(i*0.7+idx))*28}px` : "8px", transition:"height .2s" }} />
          ))}
        </div>
        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Type exactly what you hear…" rows={2}
          style={{ width:"100%", padding:12, borderRadius:10, border:"1.5px solid var(--border)", fontSize:14.5, fontFamily:"Inter", resize:"vertical" }} />
        <div style={{ display:"flex", gap:10, marginTop:12 }}>
          <button className="btn btn-primary btn-sm" onClick={()=>setChecked(true)} disabled={!input.trim()}><Check size={14}/>Check answer</button>
          <button className="btn btn-secondary btn-sm" onClick={()=>{setInput(""); setChecked(false);}}>Clear</button>
        </div>
        {checked && (
          <div style={{ marginTop:16, borderTop:"1px solid var(--border)", paddingTop:14 }}>
            <div style={{ fontSize:12.5, fontWeight:700, color:"var(--ink-soft)", marginBottom:6 }}>YOUR ANSWER (mistakes highlighted)</div>
            <p style={{ fontSize:14.5, lineHeight:1.7 }}>
              {userWords.map((w,i)=>{
                const correct = words[i] && w.toLowerCase().replace(/[.,]/g,"") === words[i].toLowerCase().replace(/[.,]/g,"");
                return <span key={i} style={{ background: correct ? "transparent" : "var(--rose-dim)", color: correct ? "inherit" : "var(--rose)", borderRadius:4, padding: correct ? 0 : "1px 3px", marginRight:4 }}>{w}</span>;
              })}
            </p>
            <div style={{ fontSize:12.5, fontWeight:700, color:"var(--ink-soft)", margin:"14px 0 6px" }}>CORRECT TRANSCRIPT</div>
            <p style={{ fontSize:14.5, lineHeight:1.7, color:"var(--teal)" }}>{item.transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function NoteTakingPanel() {
  const [openLevel, setOpenLevel] = useState(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {NOTETAKING_LEVELS.map(lv=>(
        <div key={lv.level} className="card card-pad">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }} onClick={()=>{setOpenLevel(openLevel===lv.level?null:lv.level); setSubmitted(false); setNotes("");}}>
            <div>
              <span className="badge badge-neutral" style={{ marginRight:8 }}>Level {lv.level}</span>
              <span style={{ fontWeight:600, fontSize:15 }}>{lv.title}</span>
              <div style={{ fontSize:12.5, color:"var(--ink-faint)", marginTop:4 }}>{lv.desc}</div>
            </div>
            <ChevronDown size={18} style={{ transform: openLevel===lv.level ? "rotate(180deg)" : "none", transition:".15s", color:"var(--ink-faint)" }} />
          </div>
          {openLevel===lv.level && (
            <div style={{ marginTop:16, borderTop:"1px solid var(--border)", paddingTop:16 }}>
              <button className="btn btn-primary btn-sm" style={{ marginBottom:12 }}><Play size={14}/>Play audio</button>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Write down the important information you hear…" rows={3}
                style={{ width:"100%", padding:12, borderRadius:10, border:"1.5px solid var(--border)", fontSize:14, fontFamily:"Inter", resize:"vertical" }} />
              <button className="btn btn-primary btn-sm" style={{ marginTop:10 }} onClick={()=>setSubmitted(true)} disabled={!notes.trim()}>Submit notes</button>
              {submitted && (
                <div style={{ marginTop:16, display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:"var(--ink-soft)", marginBottom:6 }}>YOUR NOTES</div>
                    <p style={{ fontSize:13.5, background:"var(--bg)", padding:10, borderRadius:8 }}>{notes}</p>
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:"var(--ink-soft)", marginBottom:6 }}>KEY INFORMATION</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {lv.keywords.map((k,i)=><span key={i} className="badge" style={{ background:"var(--teal-dim)", color:"var(--teal)" }}>{k}</span>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ListeningPracticeList() {
  return (
    <div className="lesson-grid">
      {LISTENING_PRACTICE.map(p=>(
        <div key={p.id} className="card card-pad card-hover">
          <DifficultyBadge level={p.difficulty} />
          <h4 className="f-display" style={{ fontSize:16.5, fontWeight:600, margin:"10px 0 6px" }}>{p.title}</h4>
          <div style={{ fontSize:12.5, color:"var(--ink-faint)" }}>{p.type}</div>
          <div style={{ marginTop:10 }}><BandBadge>{p.band}</BandBadge></div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   SPEAKING
   ============================================================ */

function SpeakingSection({ nav, go }) {
  const [part, setPart] = useState(nav.part || "part1");
  return (
    <div className="page">
      <Section eyebrow="Speaking" title="Speaking Practice" subtitle="Structured around the real IELTS Speaking format — Part 1, Part 2, and Part 3." />
      <div className="tabrow">
        {[["part1","Part 1"],["part2","Part 2"],["part3","Part 3"]].map(([id,label])=>(
          <button key={id} className={`tabbtn ${part===id?"active":""}`} onClick={()=>setPart(id)}>{label}</button>
        ))}
      </div>
      {part==="part1" && <SpeakingPart1/>}
      {part==="part2" && <SpeakingPart2/>}
      {part==="part3" && <SpeakingPart3/>}
    </div>
  );
}

function SpeakingPart1() {
  const [topic, setTopic] = useState("hometown");
  const content = topic === "hometown" ? HOMETOWN_CONTENT : null;
  return (
    <div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        {SPEAKING_PART1_TOPICS.map(t=><button key={t.id} className={`chip ${topic===t.id?"active":""}`} onClick={()=>setTopic(t.id)}>{t.name}</button>)}
      </div>
      {content ? (
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          <div className="card card-pad">
            <div className="f-mono" style={{ fontSize:12, color:"var(--primary)", marginBottom:6 }}>SAMPLE QUESTION</div>
            <p className="f-display" style={{ fontSize:19, fontWeight:600 }}>"{content.question}"</p>
          </div>
          {BAND_LEVELS.map((b,i)=>{
            const key = ["4–5","5.5–6","6.5–7","7.5–8+"][i];
            return (
              <div key={b} className="card card-pad">
                <BandBadge>{b}</BandBadge>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:10 }}>
                  {content.vocab[key].map((v,vi)=>(
                    <span key={vi} className="badge" style={{ background:"var(--primary-dim)", color:"var(--primary)" }} title={v.note}>{v.phrase}</span>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="card card-pad">
            <div style={{ fontSize:12.5, fontWeight:700, color:"var(--ink-soft)", marginBottom:6 }}>SAMPLE ANSWER</div>
            <p style={{ fontSize:14.5, lineHeight:1.65 }}>{content.sample}</p>
          </div>
          <div className="card card-pad" style={{ borderColor:"var(--rose-dim)" }}>
            <div style={{ fontSize:12.5, fontWeight:700, color:"var(--rose)", marginBottom:8 }}>COMMON MISTAKES</div>
            {content.mistakes.map((m,i)=><div key={i} style={{ fontSize:13.5, color:"var(--ink-soft)", marginBottom:4 }}>• {m}</div>)}
          </div>
        </div>
      ) : (
        <div className="card card-pad" style={{ color:"var(--ink-soft)", fontSize:14 }}>Vocabulary and sample answers for this topic are being written — check back soon.</div>
      )}
    </div>
  );
}

function SpeakingPart2() {
  const card = CUE_CARDS[0];
  const [phase, setPhase] = useState("idle"); // idle -> prep -> speak -> done
  const [seconds, setSeconds] = useState(60);
  const [recording, setRecording] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const timerRef = useRef(null);

  useEffect(()=>{
    if (phase === "prep" || phase === "speak") {
      timerRef.current = setInterval(()=>setSeconds(s=>{
        if (s<=1) {
          clearInterval(timerRef.current);
          if (phase==="prep") { setPhase("speak"); return 120; }
          else { setPhase("done"); setRecording(false); return 0; }
        }
        return s-1;
      }),1000);
    }
    return ()=>clearInterval(timerRef.current);
  },[phase]);

  const start = () => { setPhase("prep"); setSeconds(60); setAnalysis(null); };
  const stopEarly = () => {
    clearInterval(timerRef.current);
    if (phase === "speak") { setPhase("done"); setRecording(false); }
    else { setPhase("speak"); setSeconds(120); setRecording(true); }
  };
  const finishAndAnalyze = () => {
    setAnalysis({ fluency:6.5, vocabulary:7.0, grammar:6.0, pronunciation:6.5, band:6.5 });
  };

  const mm = Math.floor(seconds/60), ss = String(seconds%60).padStart(2,"0");

  return (
    <div style={{ maxWidth:640 }}>
      <div className="card card-pad" style={{ marginBottom:18 }}>
        <div className="f-mono" style={{ fontSize:12, color:"var(--primary)", marginBottom:8 }}>CUE CARD</div>
        <h3 className="f-display" style={{ fontSize:20, fontWeight:600, marginBottom:12 }}>{card.title}</h3>
        <ul style={{ margin:0, paddingLeft:18, fontSize:14, lineHeight:1.9, color:"var(--ink-soft)" }}>
          {card.bullets.map((b,i)=><li key={i}>{b}</li>)}
        </ul>
      </div>

      <div className="card card-pad" style={{ textAlign:"center", marginBottom:18 }}>
        {phase==="idle" && <button className="btn btn-primary" onClick={start}><Play size={16}/>Start 1-min preparation</button>}
        {(phase==="prep"||phase==="speak") && (
          <>
            <div className="f-mono" style={{ fontSize:13, fontWeight:700, color: phase==="prep" ? "var(--amber)" : "var(--primary)", marginBottom:8 }}>
              {phase==="prep" ? "PREPARATION TIME" : "SPEAKING TIME — RECORDING"}
            </div>
            <div className="f-mono" style={{ fontSize:44, fontWeight:600 }}>{mm}:{ss}</div>
            {phase==="speak" && <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:6, color:"var(--rose)", fontSize:12.5, fontWeight:600 }}><span style={{width:8,height:8,borderRadius:99,background:"var(--rose)"}}/>REC</div>}
            <button className="btn btn-secondary btn-sm" style={{ marginTop:16 }} onClick={stopEarly}>{phase==="prep" ? "Skip to speaking" : <><Square size={13}/>Stop recording</>}</button>
          </>
        )}
        {phase==="done" && !analysis && (
          <>
            <Check size={28} color="var(--teal)" style={{ marginBottom:8 }}/>
            <p style={{ fontSize:14, color:"var(--ink-soft)", marginBottom:14 }}>Recording complete. Analyze your response?</p>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button className="btn btn-primary btn-sm" onClick={finishAndAnalyze}>Analyze speaking</button>
              <button className="btn btn-secondary btn-sm" onClick={start}><RotateCcw size={14}/>Record again</button>
            </div>
          </>
        )}
        {analysis && (
          <div style={{ textAlign:"left" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <span style={{ fontWeight:700, fontSize:14 }}>Speaking Analysis</span>
              <BandBadge>{analysis.band}</BandBadge>
            </div>
            {[["Fluency",analysis.fluency],["Vocabulary",analysis.vocabulary],["Grammar",analysis.grammar],["Pronunciation",analysis.pronunciation]].map(([label,val])=>(
              <div key={label} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}><span>{label}</span><span className="f-mono" style={{fontWeight:600}}>{val.toFixed(1)}</span></div>
                <ProgressBar value={(val/9)*100} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div className="card card-pad">
          <div style={{ fontSize:12.5, fontWeight:700, color:"var(--ink-soft)", marginBottom:8 }}>USEFUL VOCABULARY</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{card.vocab.map((v,i)=><span key={i} className="badge" style={{ background:"var(--primary-dim)", color:"var(--primary)" }}>{v}</span>)}</div>
        </div>
        <div className="card card-pad">
          <div style={{ fontSize:12.5, fontWeight:700, color:"var(--ink-soft)", marginBottom:8 }}>SUGGESTED IDEAS</div>
          {card.ideas.map((idea,i)=><div key={i} style={{ fontSize:13, color:"var(--ink-soft)", marginBottom:4 }}>• {idea}</div>)}
        </div>
      </div>
      <div className="card card-pad" style={{ marginTop:14 }}>
        <div style={{ fontSize:12.5, fontWeight:700, color:"var(--ink-soft)", marginBottom:8 }}>SAMPLE ANSWER</div>
        <p style={{ fontSize:14, lineHeight:1.65 }}>{card.sample}</p>
      </div>
    </div>
  );
}

function SpeakingPart3() {
  const card = CUE_CARDS[0];
  return (
    <div style={{ maxWidth:640 }}>
      <p style={{ fontSize:13.5, color:"var(--ink-soft)", marginBottom:16 }}>Deeper discussion questions following on from Part 2's "{card.title}".</p>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {card.part3.map((q,i)=>(
          <div key={i} className="card card-pad">
            <div style={{ fontWeight:600, fontSize:14.5, marginBottom:8 }}>{q}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {["consider the wider implications","weigh both sides","draw on a specific example"].slice(0, (i%3)+1).map((tip,ti)=>(
                <span key={ti} className="badge badge-neutral">{tip}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   VOCABULARY SYSTEM
   ============================================================ */

function VocabularySection() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const skills = ["all","reading","writing","listening","speaking"];
  const filtered = VOCAB_MY_LIST.filter(v => (filter==="all" || v.skill===filter) && v.word.toLowerCase().includes(search.toLowerCase()));
  const statusColor = { New:"badge-neutral", Learning: "", Familiar:"", Mastered:"" };
  return (
    <div className="page">
      <Section eyebrow="Vocabulary" title="My Vocabulary" subtitle="Every word saved from Reading, Writing, Listening, and Speaking lives here, with spaced-repetition status.">
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18, alignItems:"center" }}>
          <div style={{ position:"relative", flex:1, minWidth:200 }}>
            <Search size={15} style={{ position:"absolute", left:12, top:11, color:"var(--ink-faint)" }} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search saved words…"
              style={{ width:"100%", padding:"9px 12px 9px 34px", borderRadius:10, border:"1.5px solid var(--border)", fontSize:14 }} />
          </div>
          {skills.map(s=><button key={s} className={`chip ${filter===s?"active":""}`} onClick={()=>setFilter(s)}>{s[0].toUpperCase()+s.slice(1)}</button>)}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map((v,i)=>(
            <div key={i} className="card card-pad" style={{ display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ flex:1, minWidth:200 }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:8, flexWrap:"wrap" }}>
                  <span className="f-display" style={{ fontSize:17, fontWeight:600 }}>{v.word}</span>
                  <span className="f-mono" style={{ fontSize:12, color:"var(--ink-faint)" }}>{v.pron}</span>
                </div>
                <div style={{ fontSize:13, color:"var(--ink-soft)", margin:"4px 0" }}>{v.meaning}</div>
                <div style={{ fontSize:12.5, color:"var(--ink-faint)", fontStyle:"italic" }}>"{v.example}"</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6, alignItems:"flex-end" }}>
                <span className="badge badge-neutral">{v.source}</span>
                <span className="badge" style={{
                  background: v.status==="Mastered" ? "var(--teal-dim)" : v.status==="Familiar" ? "var(--primary-dim)" : v.status==="Learning" ? "var(--amber-dim)" : "#F1EFF8",
                  color: v.status==="Mastered" ? "var(--teal)" : v.status==="Familiar" ? "var(--primary)" : v.status==="Learning" ? "var(--amber)" : "var(--ink-soft)" }}>{v.status}</span>
              </div>
            </div>
          ))}
          {filtered.length===0 && <div className="card card-pad" style={{ textAlign:"center", color:"var(--ink-faint)", fontSize:14 }}>No saved words match this filter yet.</div>}
        </div>
      </Section>
    </div>
  );
}

/* ============================================================
   PROGRESS DASHBOARD
   ============================================================ */

function ProgressSection() {
  const radarData = SKILLS.map(s=>({ skill:s.label, value:s.progress }));
  return (
    <div className="page">
      <Section eyebrow="Progress" title="Your Dashboard" subtitle="Track how each skill is developing and see your current estimated IELTS level." />
      <div style={{ display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:20, marginBottom:24 }}>
        <div className="card card-pad">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <span style={{ fontWeight:700, fontSize:14 }}>Current estimated level</span>
            <span className="badge badge-band">IELTS 6.5</span>
          </div>
          <BandMeter value={6.5} />
          <div style={{ display:"flex", gap:20, marginTop:16 }}>
            <div>
              <div className="f-mono" style={{ fontSize:24, fontWeight:600 }}>1,240</div>
              <div style={{ fontSize:12.5, color:"var(--ink-faint)" }}>words learned</div>
            </div>
            <div>
              <div className="f-mono" style={{ fontSize:24, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}><Flame size={20} color="var(--amber)"/>18</div>
              <div style={{ fontSize:12.5, color:"var(--ink-faint)" }}>day streak</div>
            </div>
          </div>
        </div>
        <div className="card card-pad">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:6 }}>Skill balance</div>
          <div style={{ height:200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="#E7E3F3" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize:12, fill:"#635E7A", fontFamily:"Inter" }} />
                <Radar dataKey="value" stroke="#4338CA" fill="#4338CA" fillOpacity={0.28} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Section eyebrow="By Skill" title="Progress breakdown">
        <div className="skillgrid">
          {SKILLS.map(s=>(
            <div key={s.id} className={`card card-pad ${s.className}`}>
              <div style={{ display:"flex", alignItems:"center", gap:8, color:"var(--skill)", fontWeight:700, fontSize:13.5 }}><s.icon size={16}/>{s.label}</div>
              <div className="f-mono" style={{ fontSize:26, fontWeight:600, margin:"8px 0" }}>{s.progress}%</div>
              <ProgressBar value={s.progress} colorVar="var(--skill)" />
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Activity" title="Recent activity">
        <div className="card card-pad">
          {RECENT_ACTIVITY.map((a,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom: i<RECENT_ACTIVITY.length-1 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize:14 }}>{a.label}</span>
              <span className="f-mono" style={{ fontSize:12, color:"var(--ink-faint)" }}>{a.time}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ============================================================
   PROFILE
   ============================================================ */

function ProfileSection() {
  return (
    <div className="page-narrow">
      <Section eyebrow="Account" title="Your Profile">
        <div className="card card-pad" style={{ display:"flex", gap:18, alignItems:"center", marginBottom:20 }}>
          <div style={{ width:60, height:60, borderRadius:99, background:"linear-gradient(135deg,var(--primary),var(--secondary))", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontFamily:"Fraunces,serif", fontSize:22, fontWeight:600 }}>A</div>
          <div>
            <div style={{ fontWeight:700, fontSize:17 }}>An Nguyen</div>
            <div style={{ fontSize:13, color:"var(--ink-soft)" }}>Target band: 7.0 · Studying since Feb 2026</div>
          </div>
        </div>
        <div className="card card-pad">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Study preferences</div>
          {[["Daily goal","20 minutes"],["Target band","7.0"],["Reminder time","8:00 PM"],["Native language","Vietnamese"]].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid var(--border)", fontSize:13.5 }}>
              <span style={{ color:"var(--ink-soft)" }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ============================================================
   APP SHELL
   ============================================================ */

const NAV_ITEMS = [
  { id:"home", label:"Home", icon:Home },
  { id:"writing", label:"Writing", icon:PenTool },
  { id:"listening", label:"Listening", icon:Headphones },
  { id:"reading", label:"Reading", icon:BookOpen },
  { id:"speaking", label:"Speaking", icon:Mic },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [nav, setNav] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (p, params = {}) => { setPage(p); setNav(params); setMobileOpen(false); window.scrollTo(0,0); };

  return (
    <div className="ielts-app">
      <style>{CSS}</style>
      <nav className="topnav">
        <div className="topnav-inner">
          <div className="brand" onClick={()=>go("home")}>
            <div className="brand-mark">B</div>
            <span className="f-display">Bandwise</span>
          </div>
          <div className="navlinks navlinks-labels">
            {NAV_ITEMS.map(item=>(
              <button key={item.id} className={`navlink ${page===item.id?"active":""}`} onClick={()=>go(item.id)}>
                <item.icon size={15}/>{item.label}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:2 }}>
            <button className={`navlink-icon-only ${page==="vocabulary"?"active":""}`} onClick={()=>go("vocabulary")} title="Vocabulary"><Layers size={17}/></button>
            <button className={`navlink-icon-only ${page==="progress"?"active":""}`} onClick={()=>go("progress")} title="Progress"><BarChart3 size={17}/></button>
            <button className={`navlink-icon-only ${page==="profile"?"active":""}`} onClick={()=>go("profile")} title="Profile"><User size={17}/></button>
          </div>
        </div>
      </nav>

      {page==="home" && <HomePage go={go} />}
      {page==="writing" && <WritingSection nav={nav} go={go} />}
      {page==="reading" && <ReadingSection nav={nav} go={go} />}
      {page==="listening" && <ListeningSection nav={nav} go={go} />}
      {page==="speaking" && <SpeakingSection nav={nav} go={go} />}
      {page==="vocabulary" && <VocabularySection />}
      {page==="progress" && <ProgressSection />}
      {page==="profile" && <ProfileSection />}

      {/* Mobile bottom nav */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"var(--surface)", borderTop:"1px solid var(--border)", display:"none", zIndex:40 }} className="mobilebar">
        {NAV_ITEMS.map(item=>(
          <button key={item.id} onClick={()=>go(item.id)} style={{ flex:1, background:"none", border:"none", padding:"10px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:3, color: page===item.id ? "var(--primary)" : "var(--ink-faint)" }}>
            <item.icon size={18}/><span style={{ fontSize:10, fontWeight:600 }}>{item.label}</span>
          </button>
        ))}
      </div>
      <style>{`@media (max-width:520px){ .mobilebar{ display:flex !important; } .page, .page-narrow{ padding-bottom:96px; } }`}</style>
    </div>
  );
}
