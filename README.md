# ResuMind AI — Intelligent Resume & Skill Gap Intelligence Platform

A full-stack, AI-powered portfolio web application and ATS-optimized resume suite built by **Kalyani Vilas Deshmukh** (B.Tech CSE - Data Science, RCPIT Shirpur).

> **Frontend engineered with [Google Antigravity IDE](https://antigravity.dev)**

---

## 🔗 Links

- **Live Portfolio**: Open `index.html` in a browser or run locally (see below)
- **LinkedIn**: [linkedin.com/in/kalyani-deshmukh-457031313](https://linkedin.com/in/kalyani-deshmukh-457031313)
- **GitHub**: [github.com/KalyaniDeshmukh-maker](https://github.com/KalyaniDeshmukh-maker)

---

## ✨ Features

### 🏠 Portfolio Tab
- Animated hero section with gradient typography
- Glassmorphic profile card with contact info
- Project cards (ResuMind AI, IoT Monitor, Number Game)
- Skill matrix & education timeline

### 🤖 ResuMind AI Analyzer
- Paste your resume + a job description → instant **ATS compatibility score** (0–100%)
- Keyword extraction & taxonomy matching across 5 skill categories
- Interactive Chart.js competency breakdown chart
- Matched ✓ / Missing ✗ / Additional skill tag clouds
- **AI Bullet Point Enhancer** — converts plain project notes into STAR-method resume bullets
- File drag & drop support for `.txt` / `.md` resume files
- Pre-loaded demo preset (Data Science Intern JD vs Kalyani's profile)

### 📄 ATS Resume Tab
- Embedded A4-format resume with Print → Save as PDF export
- [Open standalone](resume/resume_print.html) for clean 1-page PDF

---

## 🗂️ Project Structure

```
├── index.html                  # Main app (3-tab SPA)
├── styles/
│   └── main.css                # Dark/light glassmorphic design system
├── src/
│   ├── app.js                  # Tab routing, theme toggle, scroll animations
│   ├── components/
│   │   └── analyzer.js         # ResuMind AI full UI component
│   └── services/
│       └── api.js              # NLP scoring engine & bullet point enhancer
└── resume/
    ├── RESUME.md               # ATS-optimized Markdown resume
    ├── resume_print.html       # Standalone A4 printable resume
    └── bullet_points_guide.md # LinkedIn copy, bullet points, interview guide
```

---

## 🚀 Run Locally

```bash
# Method 1: npx serve (no install needed)
npx serve . --listen 3030
# → Open http://localhost:3030

# Method 2: Python
python -m http.server 3030
# → Open http://localhost:3030
```

> No build step required — pure HTML, CSS, and ES6 modules.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend UI | HTML5, CSS3 (Custom Properties, Glassmorphism) |
| Logic | Vanilla JavaScript (ES6+ Modules) |
| Charts | Chart.js v4 |
| Fonts | Google Fonts — Outfit & Inter |
| AI Dev Tooling | **Google Antigravity IDE** |
| Resume Format | A4 Print CSS + Markdown |

---

## 📄 Saving Resume as PDF

1. Open [`resume/resume_print.html`](resume/resume_print.html) in **Google Chrome**
2. Press **Ctrl+P** → Change destination to **"Save as PDF"**
3. Set margins to **None** → Save

---

## 👩‍💻 About

**Kalyani Vilas Deshmukh**  
B.Tech CSE (Data Science) · RCPIT Shirpur, DBATU · CGPA: 7.12  
📧 kalyanid532@gmail.com | 📞 +91 8446037591  
🔗 [LinkedIn](https://linkedin.com/in/kalyani-deshmukh-457031313) · 💻 [GitHub](https://github.com/KalyaniDeshmukh-maker)
