# Web Development Project 6 - **AstroDash**

**Submitted by:** Louis Miguel Sabaricos

---

### 🪐 Overview

This web app, **AstroDash**, displays data fetched from the **Marvel API** (or ComicVine API, depending on working source) through a secure backend proxy.
Users can search characters, view summary statistics, explore data visualizations, and click on individual items for detailed views—all while maintaining a modern “glass dashboard” interface with cosmic theming inspired by the original AstroDash design.

---

### ⏱ Time Spent
**8 hours total**

---

## ✅ Required Features

The following **required** functionality is completed:

- [x] **Clicking on an item in the list view displays more details about it**
  - Clicking an item in the dashboard list navigates to a separate detail view.
  - The detail view includes a description, comics count, and stories count.
  - The sidebar remains visible in all pages (Dashboard + Detail View).

- [x] **Each detail view of an item has a direct, unique URL link**
  - Each character or item can be accessed directly via `/character/:id`.
  - URL visibly updates in the browser.

- [x] **The app includes at least two unique charts using fetched data**
  - A **Bar Chart** displays comics count by character.
  - A **Line Chart** shows stories count by character.
  - Both charts are responsive and visually integrated into the dashboard.

---

## 🌟 Optional Features

- [x] Added a **modern “AstroDash” UI** with glassmorphism and nebula background.
- [x] Added animated **hover effects** and glowing section chips for better UX.
- [x] The site allows toggling between **Marvel API** and **ComicVine API** backends for fallback reliability.
- [x] Dashboard cards summarize total characters, average comics, median stories, and percent with description.

---

## 📊 Additional Features
- Enhanced **loading/error UI** states.
- Reusable components styled via a single global CSS theme.
- Integrated routing between `/`, `/search`, `/character/:id`, and `/about`.

---

## 🎥 Video Walkthrough

Here’s a walkthrough of the implemented user stories:

<img src='./walkthrough-comicvine.gif' title='Video Walkthrough' width='800' />

GIF created with **ScreenToGif (Windows)**

---

## 🧠 Notes

**Challenges Encountered:**
- The **Marvel API** occasionally returned HTTP 500 errors, so fallback logic was implemented with ComicVine.  
- Maintaining consistent UI style across both Dashboard and Detail pages required CSS refactoring.  
- Debugging Vite import paths (`../lib/api`) and ensuring proper proxy connection was a key hurdle.

---

## License

    Copyright 2025 Louis Miguel Sabaricos

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.