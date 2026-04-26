# Resume2Portfolio — Frontend

AI-powered resume → portfolio generator. Upload a resume, get a live portfolio preview instantly.

---

## Run Locally

### 1. Install dependencies
```bash
cd resume2portfolio
npm install
```

### 2. Set environment variable (optional — for backend)
Create a `.env` file in the root:
```
VITE_API_URL=http://localhost:5000
```
> Without a backend, the app uses **mock demo data** automatically.

### 3. Start the dev server
```bash
npm run dev
```

Open → http://localhost:5173

---

## What you'll see

| Left Panel | Right Panel |
|---|---|
| Upload PDF or paste resume text | Live portfolio preview |
| Choose template (Modern / Minimal) | Desktop / Mobile viewport toggle |
| Quick edit fields | Export as HTML button |
| Full Edit modal | Browser-style toolbar |

---

## Features
- **Upload PDF or paste text** — drag & drop supported
- **2 Templates** — Modern Developer (dark) and Minimal (light editorial)
- **Live Preview** — updates instantly as you edit
- **Quick Edit** — inline field editing in the left panel
- **Full Edit Modal** — edit every section: name, summary, skills, experience, projects, education
- **Mobile Preview** — toggle to see 390px mobile viewport
- **Export HTML** — downloads a standalone portfolio HTML file
- **Mock fallback** — works without a backend using demo data

---

## File Structure
```
src/
├── App.jsx                        # Root layout + state management
├── mockData.js                    # Demo portfolio data
├── index.css                      # Global styles + animations
├── components/
│   ├── UploadPanel.jsx            # Left panel: upload, template picker, quick edit
│   ├── PreviewPanel.jsx           # Right panel: live preview + export
│   ├── EditModal.jsx              # Full edit modal (all sections)
│   └── templates/
│       ├── MinimalTemplate.jsx    # Light, editorial style
│       └── ModernTemplate.jsx     # Dark, developer style
└── utils/
    └── exportPortfolio.js         # Export helper
```

---

## Build for production
```bash
npm run build
```
Output goes to `dist/` — deploy to Vercel, Netlify, or any static host.

---

## Backend (coming next)
The frontend is ready to connect to a Node.js + Express backend that:
- Parses PDFs with `pdf-parse`
- Calls Gemini API to extract structured resume data
- Returns JSON to the frontend

Set `VITE_API_URL` to your backend URL and it connects automatically.
