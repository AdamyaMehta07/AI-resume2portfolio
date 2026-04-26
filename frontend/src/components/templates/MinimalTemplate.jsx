import React from 'react'

export default function MinimalTemplate({ data }) {
  const { name, title, email, phone, location, github, summary, skills, projects, experience, education } = data

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#fdf8f5', minHeight: '100vh', color: '#2a1018' }}>

      {/* Hero */}
      <header style={{ padding: '60px 80px 44px', borderBottom: '1px solid #e8d8d8' }}>
        <div style={{
          display: 'inline-block', padding: '3px 12px', marginBottom: '18px',
          background: 'rgba(122,31,53,0.07)', border: '1px solid rgba(122,31,53,0.15)',
          borderRadius: '20px', fontSize: '0.7rem', color: '#7a1f35',
          letterSpacing: '0.12em', textTransform: 'uppercase'
        }}>Portfolio</div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontSize: '3rem',
          fontWeight: '800', letterSpacing: '-0.02em',
          marginBottom: '8px', color: '#1a0810'
        }}>{name}</h1>

        <p style={{ fontSize: '1rem', color: '#7a1f35', fontStyle: 'italic', marginBottom: '22px', fontFamily: 'Georgia, serif' }}>{title}</p>

        <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap', fontSize: '0.84rem', color: '#b08090' }}>
          {[email, phone, location, github].filter(Boolean).map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </header>

      <main style={{ padding: '0 80px 60px', maxWidth: '900px' }}>

        {summary && (
          <section style={{ padding: '40px 0', borderBottom: '1px solid #e8d8d8' }}>
            <SLabel>About</SLabel>
            <p style={{ fontSize: '1.02rem', lineHeight: '1.82', color: '#4a2030' }}>{summary}</p>
          </section>
        )}

        {skills?.length > 0 && (
          <section style={{ padding: '40px 0', borderBottom: '1px solid #e8d8d8' }}>
            <SLabel>Skills</SLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map((skill, i) => (
                <span key={i} style={{
                  padding: '4px 14px',
                  border: '1px solid rgba(122,31,53,0.2)',
                  background: 'rgba(122,31,53,0.04)',
                  fontSize: '0.84rem', color: '#7a1f35', borderRadius: '4px'
                }}>{skill}</span>
              ))}
            </div>
          </section>
        )}

        {experience?.length > 0 && (
          <section style={{ padding: '40px 0', borderBottom: '1px solid #e8d8d8' }}>
            <SLabel>Experience</SLabel>
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: '160px 1fr', gap: '24px' }}>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '0.92rem', color: '#2a1018', fontFamily: 'Syne, sans-serif' }}>{exp.company}</p>
                  <p style={{ color: '#b08090', fontSize: '0.8rem', marginTop: '3px' }}>{exp.period}</p>
                </div>
                <div>
                  <p style={{ fontStyle: 'italic', marginBottom: '6px', color: '#7a1f35', fontSize: '0.95rem' }}>{exp.role}</p>
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.75', color: '#6a3040' }}>{exp.description}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {projects?.length > 0 && (
          <section style={{ padding: '40px 0', borderBottom: '1px solid #e8d8d8' }}>
            <SLabel>Projects</SLabel>
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: '28px', paddingBottom: '28px', borderBottom: i < projects.length - 1 ? '1px dashed #ead8d8' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '7px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1a0810', fontFamily: 'Syne, sans-serif' }}>{proj.name}</h3>
                  {proj.link && <a href={proj.link} style={{ fontSize: '0.78rem', color: '#7a1f35', textDecoration: 'none' }}>↗ view</a>}
                </div>
                <p style={{ fontSize: '0.88rem', lineHeight: '1.72', color: '#6a3040', marginBottom: '8px' }}>{proj.description}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {proj.tech?.map((t, j) => (
                    <span key={j} style={{ fontSize: '0.76rem', color: '#b08090', fontStyle: 'italic' }}>
                      {t}{j < proj.tech.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {education?.length > 0 && (
          <section style={{ padding: '40px 0', borderBottom: '1px solid #e8d8d8' }}>
            <SLabel>Education</SLabel>
            {education.map((edu, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '24px', marginBottom: '18px' }}>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '0.92rem', fontFamily: 'Syne, sans-serif', color: '#2a1018' }}>{edu.institution}</p>
                  <p style={{ color: '#b08090', fontSize: '0.8rem', marginTop: '3px' }}>{edu.period}</p>
                </div>
                <div>
                  <p style={{ color: '#4a2030', fontSize: '0.9rem' }}>{edu.degree}</p>
                  {edu.details && <p style={{ fontSize: '0.82rem', color: '#b08090', marginTop: '4px' }}>{edu.details}</p>}
                </div>
              </div>
            ))}
          </section>
        )}

        <section style={{ padding: '40px 0' }}>
          <SLabel>Contact</SLabel>
          <p style={{ fontSize: '0.95rem', color: '#6a3040', lineHeight: '1.8' }}>
            Open to interesting conversations and opportunities.
          </p>
          {email && (
            <a href={`mailto:${email}`} style={{
              display: 'inline-block', marginTop: '14px',
              padding: '11px 28px',
              background: 'linear-gradient(135deg, #7a1f35, #a83050)',
              color: '#fdf8f5', textDecoration: 'none',
              borderRadius: '6px', fontSize: '0.88rem',
              fontFamily: 'Syne, sans-serif', fontWeight: '700'
            }}>{email}</a>
          )}
        </section>
      </main>
    </div>
  )
}

function SLabel({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
      <div style={{ width: '16px', height: '1px', background: '#7a1f35' }} />
      <p style={{ fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#b08090' }}>
        {children}
      </p>
    </div>
  )
}
