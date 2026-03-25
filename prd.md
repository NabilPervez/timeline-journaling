Here is the finalized Product Requirements Document (PRD) updated with your specific constraints. 

By removing user accounts and moving entirely to local storage, we have massively simplified the MVP scope while simultaneously creating a huge selling point: **absolute privacy**. 

Here is the developer-ready blueprint.

***

# Product Requirements Document (PRD): Local-First Timeline Journal

## 1. Context & Scope
**1.1 Executive Summary**
A mobile-first, completely free Progressive Web App (PWA) that allows users to log continuous, timestamped text and emoji check-ins throughout the day. The app functions entirely locally on the user's device, ensuring maximum privacy, and visualizes entries as a daily timeline with comprehensive mood analytics.

**1.2 Problem Statement**
Users lose track of how their mood fluctuates throughout the day because traditional journals demand lengthy, once-a-day entries. Furthermore, many users are hesitant to use cloud-based journaling apps due to privacy concerns regarding their most intimate thoughts.

**1.3 Value Proposition**
Low-friction, hyper-private micro-journaling. By pinging the user every 4 waking hours and restricting inputs to 10 core emojis or short text, it reveals hidden emotional patterns without feeling like a chore—and because data never leaves the device, absolute privacy is guaranteed.

* **KPIs for Success:** 1,000 WAU (Weekly Active Users), 40% Day-1 to Day-7 retention, average of 3+ check-ins per user per day. *(Note: Since this is local-only, we will need to rely on high-level anonymous analytics, like Google Analytics, just to track basic app usage, explicitly excluding journal content).*

## 2. User Personas & Roles
**2.1 The Personas**
* **The User:** The sole persona. They are both the consumer and the administrator of their local data.
* **Roles:** None. No Role-Based Access Control (RBAC) is needed. The app is a single-tenant, single-user local environment.

## 3. User Stories & Functional Requirements
**3.1 Authentication & Onboarding**
* **Authentication:** **None.** There are no passwords or accounts. The app launches directly into the core experience.
* **Onboarding:** Upon first launch, the app shows a brief welcome screen explaining that data is stored locally. It asks for the user's typical "Wake Up" and "Go to Sleep" times to calculate their waking hours for notifications.

**3.2 Core Workflow (The "Happy Path")**
1. The user receives a local push notification (triggered every 4 waking hours).
2. The user taps the notification or opens the PWA.
3. They tap the central "+" button.
4. They select one of **10 distinct emojis** representing their current mood and/or type a short text update.
5. Upon submission, the entry is saved to the device's local database (IndexedDB) and appended to the current day's chronological timeline.

**3.3 Settings & Configuration**
* Change "Waking Hours" schedule.
* Toggle Light/Dark mode.
* **Crucial Feature:** Export Data / Import Data. Because data is local, users *must* be able to export their journal as a JSON or CSV file to back it up, in case they clear their browser cache or get a new phone.

**3.4 Notifications**
* **Trigger:** Local, time-based triggers. The app divides the user's defined "waking hours" into 4-hour intervals and schedules local push notifications for those times.
* **Content:** Simple, gentle nudges (e.g., "Time for a quick check-in. How are you feeling right now?").

## 4. Monetization & Billing
*(Completely removed based on user input)*
* The app is 100% free with no premium tiers, paywalls, or gated features.

## 5. Site Map & Information Architecture
**5.1 Global Navigation**
* **Mobile Menu:** A persistent bottom tab bar.
* **Labels:** "Today", "History", "Insights", "Settings".

**5.2 URL Structure**
Since it's a PWA React app, it will use standard client-side routing (e.g., `/`, `/history`, `/insights`, `/settings`).

## 6. Page-by-Page Component Breakdown

### Page: Today (Dashboard)
* **Goal:** View today's timeline and quickly add a new entry.
* **Layout:** Vertical chronological line (newest at the bottom).
* **Components:** * Sticky Floating Action Button (FAB) for adding entries.
  * Timeline nodes displaying the time, the chosen emoji, and any text.
* **Empty State:** "Your day is a blank canvas. Tap '+' to log your first thought."

### Page: Input Form (Modal)
* **Fields:** * A fixed grid of exactly **10 emojis** (e.g., Happy, Sad, Angry, Anxious, Tired, Focused, Calm, Excited, Frustrated, Neutral). 
  * A multi-line text area (optional if an emoji is selected).
* **Validation:** Either an emoji OR text must be provided to save.
* **Submission:** Modal dismisses, timeline updates dynamically.

### Page: Insights (Analytics)
* **Goal:** Review emotional trends over time based on local data.
* **Components:** * **Time-of-Day Averages:** A bar chart showing the most frequent emoji/mood felt during specific time blocks (Morning, Midday, Evening).
  * **Weekly/Monthly Heatmap:** A calendar view where the daily color intensity or primary emoji represents the aggregate/average mood for that specific day.

### Page: History
* **Goal:** Browse past daily timelines.
* **Components:** A simple list or calendar view of past days. Tapping a date opens that day's chronological timeline.

## 7. Technical Requirements
**7.1 Stack Preferences**
* **Frontend:** React (Next.js or Vite) optimized as a Progressive Web App (PWA).
* **Backend:** **None.** * **Database:** **IndexedDB** (using a wrapper like Dexie.js for easier querying in React). This allows for robust local data storage that won't be wiped as easily as standard LocalStorage.
* **Hosting:** Vercel, Netlify, or GitHub Pages (only needed to serve the static frontend files).

**7.2 Performance & Reliability**
* Load time must be near-instant (< 1 second) since there are no network requests to fetch data.
* While complex "offline-first" background syncing isn't strictly required since there is no server to sync *to*, the app naturally works completely offline once installed as a PWA.

**7.3 Integrations & APIs**
* **None.** No 3rd party APIs (no Stripe, no Auth providers) are required.

## 8. Risks & Constraints
* **Data Loss Risk:** Because data is stored locally in the browser/device, if a user clears their site data or loses their phone, their journal is gone forever. **Mitigation:** Emphasize the "Export Backup" feature in the Settings page and occasionally remind users to download their backup file.
* **PWA Notification Limitations:** iOS Safari has strict rules regarding PWA push notifications (requires the user to "Add to Home Screen" first). The onboarding flow must explicitly guide iOS users to do this so the 4-hour ping system works.
