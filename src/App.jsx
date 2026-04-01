import { useState, useEffect, useRef } from "react";

const EMOJIS = [
  { icon: "😊", label: "Happy", color: "#F5C842" },
  { icon: "😔", label: "Sad", color: "#7BA7D4" },
  { icon: "😠", label: "Angry", color: "#E8614A" },
  { icon: "😰", label: "Anxious", color: "#C67BC2" },
  { icon: "😴", label: "Tired", color: "#A0A8B8" },
  { icon: "🎯", label: "Focused", color: "#5BA68A" },
  { icon: "😌", label: "Calm", color: "#7EC8C8" },
  { icon: "🤩", label: "Excited", color: "#F5943A" },
  { icon: "😤", label: "Frustrated", color: "#D47A5A" },
  { icon: "😐", label: "Neutral", color: "#B0A898" },
  { icon: "🥹", label: "Grateful", color: "#E0A3A9" },
  { icon: "😎", label: "Confident", color: "#F5C842" },
  { icon: "🤔", label: "Thoughtful", color: "#7BA7D4" },
  { icon: "🫠", label: "Overwhelmed", color: "#A0A8B8" },
  { icon: "🥳", label: "Joyful", color: "#F5943A" },
  { icon: "🤒", label: "Unwell", color: "#A0A8B8" },
  { icon: "🤬", label: "Furious", color: "#E8614A" },
  { icon: "🥰", label: "Loved", color: "#E09E96" },
  { icon: "🥺", label: "Insecure", color: "#B0A898" },
  { icon: "👻", label: "Playful", color: "#D4AB5A" },
];

