const fetch = require('node-fetch')

const MOCK_DATA = {
  name: 'Alex Rivera',
  title: 'Full Stack Developer & UI Engineer',
  email: 'alex.rivera@email.com',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA',
  github: 'github.com/alexrivera',
  linkedin: 'linkedin.com/in/alexrivera',
  summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications.',
  skills: ['React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS'],
  projects: [
    { name: 'CloudSync Dashboard', description: 'Real-time cloud storage dashboard. Reduced sync time by 60%.', tech: ['React', 'Node.js', 'AWS S3'], link: '' },
    { name: 'DevPulse', description: 'Developer productivity tracker used by 500+ developers.', tech: ['Next.js', 'PostgreSQL'], link: '' }
  ],
  experience: [
    { company: 'Stripe', role: 'Senior Software Engineer', period: '2021 – Present', description: 'Led payment infrastructure serving 10M+ transactions/day.' },
    { company: 'Airbnb', role: 'Software Engineer', period: '2019 – 2021', description: 'Built host dashboard used by 4M+ hosts globally.' }
  ],
  education: [
    { institution: 'UC Berkeley', degree: 'B.S. Computer Science', period: '2014 – 2018', details: "GPA: 3.8 | Dean's List" }
  ]
}

async function callGemini(resumeText) {
  const apiKey = process.env.GEMINI_API_KEY

  // ── Check 1: API key exists
  if (!apiKey || apiKey === 'AIzaSy_YOUR_KEY_HERE') {
    console.warn('⚠️  GEMINI_API_KEY is missing or placeholder — using mock data')
    return MOCK_DATA
  }

  console.log('🔄 Calling Gemini API...')
  console.log('📄 Resume text length:', resumeText.length, 'characters')

  const prompt = `You are a resume parser. Extract all information from the resume below and return ONLY a valid JSON object. No markdown, no explanation, no code blocks — just raw JSON.

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
${resumeText}`

  // Try multiple Gemini models in order
  const models = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-pro',
    'gemini-1.0-pro'
  ]

  for (const model of models) {
    try {
      console.log(`🤖 Trying model: ${model}`)

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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

      const data = await response.json()

      // ── Check 2: API key invalid
      if (data.error?.code === 400 && data.error?.message?.includes('API_KEY')) {
        console.error('❌ Invalid Gemini API key — check your .env file')
        return MOCK_DATA
      }

      // ── Check 3: Model not found — try next
      if (data.error?.code === 404 || data.error?.status === 'NOT_FOUND') {
        console.warn(`⚠️  Model ${model} not found, trying next...`)
        continue
      }

      // ── Check 4: Any other API error
      if (!response.ok || data.error) {
        console.error(`❌ Gemini error for model ${model}:`, JSON.stringify(data.error))
        continue
      }

      // ── Check 5: Empty response
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!rawText) {
        console.error('❌ Gemini returned empty response')
        continue
      }

      console.log('📝 Raw Gemini response (first 200 chars):', rawText.substring(0, 200))

      // Strip markdown code fences
      const cleaned = rawText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()

      // ── Check 6: Parse JSON
      try {
        const parsed = JSON.parse(cleaned)
        console.log('✅ Gemini successfully parsed resume for:', parsed.name)
        return parsed
      } catch (parseErr) {
        console.error('❌ Failed to parse Gemini JSON response:', parseErr.message)
        console.error('Raw text was:', cleaned.substring(0, 300))
        continue
      }

    } catch (err) {
      console.error(`❌ Network error for model ${model}:`, err.message)
      continue
    }
  }

  // All models failed
  console.error('❌ All Gemini models failed — falling back to mock data')
  return MOCK_DATA
}

module.exports = { callGemini }