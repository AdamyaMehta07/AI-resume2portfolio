import React from 'react'

export default function ModernTemplate({ data }) {
  const { name, title, email, phone, location, github, summary, skills, projects, experience, education } = data

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#100a0d', minHeight: '100vh', color: '#fff0f3' }}>

      {/* Hero */}
      <header style={{
        padding: '64px 64px 48px',
        background: 'linear-gradient(135deg, #100a0d 0%, #1e0a14 60%, #100a0d 100%)',
        borderBottom: '1px solid rgba(251,113,133,0.12)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Orb */}
        <div style={{
          position: 'absolute', top: '-80px', right: '60px',
          width: '340px', height: '340px',
          background: 'radial-gradient(circle, rgba(122,31,53,0.25) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '30%',
          width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(251,113,133,0.06) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 14px', marginBottom: '22px',
          background: 'rgba(251,113,133,0.1)',
          border: '1px solid rgba(251,113,133,0.22)',
          borderRadius: '20px', fontSize: '0.72rem',
          color: '#fb7185', letterSpacing: '0.12em', textTransform: 'uppercase'
        }}>
          <span>✦</span> Portfolio
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontSize: '3.6rem',
          fontWeight: '800', letterSpacing: '-0.03em',
          marginBottom: '8px', lineHeight: 1,
          background: 'linear-gradient(135deg, #fff0f3 30%, #fb7185 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>{name}</h1>

        <p style={{ fontSize: '1.05rem', color: '#fb7185', marginBottom: '26px', fontWeight: '300', opacity: 0.9 }}>{title}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
          {[email, phone, location, github].filter(Boolean).map((item, i) => (
            <span key={i} style={{ fontSize: '0.82rem', color: '#7a4a56', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: '#7a1f35' }}>◈</span> {item}
            </span>
          ))}
        </div>
      </header>

      <main style={{ padding: '0 64px 64px', maxWidth: '960px' }}>

        {/* About */}
        {summary && (
          <section style={{ padding: '48px 0', borderBottom: '1px solid rgba(251,113,133,0.07)' }}>
            <STitle>About</STitle>
            <p style={{ fontSize: '1rem', lineHeight: '1.85', color: '#c9a0ad', maxWidth: '700px' }}>{summary}</p>
          </section>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <section style={{ padding: '48px 0', borderBottom: '1px solid rgba(251,113,133,0.07)' }}>
            <STitle>Skills</STitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map((skill, i) => (
                <span key={i} style={{
                  padding: '6px 16px',
                  background: 'rgba(251,113,133,0.07)',
                  border: '1px solid rgba(251,113,133,0.18)',
                  borderRadius: '6px', fontSize: '0.84rem', color: '#ffb3c0',
                  fontFamily: "'JetBrains Mono', monospace"
                }}>{skill}</span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <section style={{ padding: '48px 0', borderBottom: '1px solid rgba(251,113,133,0.07)' }}>
            <STitle>Experience</STitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {experience.map((exp, i) => (
                <div key={i} style={{
                  padding: '22px 24px',
                  background: 'rgba(251,113,133,0.03)',
                  border: '1px solid rgba(251,113,133,0.09)',
                  borderLeft: '3px solid #7a1f35',
                  borderRadius: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff0f3' }}>{exp.role}</h3>
                      <p style={{ color: '#fb7185', fontSize: '0.88rem', marginTop: '2px', opacity: 0.85 }}>{exp.company}</p>
                    </div>
                    <span style={{
                      padding: '3px 10px', background: 'rgba(122,31,53,0.3)',
                      borderRadius: '20px', fontSize: '0.76rem', color: '#7a4a56'
                    }}>{exp.period}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.72', color: '#7a4a56' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <section style={{ padding: '48px 0', borderBottom: '1px solid rgba(251,113,133,0.07)' }}>
            <STitle>Projects</STitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
              {projects.map((proj, i) => (
                <div key={i} style={{
                  padding: '22px', background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(251,113,133,0.08)', borderRadius: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '0.93rem', fontWeight: '600', color: '#fff0f3' }}>{proj.name}</h3>
                    {proj.link && <a href={proj.link} style={{ color: '#fb7185', fontSize: '0.8rem', textDecoration: 'none', opacity: 0.8 }}>↗</a>}
                  </div>
                  <p style={{ fontSize: '0.84rem', lineHeight: '1.65', color: '#7a4a56', marginBottom: '14px' }}>{proj.description}</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {proj.tech?.map((t, j) => (
                      <span key={j} style={{
                        fontSize: '0.72rem', padding: '2px 8px',
                        background: 'rgba(122,31,53,0.2)',
                        border: '1px solid rgba(251,113,133,0.1)',
                        borderRadius: '4px', color: '#7a4a56'
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section style={{ padding: '48px 0', borderBottom: '1px solid rgba(251,113,133,0.07)' }}>
            <STitle>Education</STitle>
            {education.map((edu, i) => (
              <div key={i} style={{
                padding: '18px 22px', marginBottom: '10px',
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(251,113,133,0.07)',
                borderRadius: '10px', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'
              }}>
                <div>
                  <h3 style={{ fontWeight: '600', fontSize: '0.93rem', color: '#fff0f3' }}>{edu.institution}</h3>
                  <p style={{ color: '#7a4a56', fontSize: '0.86rem', marginTop: '3px' }}>{edu.degree}</p>
                  {edu.details && <p style={{ color: '#4a2a36', fontSize: '0.8rem', marginTop: '2px' }}>{edu.details}</p>}
                </div>
                <span style={{ color: '#fb7185', fontSize: '0.82rem', opacity: 0.7 }}>{edu.period}</span>
              </div>
            ))}
          </section>
        )}

        {/* Contact */}
        <section style={{ padding: '48px 0' }}>
          <STitle>Contact</STitle>
          <div style={{
            padding: '36px', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(122,31,53,0.15), rgba(251,113,133,0.06))',
            border: '1px solid rgba(251,113,133,0.15)', borderRadius: '16px'
          }}>
            <p style={{ color: '#7a4a56', marginBottom: '20px', fontSize: '0.95rem' }}>Open to new opportunities</p>
            {email && (
              <a href={`mailto:${email}`} style={{
                display: 'inline-block', padding: '13px 32px',
                background: 'linear-gradient(135deg, #7a1f35, #fb7185)',
                color: 'white', borderRadius: '8px', textDecoration: 'none',
                fontFamily: "'Syne', sans-serif", fontWeight: '700', fontSize: '0.88rem'
              }}>
                ✦ {email}
              </a>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function STitle({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
      <div style={{ width: '3px', height: '16px', background: '#7a1f35', borderRadius: '2px' }} />
      <h2 style={{ fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4a2030', fontWeight: '500' }}>
        {children}
      </h2>
    </div>
  )
}