const STORAGE_KEY = "timeline_journal_entries";

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getLocalDayKey(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayKey() {
  return getLocalDayKey();
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatHour(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", hour12: true });
}

// Seed some demo entries if empty
function seedDemoEntries() {
  const existing = loadEntries();
  if (existing.length > 0) return existing;
  const today = getTodayKey();
  const now = Date.now();
  const MS = 3600000;

  function daysAgo(n) {
    const d = new Date(now - n * 86400000);
    return getLocalDayKey(d);
  }
  function ts(daysBack, hoursBack) {
    return new Date(now - daysBack * 86400000 - hoursBack * MS).toISOString();
  }

  const demo = [
    // Today
    { id: 1,  date: today,       timestamp: ts(0, 7),   emoji: EMOJIS[0], text: "Good morning! Feeling refreshed after a solid sleep." },
    { id: 2,  date: today,       timestamp: ts(0, 4),   emoji: EMOJIS[5], text: "Deep work session, completely locked in." },
    { id: 3,  date: today,       timestamp: ts(0, 1.5), emoji: EMOJIS[7], text: "Just had a great call with the team 🎉" },
    // Yesterday
    { id: 4,  date: daysAgo(1),  timestamp: ts(1, 8),   emoji: EMOJIS[6], text: "Slow start, coffee helping." },
    { id: 5,  date: daysAgo(1),  timestamp: ts(1, 5),   emoji: EMOJIS[3], text: "Big presentation coming up, butterflies." },
    { id: 6,  date: daysAgo(1),  timestamp: ts(1, 2),   emoji: EMOJIS[0], text: "Nailed it! Team was really positive." },
    { id: 7,  date: daysAgo(1),  timestamp: ts(1, 0.5), emoji: EMOJIS[6], text: "Winding down, feeling good." },
    // 2 days ago
    { id: 8,  date: daysAgo(2),  timestamp: ts(2, 9),   emoji: EMOJIS[4], text: "Didn't sleep great." },
    { id: 9,  date: daysAgo(2),  timestamp: ts(2, 5),   emoji: EMOJIS[9], text: "" },
    { id: 10, date: daysAgo(2),  timestamp: ts(2, 1),   emoji: EMOJIS[8], text: "Frustrating bug that won't go away." },
    // 3 days ago
    { id: 11, date: daysAgo(3),  timestamp: ts(3, 7),   emoji: EMOJIS[7], text: "Weekend! Slept in, feeling amazing." },
    { id: 12, date: daysAgo(3),  timestamp: ts(3, 3),   emoji: EMOJIS[6], text: "Long walk in the park." },
    { id: 13, date: daysAgo(3),  timestamp: ts(3, 0.5), emoji: EMOJIS[0], text: "Dinner with friends, laughed a lot." },
    // 5 days ago
    { id: 14, date: daysAgo(5),  timestamp: ts(5, 8),   emoji: EMOJIS[5], text: "Productive morning." },
    { id: 15, date: daysAgo(5),  timestamp: ts(5, 3),   emoji: EMOJIS[2], text: "Meeting ran way too long." },
    // 8 days ago
    { id: 16, date: daysAgo(8),  timestamp: ts(8, 7),   emoji: EMOJIS[6], text: "Calm Sunday morning." },
    { id: 17, date: daysAgo(8),  timestamp: ts(8, 2),   emoji: EMOJIS[7], text: "Finished a book I've been reading for weeks!" },
    // 12 days ago
    { id: 18, date: daysAgo(12), timestamp: ts(12, 6),  emoji: EMOJIS[3], text: "Anxious about a decision." },
    { id: 19, date: daysAgo(12), timestamp: ts(12, 2),  emoji: EMOJIS[9], text: "" },
    // 15 days ago
    { id: 20, date: daysAgo(15), timestamp: ts(15, 7),  emoji: EMOJIS[0], text: "Great start to the week." },
    { id: 21, date: daysAgo(15), timestamp: ts(15, 3),  emoji: EMOJIS[5], text: "Flow state for hours." },
    { id: 22, date: daysAgo(15), timestamp: ts(15, 1),  emoji: EMOJIS[0], text: "Feeling proud of what I built today." },
  ];
  saveEntries(demo);
  return demo;
}

// Get dominant emoji for a day
function getDominantEmoji(dayEntries) {
  const counts = {};
  dayEntries.forEach((e) => {
    counts[e.emoji.label] = (counts[e.emoji.label] || 0) + 1;
  });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return dayEntries.find((e) => e.emoji.label === top[0])?.emoji;
}

// Get dominant color for a day
function getDayColor(dayEntries) {
  const emoji = getDominantEmoji(dayEntries);
  return emoji?.color || "#B0A898";
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #F7F3EE;
    --surface: #FDFAF7;
    --surface2: #EDE8E0;
    --border: #DDD6CA;
    --text: #2C2417;
    --text-muted: #9C8E7E;
    --accent: #C8874A;
    --accent-light: #F5E8D8;
    --line: #DDD6CA;
    --shadow: 0 2px 16px rgba(44,36,23,0.08);
    --shadow-lg: 0 8px 40px rgba(44,36,23,0.14);
    --radius: 16px;
    --radius-sm: 10px;
  }

  .dark {
    --bg: #1A1710;
    --surface: #222016;
    --surface2: #2C2820;
    --border: #3A3528;
    --text: #F0EAE0;
    --text-muted: #7A7060;
    --accent: #D4914F;
    --accent-light: #2C2018;
    --line: #3A3528;
    --shadow: 0 2px 16px rgba(0,0,0,0.3);
    --shadow-lg: 0 8px 40px rgba(0,0,0,0.4);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    background: var(--bg);
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* Header */
  .header {
    padding: 52px 24px 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .header-left {}
  .header-date {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 4px;
  }
  .header-title {
    font-family: 'Lora', serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.15;
  }
  .header-title em {
    font-style: italic;
    color: var(--accent);
  }
  .header-actions {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 4px;
  }
  .icon-btn {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
    color: var(--text-muted);
  }
  .icon-btn:hover { background: var(--surface2); transform: scale(1.05); }

  /* Mood strip */
  .mood-strip {
    padding: 0 24px 20px;
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .mood-strip::-webkit-scrollbar { display: none; }
  .mood-chip {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .mood-chip:hover { border-color: var(--accent); color: var(--accent); }
  .mood-chip.active {
    background: var(--accent-light);
    border-color: var(--accent);
    color: var(--accent);
  }

  /* Timeline */
  .timeline {
    flex: 1;
    padding: 0 24px 120px;
    position: relative;
  }

  .timeline-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 32px;
    text-align: center;
    gap: 12px;
  }
  .timeline-empty-icon {
    font-size: 48px;
    opacity: 0.3;
    margin-bottom: 8px;
  }
  .timeline-empty-title {
    font-family: 'Lora', serif;
    font-size: 20px;
    color: var(--text-muted);
    font-style: italic;
  }
  .timeline-empty-sub {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 240px;
  }

  .timeline-line {
    position: absolute;
    left: 46px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--line);
  }

  .timeline-group {}
  .timeline-group-label {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    margin-top: 8px;
    position: relative;
    z-index: 2;
    background: var(--bg);
    padding: 4px 0;
  }
  .timeline-group-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--border);
    border: 2px solid var(--bg);
    flex-shrink: 0;
    margin-left: -4px;
  }
  .timeline-group-time {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .timeline-entry {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 18px;
    position: relative;
    animation: slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .entry-time-col {
    width: 38px;
    flex-shrink: 0;
    text-align: right;
    padding-top: 14px;
  }
  .entry-time {
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.2;
    font-weight: 500;
  }

  .entry-node {
    width: 14px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 14px;
    position: relative;
    z-index: 2;
  }
  .entry-dot {
    width: 14px; height: 14px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px;
    border: 2px solid var(--bg);
    transition: transform 0.2s;
  }
  .entry-dot:hover { transform: scale(1.2); }

  .entry-card {
    flex: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    transition: all 0.2s;
    cursor: default;
    position: relative;
    overflow: hidden;
  }
  .entry-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    border-radius: 2px 0 0 2px;
    opacity: 0.6;
  }
  .entry-card:hover {
    border-color: var(--accent);
    box-shadow: var(--shadow);
    transform: translateX(2px);
  }

  .entry-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }
  .entry-emoji { font-size: 18px; line-height: 1; }
  .entry-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
  }
  .entry-delete {
    margin-left: auto;
    opacity: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 14px;
    padding: 2px 4px;
    border-radius: 4px;
    transition: all 0.15s;
  }
  .entry-card:hover .entry-delete { opacity: 1; }
  .entry-delete:hover { color: #E8614A; background: #fef0ee; }

  .entry-text {
    font-size: 14px;
    line-height: 1.55;
    color: var(--text);
    font-family: 'Lora', serif;
  }

  /* FAB */
  .fab {
    position: fixed;
    bottom: 84px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px; height: 60px;
    border-radius: 50%;
    background: var(--accent);
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(200,135,74,0.4);
    font-size: 28px;
    color: white;
    font-weight: 300;
    line-height: 1;
    transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 100;
  }
  .fab:hover { transform: translateX(-50%) scale(1.1); box-shadow: 0 6px 28px rgba(200,135,74,0.55); }
  .fab:active { transform: translateX(-50%) scale(0.95); }
  .fab.open { transform: translateX(-50%) rotate(45deg); }
  .fab.open:hover { transform: translateX(-50%) rotate(45deg) scale(1.1); }

  /* Bottom nav */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    background: var(--surface);
    border-top: 1px solid var(--border);
    display: flex;
    z-index: 99;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 0 8px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    background: none;
    gap: 3px;
  }
  .nav-icon { font-size: 20px; line-height: 1; }
  .nav-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--text-muted);
    transition: color 0.2s;
  }
  .nav-item.active .nav-label { color: var(--accent); }
  .nav-item.active .nav-icon { transform: scale(1.1); }

  /* Modal overlay */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(26,23,16,0.6);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    animation: fadeIn 0.2s ease both;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal {
    position: relative;
    width: 100%;
    max-width: 430px;
    margin: 0 auto;
    background: gold;
    border-radius: 0;
    padding: 20px 24px 40px;
    animation: slideModal 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
    height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
  }
  @keyframes slideModal {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .modal-handle {
    width: 36px; height: 4px;
    background: var(--border);
    border-radius: 2px;
    margin: 0 auto 20px;
  }
  .modal-title {
    font-family: 'Lora', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 20px;
  }
  .modal-title em { font-style: italic; color: var(--accent); }

  .emoji-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    margin-bottom: 20px;
  }
  .emoji-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 4px 8px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--border);
    background: var(--bg);
    cursor: pointer;
    transition: all 0.18s;
  }
  .emoji-option:hover { border-color: var(--accent); transform: scale(1.04); }
  .emoji-option.selected {
    border-color: var(--accent);
    background: var(--accent-light);
    box-shadow: 0 0 0 2px var(--accent);
  }
  .emoji-option-icon { font-size: 22px; }
  .emoji-option-label { font-size: 10px; color: var(--text-muted); font-weight: 500; text-align: center; }
  .emoji-option.selected .emoji-option-label { color: var(--accent); }

  .text-input {
    width: 100%;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    font-family: 'Lora', serif;
    font-size: 15px;
    color: var(--text);
    resize: none;
    outline: none;
    transition: border-color 0.2s;
    line-height: 1.6;
    min-height: 90px;
    margin-bottom: 16px;
  }
  .text-input:focus { border-color: var(--accent); }
  .text-input::placeholder { color: var(--text-muted); font-style: italic; }

  .submit-btn {
    width: 100%;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    padding: 15px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.02em;
  }
  .submit-btn:hover { background: #b8763c; transform: translateY(-1px); }
  .submit-btn:active { transform: translateY(1px); }
  .submit-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* History page */
  .history-months { padding: 0 24px 120px; }
  .month-section { margin-bottom: 32px; }
  .month-label {
    font-size: 11px; font-weight: 500; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; padding-left: 2px;
  }
  .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 4px; }
  .cal-dow { font-size: 10px; font-weight: 500; color: var(--text-muted); text-align: center; padding-bottom: 4px; letter-spacing: 0.06em; }
  .cal-day {
    aspect-ratio: 1; border-radius: 8px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; cursor: pointer;
    transition: all 0.18s; position: relative; border: 1.5px solid transparent; gap: 1px;
  }
  .cal-day.empty { cursor: default; }
  .cal-day.has-entries:hover { border-color: var(--accent); transform: scale(1.08); z-index: 2; box-shadow: var(--shadow); }
  .cal-day.selected { border-color: var(--accent) !important; box-shadow: 0 0 0 2px var(--accent); transform: scale(1.08); z-index: 3; }
  .cal-day-num { font-size: 11px; font-weight: 500; color: var(--text-muted); line-height: 1; }
  .cal-day.has-entries .cal-day-num { color: var(--text); font-weight: 600; }
  .cal-day.is-today .cal-day-num { color: var(--accent); }
  .cal-day-emoji { font-size: 13px; line-height: 1; }
  .day-detail {
    margin-top: 4px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden;
    animation: expandDown 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes expandDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .day-detail-header {
    padding: 14px 16px 12px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .day-detail-title { font-family: 'Lora', serif; font-size: 15px; font-weight: 600; color: var(--text); }
  .day-detail-count { font-size: 11px; color: var(--text-muted); background: var(--surface2); padding: 3px 8px; border-radius: 10px; }
  .day-detail-entry {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 11px 16px; border-top: 1px solid var(--border); transition: background 0.15s;
  }
  .day-detail-entry:first-of-type { border-top: none; }
  .day-detail-entry:hover { background: var(--surface2); }
  .detail-time { font-size: 11px; color: var(--text-muted); min-width: 42px; padding-top: 2px; font-weight: 500; }
  .detail-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; border: 2px solid var(--bg); }
  .detail-content { flex: 1; }
  .detail-label { font-size: 11px; font-weight: 500; color: var(--text-muted); margin-bottom: 2px; display: flex; align-items: center; gap: 5px; }
  .detail-text { font-family: 'Lora', serif; font-size: 13px; color: var(--text); line-height: 1.55; }
  .streak-banner {
    margin: 0 24px 20px; padding: 14px 16px; background: var(--accent-light);
    border: 1px solid var(--border); border-radius: 12px;
    display: flex; align-items: center; gap: 12px;
  }
  .streak-icon { font-size: 24px; }
  .streak-label { font-size: 12px; color: var(--text-muted); }
  .streak-value { font-family: 'Lora', serif; font-size: 18px; font-weight: 600; color: var(--accent); line-height: 1.1; }

  /* Insights placeholder */
  .page-placeholder {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 32px;
    text-align: center;
    gap: 12px;
  }
  .placeholder-icon { font-size: 48px; margin-bottom: 8px; }
  .placeholder-title {
    font-family: 'Lora', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--text);
    font-style: italic;
  }
  .placeholder-sub {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.65;
    max-width: 260px;
  }
  .placeholder-badge {
    margin-top: 8px;
    padding: 6px 14px;
    background: var(--accent-light);
    border: 1px solid var(--accent);
    border-radius: 20px;
    font-size: 12px;
    color: var(--accent);
    font-weight: 500;
  }

  /* Insights & Settings labels */
  .insights-section-label {
    font-size: 11px; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; margin-top: 4px;
  }
  .settings-section-label {
    font-size: 11px; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--text-muted); padding-left: 2px; margin-bottom: 4px; margin-top: 8px;
  }

  /* Count badge */
  .entry-count {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: var(--accent-light);
    border: 1px solid var(--border);
    border-radius: 20px;
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 20px;
  }
  .entry-count strong { color: var(--accent); font-weight: 600; }

  .scroll-anchor { height: 1px; }
