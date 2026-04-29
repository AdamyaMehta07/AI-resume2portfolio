const fetch = require('node-fetch')

// ── MOCK DATA ─────────────────────────────────────────────────
// Used when Gemini API key is missing or API call fails
const MOCK_DATA = {
  name: 'Alex Rivera',
  title: 'Full Stack Developer & UI Engineer',
  email: 'alex.rivera@email.com',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA',
  github: 'github.com/alexrivera',
  linkedin: 'linkedin.com/in/alexrivera',
  summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Love crafting elegant solutions to complex problems with a focus on performance and user experience.',
  skills: ['React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'GraphQL', 'Next.js'],
  projects: [
    {
      name: 'CloudSync Dashboard',
      description: 'Real-time cloud storage dashboard with drag-and-drop file operations and team collaboration. Reduced file sync time by 60%.',
      tech: ['React', 'Node.js', 'WebSocket', 'AWS S3'],
      link: 'https://github.com/alexrivera/cloudsync'
    },
    {
      name: 'DevPulse',
      description: 'Developer productivity tracker integrating GitHub, Jira, and Slack. Used by 500+ developers across 30 companies.',
      tech: ['Next.js', 'PostgreSQL', 'OAuth', 'REST API'],
      link: 'https://github.com/alexrivera/devpulse'
    }
  ],
  experience: [
    {
      company: 'Stripe',
      role: 'Senior Software Engineer',
      period: '2021 – Present',
      description: 'Led development of payment infrastructure serving 10M+ transactions/day. Architected microservices migration reducing latency by 40%.'
    },
    {
      company: 'Airbnb',
      role: 'Software Engineer',
      period: '2019 – 2021',
      description: 'Built host dashboard features used by 4M+ hosts globally. Improved search ranking algorithm increasing bookings by 15%.'
    }
  ],
  education: [
    {
      institution: 'UC Berkeley',
      degree: 'B.S. Computer Science',
      period: '2014 – 2018',
      details: 'GPA: 3.8 | Dean\'s List | ACM Club President'
    }
  ]
}

// ── GEMINI API CALL ───────────────────────────────────────────
async function callGemini(resumeText) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.warn('⚠️  No GEMINI_API_KEY found — returning mock data')
    return MOCK_DATA
  }

  const prompt = `
You are a resume parser. Extract all information from the resume below and return ONLY a valid JSON object.
No markdown, no explanation, no code blocks — just raw JSON.

The JSON must have exactly these fields:
{
  "name": "full name",
  "title": "job title or professional headline",
  "email": "email address or empty string",
  "phone": "phone number or empty string",
  "location": "city, country or empty string",
  "github": "github url or username or empty string",
  "linkedin": "linkedin url or username or empty string",
  "summary": "write a 2-3 sentence professional summary based on the resume",
  "skills": ["skill1", "skill2", "skill3"],
  "projects": [
    {
      "name": "project name",
      "description": "what it does and the impact",
      "tech": ["tech1", "tech2"],
      "link": "url or empty string"
    }
  ],
  "experience": [
    {
      "company": "company name",
      "role": "job title",
      "period": "start year – end year",
      "description": "key achievements and responsibilities in 1-2 sentences"
    }
  ],
  "education": [
    {
      "institution": "school name",
      "degree": "degree and field of study",
      "period": "start year – end year",
      "details": "GPA, honors, clubs or empty string"
    }
  ]
}

Resume text:
${resumeText}
`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048
          }
        })
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      console.error('Gemini API error:', errText)
      return MOCK_DATA
    }

    const data = await response.json()
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Strip markdown code fences if Gemini wraps response in ```json
    const cleaned = rawText.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    console.log('✅ Gemini parsed resume successfully')
    return parsed

  } catch (err) {
    console.error('❌ Gemini error:', err.message, '— falling back to mock data')
    return MOCK_DATA
  }
}

module.exports = { callGemini }