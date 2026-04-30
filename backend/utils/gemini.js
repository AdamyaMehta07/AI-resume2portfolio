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

async function callGroq(resumeText) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey || apiKey === 'gsk_your_key_here') {
    console.warn('⚠️  GROQ_API_KEY missing — using mock data')
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

  // Try models in order — all free on Groq
  const models = [
    'llama-3.1-8b-instant',
    'llama3-8b-8192',
    'mixtral-8x7b-32768',
    'gemma2-9b-it',
  ]

  for (const model of models) {
    try {
      console.log(`Trying Groq model: ${model}`)

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a resume parser. Always respond with only valid JSON. No markdown, no explanation.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 2048
        })
      })

      const data = await response.json()

      // Invalid API key
      if (data.error?.code === 'invalid_api_key') {
        console.error('Invalid Groq API key — check your .env file')
        return MOCK_DATA
      }

      // Rate limited — try next model
      if (data.error?.code === 'rate_limit_exceeded') {
        console.warn(`Rate limited on ${model} — trying next model`)
        continue
      }

      // Model not found — try next
      if (data.error?.code === 'model_not_found') {
        console.warn(`Model ${model} not found — trying next`)
        continue
      }

      // Any other error
      if (data.error) {
        console.warn(`Groq error on ${model}: ${data.error.message}`)
        continue
      }

      // Get response text
      const rawText = data.choices?.[0]?.message?.content
      if (!rawText) {
        console.warn(`${model} returned empty response`)
        continue
      }

      console.log('Raw response (first 200 chars):', rawText.substring(0, 200))

      // Clean markdown fences if present
      const cleaned = rawText
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/g, '')
        .trim()

      // Parse JSON
      try {
        const parsed = JSON.parse(cleaned)
        console.log(`SUCCESS — Groq model: ${model} — parsed for: ${parsed.name}`)
        return parsed
      } catch (parseErr) {
        console.warn(`JSON parse failed for ${model}:`, cleaned.substring(0, 200))
        continue
      }

    } catch (networkErr) {
      console.warn(`Network error on ${model}:`, networkErr.message)
      continue
    }
  }

  console.error('All Groq models failed — using mock data')
  return MOCK_DATA
}

// Keep the export name same so no other files need to change
module.exports = { callGemini: callGroq }