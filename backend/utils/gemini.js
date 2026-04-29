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

  if (!apiKey || apiKey === 'AIzaSy_YOUR_KEY_HERE') {
    console.warn('⚠️  GEMINI_API_KEY missing — using mock data')
    return MOCK_DATA
  }

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

  // ── Step 1: Get available models from YOUR API key
  console.log('🔍 Fetching available Gemini models...')
  let modelsToTry = []

  try {
    const modelsRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    )
    const modelsData = await modelsRes.json()

    if (modelsData.models) {
      // Filter only text generation models
      modelsToTry = modelsData.models
        .map(m => m.name.replace('models/', ''))
        .filter(name =>
          name.includes('gemini') &&
          !name.includes('embedding') &&
          !name.includes('vision') &&
          !name.includes('aqa')
        )
      console.log('✅ Available models:', modelsToTry)
    } else {
      console.warn('⚠️  Could not fetch models:', JSON.stringify(modelsData.error))
    }
  } catch (err) {
    console.warn('⚠️  Could not fetch model list:', err.message)
  }

  // ── Step 2: Fallback list if model fetch failed
  if (modelsToTry.length === 0) {
    modelsToTry = [
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-1.5-flash-8b',
      'gemini-1.5-flash-8b-latest',
      'gemini-1.5-flash-002',
      'gemini-1.5-flash-001',
      'gemini-1.5-pro',
      'gemini-1.5-pro-latest',
      'gemini-1.5-pro-002',
    ]
    console.log('📋 Using fallback model list')
  }

  // ── Step 3: Try each model until one works
  for (const model of modelsToTry) {
    try {
      console.log(`🤖 Trying: ${model}`)

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 2048 }
          })
        }
      )

      const data = await response.json()

      // Invalid API key
      if (data.error?.status === 'INVALID_ARGUMENT' && data.error?.message?.includes('API key')) {
        console.error('❌ Invalid API key — check your .env GEMINI_API_KEY')
        return MOCK_DATA
      }

      // Model not found or not supported — try next
      if (data.error?.status === 'NOT_FOUND' || data.error?.code === 404) {
        console.warn(`⚠️  ${model} not available, trying next...`)
        continue
      }

      // Model not supported for this method
      if (data.error?.status === 'INVALID_ARGUMENT') {
        console.warn(`⚠️  ${model} invalid argument, trying next...`)
        continue
      }

      // Any other error — try next
      if (data.error) {
        console.warn(`⚠️  ${model} error: ${data.error.message}, trying next...`)
        continue
      }

      // Empty response
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!rawText) {
        console.warn(`⚠️  ${model} returned empty response`)
        continue
      }

      // Clean and parse JSON
      const cleaned = rawText
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/g, '')
        .trim()

      try {
        const parsed = JSON.parse(cleaned)
        console.log(`✅ Success with model: ${model} — parsed resume for: ${parsed.name}`)
        return parsed
      } catch (parseErr) {
        console.warn(`⚠️  ${model} JSON parse failed:`, parseErr.message)
        console.warn('Raw output:', cleaned.substring(0, 200))
        continue
      }

    } catch (err) {
      console.warn(`⚠️  ${model} network error:`, err.message)
      continue
    }
  }

  console.error('❌ All models failed — using mock data')
  return MOCK_DATA
}

module.exports = { callGemini }