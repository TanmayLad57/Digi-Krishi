# 🌾 Krishi Sathi — AI Agricultural Advisory Platform

**Krishi Sathi** is an AI-powered agricultural advisory platform built for the Smart India Hackathon (SIH), designed to act as a digital agricultural assistant for farmers.

Farmers can ask questions about pests, diseases, weather, farming practices, inputs, and government subsidies — via text, voice, or crop photos — and receive instant, context-aware guidance. When the AI is uncertain, cases are escalated to a human Agriculture Officer, ensuring every farmer gets a trustworthy answer.

This repository currently contains the **farmer-side frontend prototype** — a multi-page, fully responsive React application built with mock data. The AI/RAG backend, real authentication, and officer-side dashboard are planned for later phases.

---

## ✨ Key Features

- **🏠 Landing Home Page**: Hero introduction, live stats strip (50k+ Queries Solved, 98.4% Diagnostic Accuracy, 100% Free), and full core-capability showcase.
- **🤖 AI Interaction Desk**: A 4-mode interactive demo —
  - **Ask AI (Text)** — type any farming question and get a mock instant response.
  - **Voice Query (Hindi/Local)** — record or upload a voice note and receive a transcribed question with a synthesized voice response.
  - **Crop Disease Scan** — upload a crop/leaf photo and get a mock AI diagnosis with bounding-box overlay, confidence score, and treatment plan.
  - **Government Schemes** — browse mock subsidy and scheme information.
- **📋 Core Capabilities Showcase**: Detailed cards for Ask Agricultural Questions, Crop Disease Diagnosis, Weather & Spray Alerts, and Government Subsidies — each with icons, tags, descriptions, and key highlights.
- **🌦️ How It Works**: Visual step-by-step flow of the farmer → AI → (Agriculture Officer if uncertain) → advisory pipeline.
- **🤝 Why Us**: Trust-building highlights — instant answers, personalized advice, expert-backed responses, multilingual support (coming soon).
- **🧭 Dropdown Navigation**: Clean multi-page routing (not anchor-scroll) with dropdown menus under each nav item for direct access to sub-sections.
- **🎞️ Smooth Motion**: Scroll-triggered animations, hover micro-interactions, and page transitions powered by Framer Motion.

> 🔒 **Note**: This is a Day-1 frontend prototype. RAG, LLM integration, real image/voice AI, live weather data, and authentication are not yet implemented — all responses shown are mock/demo data.

---

## 🛠️ Tech Stack

- **Core**: React 19, JavaScript (ESNext), HTML5
- **Build Tooling**: Vite 8
- **Routing**: React Router 7
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS with custom design tokens

---

## 🎨 Design System & Typography

- **Display Face**: A characterful serif for headings and hero text (editorial, warm — not a generic system font)
- **Workhorse Body Face**: A humanist sans-serif for body copy, forms, and cards
- **Color Palette (Light Theme — default and only theme)**:
  - **Background**: Off-white / Parchment (`#F7F6F2`)
  - **Primary Text**: Near-black Charcoal (`#1E2B22`)
  - **Primary Accent**: Deep Forest Green (`#123524`) — high-contrast, used for buttons and highlights
  - **Secondary Accent**: Warm Mustard/Gold (`#D9A441`) — used for tags, badges, and highlights
  - **Borders/Dividers**: Soft Neutral Grey (`#D9D7CE`)

---

## 📁 Project Structure

```
digital-krishi-officer/
├── public/                  # Static assets (icons, images)
├── src/
│   ├── components/          # Shared UI components
│   │   ├── Navbar/           # Dropdown navigation bar
│   │   ├── Hero/              # Landing hero section
│   │   ├── StatsStrip/        # Platform stats banner
│   │   ├── FeatureCard/       # Core capability cards
│   │   ├── DemoTabs/          # AI interaction desk (Ask AI / Voice / Scan / Schemes)
│   │   ├── UploadBox/         # Crop photo upload component
│   │   ├── VoiceRecorder/     # Mock voice recording component
│   │   └── Footer/
│   ├── pages/
│   │   ├── Home/              # Hero + Stats + Core Capabilities
│   │   ├── AI/                 # Interactive AI demo page
│   │   ├── HowItWorks/
│   │   └── WhyUs/
│   ├── data/                 # Mock data (schemes, sample diagnoses, sample responses)
│   ├── App.jsx                # Route definitions
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18+ recommended) installed on your system.

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/digital-krishi-officer.git

# 2. Navigate into the project directory
cd digital-krishi-officer

# 3. Install dependencies
npm install

# 4. Launch the local development server
npm run dev
```

Open your browser and navigate to **`http://localhost:5173`**.

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## 🗺️ Roadmap

- [ ] Real authentication (Firebase) for Farmer & Officer roles
- [ ] LLM + RAG-powered agricultural knowledge base
- [ ] Real computer-vision crop disease diagnosis
- [ ] Live weather API integration
- [ ] Real speech-to-text voice query pipeline
- [ ] Officer-side dashboard (Escalated Cases, Case Details, Resolution flow)
- [ ] Malayalam and other regional language support
- [ ] Farmer profile, My Crops, and Query History with persistent context

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
