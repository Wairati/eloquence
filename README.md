# Eloquence

*Think clearly. Speak confidently.*

A personal speaking coach, built as an installable phone app (PWA). It is for speaking practice, structured
thinking, filler-word awareness and L/R pronunciation work.

## Status

| Area | State |
|---|---|
| App shell, navigation, design system, installable PWA | ✅ Built (Phase 1 · step 1) |
| Dashboard | ✅ Greeting and daily challenge. Progress shows an empty state until real sessions exist. |
| Backend `/api/health` | ✅ Built; reports whether AI coaching is configured |
| Analysis engine (fillers, repetitions, pace) | ✅ Built in `frontend/src/analysis/`, with tests; the Speak screen will use it |
| Speak screen (record, transcribe, review) | ⏳ Phase 1 · steps 3–4 |
| AI coaching (Gemini free tier) | ⏳ Phase 1 · step 5 |
| Train My Thoughts | ⏳ Phase 1 · step 6 |
| Progress, history, settings | ⏳ Phase 1 · step 7 |
| Pronunciation Lab, Vocabulary | Phase 2 |
| Conversation Practice | Phase 3 |

Sections that are not built yet say so in the app. None of them show fake controls or fake data.

## Architecture

- `frontend/`: React, TypeScript, Vite, Tailwind CSS, `vite-plugin-pwa`. It handles recording, transcription and
  analysis. Session history is stored **on the phone**.
- `backend/`: FastAPI. In Phase 1 its only job is to hold the Gemini API key and return structured coaching. It never
  stores audio.

## Running locally

Requirements: Node 22+ and Python 3.12+.

**Backend** (terminal 1):

```powershell
cd backend
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
copy .env.example .env        # optional: add a Gemini key later
.venv\Scripts\uvicorn app.main:app --reload --port 8000
```

**Frontend** (terminal 2):

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. In development, `/api` requests are forwarded to the backend.

### Tests

```powershell
cd frontend; npm test            # Vitest
cd backend;  .venv\Scripts\python -m pytest
```

### Opening it on your Android phone during development

1. Keep the phone and the PC on the same Wi-Fi network.
2. `npm run dev` prints a `Network:` address, such as `http://192.168.1.20:5173`. Open that address in Chrome on the
   phone. If it doesn't load, allow Node.js through Windows Firewall for private networks.
3. **Microphone access (needed from step 3 on):** Chrome only allows the microphone on `https` pages or `localhost`. For
   development, go to `chrome://flags/#unsafely-treat-insecure-origin-as-secure` on the phone, add your `Network:`
   address, enable the flag and restart Chrome. The deployed app uses real HTTPS, so it won't need this.

"Add to Home Screen" works properly once the app is deployed over HTTPS. Free deployment comes at the end of Phase 1.