`;

function groupByHour(entries) {
  const groups = {};
  entries.forEach((e) => {
    const h = new Date(e.timestamp).getHours();
    const block = h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening";
    if (!groups[block]) groups[block] = [];
    groups[block].push(e);
  });
  return groups;
}

function TodayPage({ entries, onDelete, setTab }) {
  const bottomRef = useRef(null);
  const todayEntries = entries
    .filter((e) => e.date === getTodayKey())
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries.length]);

  const grouped = groupByHour(todayEntries);
  const blocks = ["Morning", "Afternoon", "Evening"];

  const now = new Date();
  const dayStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflowY: "auto" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--bg)", borderBottom: "1px solid var(--border)", marginBottom: 12 }}>
        <div className="header" style={{ paddingBottom: todayEntries.length > 0 ? 12 : 20 }}>
          <div className="header-left">
            <div className="header-date">{dayStr}</div>
            <div className="header-title">Your <em>{dayOfWeek}</em></div>
          </div>
          <button onClick={() => setTab("settings")} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--text-muted)" }}>⚙️</button>
        </div>

        {todayEntries.length > 0 && (
          <div style={{ padding: "0 24px 8px" }}>
            <div className="entry-count" style={{ marginBottom: 8 }}>
              <span>✦</span>
              <span><strong>{todayEntries.length}</strong> {todayEntries.length === 1 ? "check-in" : "check-ins"} today</span>
            </div>
          </div>
        )}
      </div>

      <div className="timeline">
        {todayEntries.length === 0 ? (
          <div className="timeline-empty">
            <div className="timeline-empty-icon">🌿</div>
            <div className="timeline-empty-title">Your day is a blank canvas.</div>
            <div className="timeline-empty-sub">Tap + to log your first thought — no pressure, just a moment captured.</div>
          </div>
        ) : (
          <>
            <div className="timeline-line" />
            {blocks.map((block) =>
              grouped[block]?.length > 0 ? (
                <div className="timeline-group" key={block}>
                  <div className="timeline-group-label">
                    <div className="timeline-group-dot" />
                    <div className="timeline-group-time">{block}</div>
                  </div>
                  {grouped[block].map((entry, i) => (
                    <div
                      className="timeline-entry"
                      key={entry.id}
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      <div className="entry-time-col">
                        <div className="entry-time">{formatTime(entry.timestamp)}</div>
                      </div>
                      <div className="entry-node">
                        <div
                          className="entry-dot"
                          style={{ background: entry.emoji.color }}
                          title={entry.emoji.label}
                        />
                      </div>
                      <div
                        className="entry-card"
                        style={{ "--entry-color": entry.emoji.color }}
                      >
                        <style>{`.entry-card[style*="${entry.emoji.color}"]::before { background: ${entry.emoji.color}; }`}</style>
                        <div className="entry-header">
                          <span className="entry-emoji">{entry.emoji.icon}</span>
                          <span className="entry-label">{entry.emoji.label}</span>
                          <button
                            className="entry-delete"
                            onClick={() => onDelete(entry.id)}
                            title="Delete"
                          >✕</button>
                        </div>
                        {entry.text && <div className="entry-text">{entry.text}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null
            )}
          </>
        )}
        <div ref={bottomRef} className="scroll-anchor" />
      </div>
    </div>
  );
}

// ── History helpers ──────────────────────────────────────────────
function getCalendarMonths(entries) {
  // Returns array of { year, month } for every month that has entries, plus current month
  const seen = new Set();
  entries.forEach((e) => {
    const [y, m] = e.date.split("-");
    seen.add(`${y}-${m}`);
  });
  const now = new Date();
  seen.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
  return [...seen]
    .sort((a, b) => b.localeCompare(a))
    .map((s) => {
      const [y, m] = s.split("-");
      return { year: parseInt(y), month: parseInt(m) };
    });
}

function buildCalendarWeeks(year, month) {
  // Returns array of 6 weeks (42 cells), each cell = { day: number|null }
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function calcStreak(byDate) {
  const today = getTodayKey();
  let streak = 0;
  let cursor = new Date();
  while (true) {
    const key = getLocalDayKey(cursor);
    if (byDate[key]) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (key === today) {
      // Allow today to be missing without breaking streak
      cursor.setDate(cursor.getDate() - 1);
      const yesterday = getLocalDayKey(cursor);
      if (!byDate[yesterday]) break;
    } else {
      break;
    }
    if (streak > 365) break;
  }
  return streak;
}

const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function HistoryPage({ entries, setTab }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const byDate = {};
  entries.forEach((e) => {
    if (!byDate[e.date]) byDate[e.date] = [];
    byDate[e.date].push(e);
  });

  const months = getCalendarMonths(entries);
  const streak = calcStreak(byDate);
  const todayStr = getTodayKey();
  const totalDays = Object.keys(byDate).length;

  const handleDayClick = (dateStr) => {
    if (!byDate[dateStr]) return;
    setSelectedDate(selectedDate === dateStr ? null : dateStr);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--bg)", borderBottom: "1px solid var(--border)", paddingBottom: 16, marginBottom: 20 }}>
        <div className="header" style={{ paddingBottom: 16 }}>
          <div className="header-left">
            <div className="header-date">Archive</div>
            <div className="header-title">Your <em>History</em></div>
          </div>
          <button onClick={() => setTab("settings")} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--text-muted)" }}>⚙️</button>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 10, padding: "0 24px" }}>
          {[
            { icon: "🔥", value: streak, label: streak === 1 ? "day streak" : "day streak" },
            { icon: "📔", value: entries.length, label: "total entries" },
            { icon: "📅", value: totalDays, label: "days logged" },
          ].map((s) => (
            <div key={s.label} style={{
              flex: 1, background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 12, padding: "10px 10px 8px", textAlign: "center"
            }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontFamily: "Lora, serif", fontSize: 20, fontWeight: 600, color: "var(--accent)", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="page-placeholder">
          <div className="placeholder-icon">📅</div>
          <div className="placeholder-title">No entries yet</div>
          <div className="placeholder-sub">Your logged days will appear here as a calendar once you start checking in.</div>
        </div>
      ) : (
        <div className="history-months">
          {months.map(({ year, month }) => {
            const weeks = buildCalendarWeeks(year, month);
            const monthKey = `${year}-${String(month).padStart(2, "0")}`;

            return (
              <div className="month-section" key={monthKey}>
                <div className="month-label">{MONTH_NAMES[month - 1]} {year}</div>

                {/* Day-of-week headers */}
                <div className="calendar-grid">
                  {DOW.map((d) => <div className="cal-dow" key={d}>{d}</div>)}
                </div>

                {/* Calendar weeks */}
                {weeks.map((week, wi) => (
                  <div className="calendar-grid" key={wi}>
                    {week.map((day, di) => {
                      if (!day) return <div key={di} className="cal-day empty" />;
                      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const dayEntries = byDate[dateStr];
                      const hasEntries = !!dayEntries;
                      const isToday = dateStr === todayStr;
                      const isSelected = selectedDate === dateStr;
                      const domEmoji = hasEntries ? getDominantEmoji(dayEntries) : null;
                      const bgColor = hasEntries ? domEmoji.color + "28" : "transparent";

                      return (
                        <div
                          key={di}
                          className={[
                            "cal-day",
                            hasEntries ? "has-entries" : "",
                            isToday ? "is-today" : "",
                            isSelected ? "selected" : "",
                          ].join(" ")}
                          style={{ background: bgColor }}
                          onClick={() => handleDayClick(dateStr)}
                          title={hasEntries ? `${dayEntries.length} entr${dayEntries.length === 1 ? "y" : "ies"}` : ""}
                        >
                          {hasEntries && <span className="cal-day-emoji">{domEmoji.icon}</span>}
                          <span className="cal-day-num">{day}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Inline day detail */}
                {selectedDate?.startsWith(monthKey) && byDate[selectedDate] && (
                  <div className="day-detail">
                    <div className="day-detail-header">
                      <div className="day-detail-title">
                        {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                      </div>
                      <div className="day-detail-count">
                        {byDate[selectedDate].length} {byDate[selectedDate].length === 1 ? "entry" : "entries"}
                      </div>
                    </div>
                    {byDate[selectedDate]
                      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                      .map((entry) => (
                        <div className="day-detail-entry" key={entry.id}>
                          <div className="detail-time">{formatTime(entry.timestamp)}</div>
                          <div className="detail-dot" style={{ background: entry.emoji.color }} />
                          <div className="detail-content">
                            <div className="detail-label">
                              <span>{entry.emoji.icon}</span>
                              <span>{entry.emoji.label}</span>
                            </div>
                            {entry.text && <div className="detail-text">{entry.text}</div>}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Insights helpers ─────────────────────────────────────────────
const TIME_BLOCKS = [
  { label: "Early Morning", short: "Dawn",  start: 5,  end: 9  },
  { label: "Morning",       short: "Morn",  start: 9,  end: 12 },
  { label: "Midday",        short: "Noon",  start: 12, end: 15 },
  { label: "Afternoon",     short: "Aftn",  start: 15, end: 18 },
  { label: "Evening",       short: "Eve",   start: 18, end: 22 },
  { label: "Night",         short: "Night", start: 22, end: 5  },
];

function getBlockEntries(entries, block) {
  return entries.filter((e) => {
    const h = new Date(e.timestamp).getHours();
    if (block.start < block.end) return h >= block.start && h < block.end;
    return h >= block.start || h < block.end;
  });
}

function getTopMoodForBlock(entries) {
  if (!entries.length) return null;
  const counts = {};
  entries.forEach((e) => { counts[e.emoji.label] = (counts[e.emoji.label] || 0) + 1; });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return entries.find((e) => e.emoji.label === top[0])?.emoji;
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(getLocalDayKey(d));
  }
  return days;
}

function InsightsPage({ entries, setTab }) {
  const [view, setView] = useState("week"); // "week" | "timeofday" | "emotion"
  const [selectedEmotionLabel, setSelectedEmotionLabel] = useState("Happy"); // default

  const byDate = {};
  entries.forEach((e) => {
    if (!byDate[e.date]) byDate[e.date] = [];
    byDate[e.date].push(e);
  });

  const last7 = getLast7Days();

  // Weekly mood bar data — count per emoji across last 7 days
  const last7entries = entries.filter((e) => last7.includes(e.date));
  const moodCounts = {};
  last7entries.forEach((e) => {
    const key = e.emoji.label;
    if (!moodCounts[key]) moodCounts[key] = { emoji: e.emoji, count: 0 };
    moodCounts[key].count++;
  });
  const moodRanked = Object.values(moodCounts).sort((a, b) => b.count - a.count);
  const maxCount = moodRanked[0]?.count || 1;

  // Time-of-day block data
  const blockData = TIME_BLOCKS.map((block) => {
    const blockEntries = getBlockEntries(entries, block);
    const topMood = getTopMoodForBlock(blockEntries);
    const pct = blockEntries.length;
    return { ...block, topMood, count: blockEntries.length };
  });
  const maxBlockCount = Math.max(...blockData.map((b) => b.count), 1);

  // 7-day heatmap
  const weekDayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const hasData = entries.length > 0;

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--bg)", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
        <div className="header" style={{ paddingBottom: 16 }}>
          <div className="header-left">
            <div className="header-date">Patterns</div>
            <div className="header-title">Your <em>Insights</em></div>
          </div>
          <button onClick={() => setTab("settings")} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--text-muted)" }}>⚙️</button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 6, padding: "0 24px 16px", overflowX: "auto", scrollbarWidth: "none" }}>
          {[{ id: "week", label: "This Week" }, { id: "timeofday", label: "Time of Day" }, { id: "emotion", label: "Emotion Analysis" }].map((t) => (
            <button key={t.id} onClick={() => setView(t.id)} style={{
              flex: 1, padding: "9px 12px", borderRadius: 10, border: "1.5px solid",
              borderColor: view === t.id ? "var(--accent)" : "var(--border)",
              background: view === t.id ? "var(--accent-light)" : "var(--surface)",
              color: view === t.id ? "var(--accent)" : "var(--text-muted)",
              fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer",
              transition: "all 0.2s", whiteSpace: "nowrap"
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="page-placeholder">
          <div className="placeholder-icon">🌱</div>
          <div className="placeholder-title">Nothing yet</div>
          <div className="placeholder-sub">Log a few check-ins and your mood patterns will appear here.</div>
        </div>
      ) : view === "week" ? (
        <div style={{ padding: "0 24px 120px" }}>

          {/* 7-day heatmap row */}
          <div className="insights-section-label">7-Day Overview</div>
          <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
            {last7.map((dateStr) => {
              const dayEntries = byDate[dateStr] || [];
              const dom = dayEntries.length ? getDominantEmoji(dayEntries) : null;
              const d = new Date(dateStr + "T12:00:00");
              const isToday = dateStr === getTodayKey();
              return (
                <div key={dateStr} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 10, color: isToday ? "var(--accent)" : "var(--text-muted)", fontWeight: 500 }}>
                    {weekDayLabels[d.getDay()]}
                  </div>
                  <div style={{
                    width: "100%", aspectRatio: "1", borderRadius: 8,
                    background: dom ? dom.color + "33" : "var(--surface2)",
                    border: `1.5px solid ${isToday ? "var(--accent)" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, transition: "all 0.2s",
                  }}>
                    {dom ? dom.icon : <span style={{ fontSize: 8, color: "var(--border)" }}>—</span>}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mood frequency bars */}
          <div className="insights-section-label">Mood Frequency</div>
          {moodRanked.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>No entries this week.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {moodRanked.map(({ emoji, count }) => (
                <div key={emoji.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{emoji.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{emoji.label}</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{count}×</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: "var(--surface2)", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 4,
                        background: emoji.color,
                        width: `${(count / maxCount) * 100}%`,
                        transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Most journaled day */}
          {last7entries.length > 0 && (() => {
            const best = last7.map((d) => ({ d, n: (byDate[d] || []).length })).sort((a, b) => b.n - a.n)[0];
            if (!best.n) return null;
            const label = new Date(best.d + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
            return (
              <div style={{ marginTop: 24, padding: "14px 16px", background: "var(--accent-light)", border: "1px solid var(--border)", borderRadius: 12 }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>Most active day</div>
                <div style={{ fontFamily: "Lora, serif", fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{label}</div>
                <div style={{ fontSize: 12, color: "var(--accent)", marginTop: 2 }}>{best.n} check-in{best.n > 1 ? "s" : ""}</div>
              </div>
            );
          })()}
        </div>
      ) : view === "timeofday" ? (
        // Time of Day view
        <div style={{ padding: "0 24px 120px" }}>
          <div className="insights-section-label">When do you check in?</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
            {blockData.map((block) => (
              <div key={block.label} style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
                padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
                opacity: block.count === 0 ? 0.45 : 1,
              }}>
                <div style={{ width: 44, flexShrink: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{block.short}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
                    {block.start}–{block.end < block.start ? block.end + 24 : block.end}h
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 10, borderRadius: 5, background: "var(--surface2)", overflow: "hidden", marginBottom: 5 }}>
                    <div style={{
                      height: "100%", borderRadius: 5,
                      background: block.topMood ? block.topMood.color : "var(--border)",
                      width: `${(block.count / maxBlockCount) * 100}%`,
                      transition: "width 0.7s cubic-bezier(0.22,1,0.36,1)",
                    }} />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {block.count === 0 ? "No entries" : `${block.count} entr${block.count === 1 ? "y" : "ies"}`}
                  </div>
                </div>
                <div style={{ fontSize: 22, width: 28, textAlign: "center" }}>
                  {block.topMood ? block.topMood.icon : "·"}
                </div>
              </div>
            ))}
          </div>

          {/* Peak time callout */}
          {(() => {
            const peak = [...blockData].sort((a, b) => b.count - a.count)[0];
            if (!peak.count) return null;
            return (
              <div style={{ padding: "14px 16px", background: "var(--accent-light)", border: "1px solid var(--border)", borderRadius: 12 }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>Peak check-in time</div>
                <div style={{ fontFamily: "Lora, serif", fontSize: 16, fontWeight: 600, color: "var(--text)" }}>
                  {peak.label} {peak.topMood?.icon}
                </div>
                <div style={{ fontSize: 12, color: "var(--accent)", marginTop: 2 }}>
                  Most common mood: {peak.topMood?.label || "—"}
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        // Emotion Analysis view
        <div style={{ padding: "0 24px 120px" }}>
          <div className="insights-section-label">Select Emotion</div>
          <select 
            value={selectedEmotionLabel} 
            onChange={(e) => setSelectedEmotionLabel(e.target.value)}
            style={{ 
              width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid var(--border)",
              background: "var(--surface)", fontFamily: "DM Sans, sans-serif", fontSize: 15, color: "var(--text)",
              marginBottom: 24, outline: "none", appearance: "none", cursor: "pointer"
            }}
          >
            {EMOJIS.map(em => (
              <option key={em.label} value={em.label}>{em.icon} {em.label}</option>
            ))}
          </select>

          {(() => {
            const emotionEntries = entries.filter(e => e.emoji.label === selectedEmotionLabel);
            const byDateEmotion = {};
            emotionEntries.forEach(e => {
              if (!byDateEmotion[e.date]) byDateEmotion[e.date] = 0;
              byDateEmotion[e.date]++;
            });

            // 7 day overview
            const maxDayCount = Math.max(...Object.values(byDateEmotion), 1);

            // most common time block
            const blockCounts = TIME_BLOCKS.map(block => {
              const blockEnts = getBlockEntries(emotionEntries, block);
              return { ...block, count: blockEnts.length };
            });
            const peakBlock = [...blockCounts].sort((a, b) => b.count - a.count)[0];

            return (
              <>
                <div className="insights-section-label">7-Day Overview ({selectedEmotionLabel})</div>
                <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
                  {last7.map((dateStr) => {
                    const count = byDateEmotion[dateStr] || 0;
                    const d = new Date(dateStr + "T12:00:00");
                    const isToday = dateStr === getTodayKey();
                    const emojiObj = EMOJIS.find(e => e.label === selectedEmotionLabel);
                    return (
                      <div key={dateStr} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ fontSize: 10, color: isToday ? "var(--accent)" : "var(--text-muted)", fontWeight: 500 }}>
                          {weekDayLabels[d.getDay()]}
                        </div>
                        <div style={{
                          width: "100%", height: 100, borderRadius: 8, background: "var(--surface2)",
                          border: `1.5px solid ${isToday ? "var(--accent)" : "var(--border)"}`,
                          position: "relative", overflow: "hidden", pointerEvents: "none"
                        }}>
                          <div style={{
                            position: "absolute", bottom: 0, left: 0, right: 0,
                            background: emojiObj.color, opacity: 0.8,
                            height: `${(count / maxDayCount) * 100}%`,
                            transition: "height 0.4s"
                          }} />
                          <div style={{
                            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 600, color: count > 0 ? "white" : "var(--text-muted)", zIndex: 2
                          }}>
                            {count > 0 ? count : ""}
                          </div>
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                          {d.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {peakBlock.count > 0 && (
                  <>
                    <div className="insights-section-label">Most Logged Time</div>
                    <div style={{ padding: "14px 16px", background: "var(--accent-light)", border: "1px solid var(--border)", borderRadius: 12, marginBottom: 28 }}>
                      <div style={{ fontFamily: "Lora, serif", fontSize: 16, fontWeight: 600, color: "var(--text)" }}>
                        {peakBlock.label}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--accent)", marginTop: 2 }}>
                        {peakBlock.count} entr{peakBlock.count === 1 ? "y" : "ies"} logged during this time
                      </div>
                    </div>
                  </>
                )}

                <div className="insights-section-label">History ({selectedEmotionLabel})</div>
                {emotionEntries.length === 0 ? (
                  <div style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>No entries for {selectedEmotionLabel.toLowerCase()} yet.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {emotionEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((entry) => (
                      <div key={entry.id} style={{
                        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px",
                        display: "flex", flexDirection: "column", gap: 6
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)" }}>
                            {new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                          </div>
                          <div style={{ fontSize: 16 }}>{entry.emoji.icon}</div>
                        </div>
                        {entry.text && <div style={{ fontSize: 13, fontFamily: "Lora, serif", color: "var(--text)", lineHeight: 1.5 }}>{entry.text}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ── Settings ─────────────────────────────────────────────────────
function SettingsPage({ dark, setDark, entries, setEntries, wakeHour, sleepHour, setWakeHour, setSleepHour }) {
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileRef = useRef(null);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `journal-backup-${getTodayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    setImportSuccess(false);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!Array.isArray(parsed)) throw new Error("Invalid format");
        // Merge: keep existing, add imported non-duplicates
        const existingIds = new Set(entries.map((e) => e.id));
        const newEntries = parsed.filter((e) => !existingIds.has(e.id));
        const merged = [...entries, ...newEntries].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setEntries(merged);
        saveEntries(merged);
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 3000);
      } catch {
        setImportError("Couldn't read that file. Make sure it's a valid journal backup.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const hours = Array.from({ length: 24 }, (_, i) => {
    const ampm = i < 12 ? "AM" : "PM";
    const h = i === 0 ? 12 : i > 12 ? i - 12 : i;
    return { value: i, label: `${h}:00 ${ampm}` };
  });

  const SettingRow = ({ icon, label, desc, children, onClick }) => (
    <div onClick={onClick} style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
      padding: "13px 16px", display: "flex", alignItems: "center", gap: 12,
      cursor: onClick ? "pointer" : "default", transition: "all 0.15s",
    }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );

  const Badge = ({ children }) => (
    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", background: "var(--accent-light)", padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {children}
    </div>
  );

  const SelectControl = ({ value, onChange }) => (
    <select value={value} onChange={(e) => onChange(Number(e.target.value))}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "var(--accent-light)", border: "1px solid var(--accent)", borderRadius: 8,
        color: "var(--accent)", fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 600,
        padding: "4px 8px", cursor: "pointer", outline: "none",
      }}>
      {hours.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
    </select>
  );

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "52px 0 120px" }}>
      <div style={{ padding: "0 24px 24px" }}>
        <div className="header-date">Configure</div>
        <div style={{ fontFamily: "Lora, serif", fontSize: 28, fontWeight: 600, color: "var(--text)" }}>
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Settings</em>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 24px" }}>

        {/* Section: Schedule */}
        <div className="settings-section-label">Schedule</div>

        <SettingRow icon="🌅" label="Wake up time" desc="Start of your waking hours">
          <SelectControl value={wakeHour} onChange={setWakeHour} />
        </SettingRow>

        <SettingRow icon="🌙" label="Bedtime" desc="End of your waking hours">
          <SelectControl value={sleepHour} onChange={setSleepHour} />
        </SettingRow>

        <div style={{ padding: "10px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>
            ⏰ Check-ins are nudged every <strong style={{ color: "var(--text)" }}>4 waking hours</strong> between{" "}
            <strong style={{ color: "var(--accent)" }}>{hours[wakeHour]?.label}</strong> and{" "}
            <strong style={{ color: "var(--accent)" }}>{hours[sleepHour]?.label}</strong>.
            {" "}Enable notifications in your browser to receive reminders.
          </div>
        </div>

        {/* Section: Appearance */}
        <div className="settings-section-label" style={{ marginTop: 8 }}>Appearance</div>

        <SettingRow icon="🌓" label="Dark mode" desc="Warm low-light theme" onClick={() => setDark(!dark)}>
          <div style={{
            width: 44, height: 24, borderRadius: 12, position: "relative", cursor: "pointer",
            background: dark ? "var(--accent)" : "var(--surface2)", border: "1.5px solid var(--border)",
            transition: "background 0.2s",
          }}>
            <div style={{
              position: "absolute", top: 2, left: dark ? 22 : 2,
              width: 16, height: 16, borderRadius: "50%", background: "white",
              transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }} />
          </div>
        </SettingRow>

        {/* Section: Data */}
        <div className="settings-section-label" style={{ marginTop: 8 }}>Your Data</div>

        <SettingRow icon="📤" label="Export backup" desc={`${entries.length} entries as JSON`} onClick={exportData}>
          <Badge>Download</Badge>
        </SettingRow>

        <SettingRow icon="📥" label="Import backup" desc="Merge a previous export" onClick={() => fileRef.current?.click()}>
          <Badge>Upload</Badge>
        </SettingRow>
        <input ref={fileRef} type="file" accept=".json" style={{ display: "none" }} onChange={handleImport} />

        {importError && (
          <div style={{ padding: "10px 14px", background: "#fef0ee", border: "1px solid #E8614A", borderRadius: 10, fontSize: 12, color: "#E8614A" }}>
            ⚠️ {importError}
          </div>
        )}
        {importSuccess && (
          <div style={{ padding: "10px 14px", background: "#eef7f3", border: "1px solid #5BA68A", borderRadius: 10, fontSize: 12, color: "#5BA68A" }}>
            ✓ Import successful! Your entries have been merged.
          </div>
        )}

        <div style={{ padding: "12px 14px", background: "var(--accent-light)", border: "1px solid var(--border)", borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>
            🔒 <strong style={{ color: "var(--text)" }}>Absolute privacy.</strong> Your journal never leaves this device. No accounts, no servers, no ads. Export regularly so you never lose your data.
          </div>
        </div>

        {/* App info */}
        <div style={{ textAlign: "center", paddingTop: 16 }}>
          <div style={{ fontFamily: "Lora, serif", fontSize: 13, fontStyle: "italic", color: "var(--text-muted)" }}>
            Timeline Journal — local-first, always free
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Onboarding ────────────────────────────────────────────────────
function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [wakeHour, setWakeHour] = useState(7);
  const [sleepHour, setSleepHour] = useState(23);

  const isIOS = typeof window !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = typeof window !== "undefined" && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone);

  const hours = Array.from({ length: 24 }, (_, i) => {
    const ampm = i < 12 ? "AM" : "PM";
    const h = i === 0 ? 12 : i > 12 ? i - 12 : i;
    return { value: i, label: `${h}:00 ${ampm}` };
  });

  const steps = [
    {
      icon: "🌿",
      title: <>Your private<br /><em>journal</em></>,
      body: "Timeline Journal helps you capture how you feel throughout the day — one emoji or note at a time. No accounts. No cloud. Just you.",
      cta: "Sounds good",
    },
    {
      icon: "🔒",
      title: <>Your data stays<br /><em>on this device</em></>,
      body: "Everything is stored locally in your browser. Nothing is ever sent to a server. For safety, you can export a backup anytime from Settings.",
      cta: "Got it",
    },
    {
      icon: "⏰",
      title: <>Set your<br /><em>waking hours</em></>,
      body: "We'll nudge you every 4 hours during your waking day. When do you usually wake up and go to sleep?",
      cta: "Continue",
      isSchedule: true,
    },
  ];

  if (isIOS && !isStandalone) {
    steps.push({
      icon: "📱",
      title: <>Add to<br /><em>Home Screen</em></>,
      body: "To get your 4-hour nudges, tap the Share button below and select 'Add to Home Screen'. Then launch the app from your home screen.",
      cta: "I'll do that",
      isIOSPrompt: true,
    });
  } else {
    steps.push({
      icon: "🔔",
      title: <>Enable<br /><em>Notifications</em></>,
      body: "We'll gently remind you to check in every 4 waking hours. Please allow notifications on the next prompt.",
      cta: "Enable",
      isNotificationPrompt: true,
    });
  }

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "var(--bg)", zIndex: 500,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "40px 32px",
      animation: "fadeIn 0.4s ease both",
    }}>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 48 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 20 : 6, height: 6, borderRadius: 3,
            background: i === step ? "var(--accent)" : "var(--border)",
            transition: "all 0.3s",
          }} />
        ))}
      </div>

      {/* Icon */}
      <div style={{ fontSize: 64, marginBottom: 28, animation: "slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
        {current.icon}
      </div>

      {/* Title */}
      <div key={`title-${step}`} style={{
        fontFamily: "Lora, serif", fontSize: 32, fontWeight: 600, color: "var(--text)",
        textAlign: "center", lineHeight: 1.2, marginBottom: 16,
        animation: "slideUp 0.4s 0.05s cubic-bezier(0.22,1,0.36,1) both",
      }}>
        {current.title}
      </div>

      {/* Body */}
      <div key={`body-${step}`} style={{
        fontSize: 15, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.7,
        maxWidth: 300, marginBottom: current.isSchedule ? 28 : 48,
        animation: "slideUp 0.4s 0.1s cubic-bezier(0.22,1,0.36,1) both",
      }}>
        {current.body}
      </div>

      {/* Schedule pickers */}
      {current.isSchedule && (
        <div key="pickers" style={{
          width: "100%", display: "flex", flexDirection: "column", gap: 10,
          marginBottom: 32, animation: "slideUp 0.4s 0.15s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          {[
            { label: "🌅 Wake up", value: wakeHour, set: setWakeHour },
            { label: "🌙 Bedtime",  value: sleepHour, set: setSleepHour },
          ].map((row) => (
            <div key={row.label} style={{
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
              padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{row.label}</span>
              <select value={row.value} onChange={(e) => row.set(Number(e.target.value))} style={{
                background: "var(--accent-light)", border: "1px solid var(--accent)", borderRadius: 8,
                color: "var(--accent)", fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 600,
                padding: "5px 10px", cursor: "pointer", outline: "none",
              }}>
                {hours.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={async () => {
          if (current.isNotificationPrompt) {
            if ("Notification" in window && Notification.permission !== "granted") {
              await Notification.requestPermission();
            }
          }
          if (isLast) {
            onComplete(wakeHour, sleepHour);
          } else {
            setStep(step + 1);
          }
        }}
        style={{
          width: "100%", maxWidth: 300, padding: "16px", borderRadius: 14,
          background: "var(--accent)", color: "white", border: "none",
          fontFamily: "DM Sans, sans-serif", fontSize: 16, fontWeight: 500,
          cursor: "pointer", letterSpacing: "0.02em",
          boxShadow: "0 4px 20px rgba(200,135,74,0.35)",
          transition: "all 0.2s",
          animation: "slideUp 0.4s 0.18s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {current.cta} →
      </button>

      {step > 0 && (
        <button onClick={() => setStep(step - 1)} style={{
          marginTop: 14, background: "none", border: "none", color: "var(--text-muted)",
          fontSize: 13, cursor: "pointer", fontFamily: "DM Sans, sans-serif",
        }}>
          ← Back
        </button>
      )}
    </div>
  );
}

function AddModal({ onClose, onSave }) {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [text, setText] = useState("");
  const canSave = selectedEmoji || text.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: Date.now(),
      date: getTodayKey(),
      timestamp: new Date().toISOString(),
      emoji: selectedEmoji || { icon: "😐", label: "Neutral", color: "#B0A898" },
      text: text.trim(),
    });
    onClose();
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--text)' }}
          aria-label="Close modal"
        >
          ✕
        </button>
        <div className="modal-handle" />
        <div className="modal-title">How are you <em>feeling?</em></div>
        <div className="emoji-grid">
          {EMOJIS.map((e) => (
            <div
              key={e.label}
              className={`emoji-option${selectedEmoji?.label === e.label ? " selected" : ""}`}
              onClick={() => setSelectedEmoji(selectedEmoji?.label === e.label ? null : e)}
            >
              <span className="emoji-option-icon">{e.icon}</span>
              <span className="emoji-option-label">{e.label}</span>
            </div>
          ))}
        </div>
        <textarea
          className="text-input"
          placeholder="Add a note…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
        <button className="submit-btn" onClick={handleSave} disabled={!canSave}>
          Save this moment
        </button>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { id: "today",    icon: "🌿", label: "Today"    },
  { id: "history",  icon: "📅", label: "History"  },
  { id: "insights", icon: "✨", label: "Insights" },
];

const SETTINGS_KEY = "timeline_journal_settings";

function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null"); }
  catch { return null; }
}
function saveSettings(s) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }

function checkNotification(wakeHour, sleepHour) {
  if (typeof window === "undefined" || !("Notification" in window) || Notification.permission !== "granted") return;
  
  const now = new Date();
  const currentHour = now.getHours();
  let awakeStart = wakeHour;
  let awakeEnd = sleepHour;
  let isAwake = false;

  if (awakeStart < awakeEnd) {
    isAwake = currentHour >= awakeStart && currentHour < awakeEnd;
  } else {
    isAwake = currentHour >= awakeStart || currentHour < awakeEnd;
  }

  if (!isAwake) return;

  const hoursAwakeSoFar = currentHour >= awakeStart 
    ? currentHour - awakeStart 
    : (currentHour + 24) - awakeStart;
    
  const blockIndex = Math.floor(hoursAwakeSoFar / 4);
  const dateKey = getLocalDayKey(now);
  const notifKey = `journal_notif_${dateKey}_block_${blockIndex}`;

  if (!localStorage.getItem(notifKey)) {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification("Time for a quick check-in", {
          body: "How are you feeling right now?",
          icon: "/icon.png",
          badge: "/badge.png",
          tag: notifKey,
        });
      });
    } else {
      new Notification("Time for a quick check-in", {
        body: "How are you feeling right now?",
      });
    }
    localStorage.setItem(notifKey, "true");
  }
}

export default function App() {
  const saved = loadSettings();
  const [onboarded, setOnboarded]   = useState(!!saved);
  const [dark,      setDark]        = useState(saved?.dark  ?? false);
  const [wakeHour,  setWakeHourRaw] = useState(saved?.wake  ?? 7);
  const [sleepHour, setSleepHourRaw]= useState(saved?.sleep ?? 23);
  const [tab,       setTab]         = useState("today");
  const [modalOpen, setModalOpen]   = useState(false);
  const [entries,   setEntries]     = useState(() => loadEntries());

  // Persist settings whenever they change
  useEffect(() => {
    if (onboarded) saveSettings({ dark, wake: wakeHour, sleep: sleepHour });
  }, [dark, wakeHour, sleepHour, onboarded]);

  // Notification poller
  useEffect(() => {
    if (!onboarded) return;
    checkNotification(wakeHour, sleepHour);
    const interval = setInterval(() => {
      checkNotification(wakeHour, sleepHour);
    }, 60000);
    return () => clearInterval(interval);
  }, [onboarded, wakeHour, sleepHour]);

  const setWakeHour  = (v) => setWakeHourRaw(v);
  const setSleepHour = (v) => setSleepHourRaw(v);
  const setDarkMode  = (v) => setDark(v);

  const handleOnboardingComplete = (wake, sleep) => {
    setWakeHourRaw(wake);
    setSleepHourRaw(sleep);
    setOnboarded(true);
    saveSettings({ dark, wake, sleep });
  };

  const handleSave = (entry) => {
    const next = [...entries, entry];
    setEntries(next);
    saveEntries(next);
  };

  const handleDelete = (id) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    saveEntries(next);
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`app${dark ? " dark" : ""}`}>
        {!onboarded && (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        )}

        {tab === "today"    && <TodayPage    entries={entries} onDelete={handleDelete} setTab={setTab} />}
        {tab === "history"  && <HistoryPage  entries={entries} setTab={setTab} />}
        {tab === "insights" && <InsightsPage entries={entries} setTab={setTab} />}
        {tab === "settings" && (
          <SettingsPage
            dark={dark}         setDark={setDarkMode}
            entries={entries}   setEntries={setEntries}
            wakeHour={wakeHour} setWakeHour={setWakeHour}
            sleepHour={sleepHour} setSleepHour={setSleepHour}
          />
        )}

        {tab === "today" && (
          <button
            className={`fab${modalOpen ? " open" : ""}`}
            onClick={() => setModalOpen(!modalOpen)}
            aria-label="Add entry"
          >
            +
          </button>
        )}

        <nav className="bottom-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item${tab === item.id ? " active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {modalOpen && (
          <AddModal
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </>
  );
}
