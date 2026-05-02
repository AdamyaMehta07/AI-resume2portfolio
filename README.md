<div align="center">

# ✦ Resume2Portfolio

### AI-Powered Portfolio Generator · Rose Studio Theme

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-fb7185?style=for-the-badge&logo=vercel)](https://ai-resume2portfolio.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-7a1f35?style=for-the-badge&logo=render)](https://ai-resume2portfolio.onrender.com/api/health)
[![License](https://img.shields.io/badge/License-MIT-pink?style=for-the-badge)](LICENSE)

**Upload your resume → AI extracts your data → Beautiful portfolio generated instantly**

![React](https://img.shields.io/badge/React-Vite-fb7185?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-7a1f35?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-fb7185?style=flat-square&logo=mongodb)
![Groq AI](https://img.shields.io/badge/Groq-LLaMA_3.1-7a1f35?style=flat-square)

</div>

---

## 🚀 Live Demo

| | Link |
|---|---|
|  **Frontend** | [ai-resume2portfolio.vercel.app](https://ai-resume2portfolio.vercel.app) |
|  **Backend API** | [ai-resume2portfolio.onrender.com](https://ai-resume2portfolio.onrender.com/api/health) |

---

##  Screenshots

###  Home Page — Split Screen Layout
![Home Page](screenshots/home.png)

###  Login Page
![Login Page](screenshots/login.png)

###  Signup Page
![Signup Page](screenshots/signup.png)

###  Portfolio Generated — Modern Template
![Portfolio Modern](screenshots/portfolio-modern.png)

###  Portfolio Generated — Minimal Template
![Portfolio Minimal](screenshots/portfolio-minimal.png)

###  Full Edit Modal
![Edit Modal](screenshots/edit.png)

###  Mobile Preview
![Mobile Preview](screenshots/mobile.png)

###  Forgot Password
![Forgot Password](screenshots/forgot-password.png)

---

## ✨ Features

-  **AI-Powered** — Uses Groq AI (LLaMA 3.1) to extract structured data from any resume
-  **PDF & Text Upload** — Upload PDF or paste resume text directly
-  **2 Portfolio Templates** — Modern Developer (dark) & Minimal (light editorial)
-  **Live Preview** — See your portfolio update in real-time as you edit
-  **Full Edit Mode** — Edit every section — name, skills, projects, experience, education
-  **Mobile Preview** — Toggle between desktop and mobile viewport
-  **Export HTML** — Download your portfolio as a standalone HTML file
-  **JWT Authentication** — Secure login/signup with bcrypt password hashing
-  **Rate Limiting** — 5 AI generations per user per day (server-side enforcement)
-  **Forgot Password** — Email-based password reset with 1-hour expiry tokens
-  **Rose Studio Theme** — Custom dark wine & rose color system throughout

---

##  Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router v6 | Client-side routing |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Multer | File upload handling |
| pdf-parse | PDF text extraction |
| Nodemailer | Password reset emails |
| Groq API | AI resume parsing (LLaMA 3.1) |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend deployment |
| Render | Backend deployment |
| MongoDB Atlas | Cloud database |
| Groq API | Free LLaMA AI model |

---

## 📁 Project Structure

```
resume2portfolio/
│
├── frontend/                    ← React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── templates/
│   │   │   │   ├── MinimalTemplate.jsx
│   │   │   │   └── ModernTemplate.jsx
│   │   │   ├── EditModal.jsx
│   │   │   ├── PreviewPanel.jsx
│   │   │   └── UploadPanel.jsx
│   │   ├── hooks/
│   │   │   └── useRateLimit.js
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── mockData.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     ← Node.js + Express
│   ├── routes/
│   │   ├── auth.js              ← signup, login, forgot/reset password
│   │   └── parse.js             ← PDF parsing + AI generation
│   ├── models/
│   │   ├── User.js              ← User schema
│   │   └── Usage.js             ← Daily usage tracking
│   ├── middleware/
│   │   └── authMiddleware.js    ← JWT protect + rate limit
│   ├── utils/
│   │   └── gemini.js            ← Groq AI integration
│   ├── index.js                 ← Express server entry point
│   └── package.json
│
└── screenshots/                 ← App screenshots for README
```

---

##  Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Groq API key (free) — [console.groq.com](https://console.groq.com)
- Gmail App Password (for password reset emails)

### 1. Clone the repo
```bash
git clone https://github.com/AdamyaMehta07/AI-resume2portfolio.git
cd AI-resume2portfolio
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/resume2portfolio
GROQ_API_KEY=gsk_your_groq_key_here
JWT_SECRET=your_long_random_secret
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_16_digit_app_password
FRONTEND_URL=http://localhost:5173
PORT=5000
```

```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

### 4. Open the app
```
http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create new account |
| POST | `/api/auth/login` | Login + get JWT token |
| GET | `/api/auth/me` | Get current user + usage |
| POST | `/api/auth/forgot-password` | Send password reset email |
| POST | `/api/auth/reset-password` | Reset password with token |

### Parse Routes (Protected + Rate Limited)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/parse-resume` | Upload PDF → AI parse → portfolio JSON |
| POST | `/api/parse-text` | Paste text → AI parse → portfolio JSON |

---

##  Deploy Your Own

### Frontend → Vercel
1. Fork this repo
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your fork
4. Set Root Directory: `frontend`
5. Add env variable: `VITE_API_URL=your_render_url`
6. Deploy!

### Backend → Render
1. Go to [render.com](https://render.com) → New Web Service
2. Connect your repo
3. Set Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `node index.js`
6. Add all env variables
7. Deploy!

---

##  Security Features

-  Passwords hashed with **bcrypt** (12 salt rounds)
-  **JWT tokens** expire in 7 days
-  Password reset tokens expire in **1 hour**
-  Rate limiting enforced **server-side** in MongoDB
-  CORS configured for specific origins only
-  Environment variables never committed to git
-  File upload size limited to 10MB

---

## 👨‍💻 Built By

**Adamya Mehta**

[![GitHub](https://img.shields.io/badge/GitHub-AdamyaMehta07-fb7185?style=flat-square&logo=github)](https://github.com/AdamyaMehta07)

---

---

<div align="center">

Made with ❤️ and lots of ☕

⭐ **Star this repo if you found it helpful!**

</div>