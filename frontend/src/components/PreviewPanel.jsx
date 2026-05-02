import React, { useState } from 'react'
import { Download, Monitor, Smartphone } from 'lucide-react'
import MinimalTemplate from './templates/MinimalTemplate'
import ModernTemplate from './templates/ModernTemplate'

function generateHTML(data, template) {
  const isDark = template === 'modern'
  const bg = isDark ? '#0d0d14' : '#fafaf8'
  const fg = isDark ? '#e2e2f0' : '#1a1a1a'
  const accent = isDark ? '#fb7185' : '#7a1f35'
  const skills = data.skills?.map(s => `<span style="padding:5px 14px;border:1px solid ${isDark ? 'rgba(251,113,133,0.25)' : '#ddd'};font-size:0.84rem;background:${isDark ? 'rgba(251,113,133,0.08)' : '#fff'};color:${isDark ? '#ffb3c0' : '#555'};border-radius:6px;display:inline-block;margin:3px">${s}</span>`).join('') || ''
  const experience = data.experience?.map(e => `<div style="margin-bottom:28px;padding:20px;background:${isDark ? 'rgba(251,113,133,0.04)' : '#fff'};border:1px solid ${isDark ? 'rgba(251,113,133,0.1)' : '#eee'};border-radius:10px;border-left:3px solid ${accent}"><h3 style="font-size:1rem;font-weight:600;color:${fg}">${e.role} <span style="color:${accent}">@ ${e.company}</span></h3><p style="color:#888;font-size:0.82rem;margin:4px 0 8px">${e.period}</p><p style="font-size:0.88rem;line-height:1.7;color:${isDark ? '#999' : '#555'}">${e.description}</p></div>`).join('') || ''
  const projects = data.projects?.map(p => `<div style="margin-bottom:20px;padding:20px;background:${isDark ? 'rgba(255,255,255,0.02)' : '#fff'};border:1px solid ${isDark ? 'rgba(251,113,133,0.08)' : '#eee'};border-radius:10px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><h3 style="font-size:0.95rem;font-weight:600;color:${fg}">${p.name}</h3>${p.link ? `<a href="${p.link}" style="color:${accent};font-size:0.8rem;text-decoration:none">↗ view</a>` : ''}</div><p style="font-size:0.85rem;line-height:1.65;color:${isDark ? '#888' : '#555'};margin-bottom:10px">${p.description}</p><div style="display:flex;gap:6px;flex-wrap:wrap">${p.tech?.map(t => `<span style="font-size:0.72rem;padding:2px 8px;background:${isDark ? 'rgba(251,113,133,0.08)' : '#f5f5f5'};border-radius:4px;color:#888">${t}</span>`).join('') || ''}</div></div>`).join('') || ''
  const education = data.education?.map(e => `<div style="margin-bottom:14px;padding:16px 20px;background:${isDark ? 'rgba(255,255,255,0.02)' : '#fff'};border:1px solid ${isDark ? 'rgba(251,113,133,0.08)' : '#eee'};border-radius:8px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><div><h3 style="font-weight:600;font-size:0.92rem;color:${fg}">${e.institution}</h3><p style="color:#888;font-size:0.85rem;margin-top:3px">${e.degree}</p>${e.details ? `<p style="color:#666;font-size:0.8rem;margin-top:2px">${e.details}</p>` : ''}</div><span style="color:${accent};font-size:0.82rem">${e.period}</span></div>`).join('') || ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${data.name} — Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:${bg};color:${fg};min-height:100vh}
section{padding:44px 64px;border-bottom:1px solid ${isDark ? 'rgba(251,113,133,0.08)' : '#ece8e4'}}
header{padding:64px 64px 44px;border-bottom:1px solid ${isDark ? 'rgba(251,113,133,0.15)' : '#ece8e4'};background:${isDark ? 'linear-gradient(135deg,#100a0d,#1e0a14)' : 'transparent'}}
h2{font-size:0.68rem;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin-bottom:20px;display:flex;align-items:center;gap:10px}
h2::before{content:'';display:inline-block;width:3px;height:14px;background:${accent};border-radius:2px}
</style>
</head>
<body>
<header>
<div style="display:inline-block;padding:3px 12px;background:rgba(251,113,133,0.1);border:1px solid rgba(251,113,133,0.2);border-radius:20px;font-size:0.72rem;color:${accent};letter-spacing:0.1em;text-transform:uppercase;margin-bottom:18px">Portfolio</div>
<h1 style="font-family:'Syne',sans-serif;font-size:3.2rem;font-weight:800;letter-spacing:-0.03em;margin-bottom:8px">${data.name || ''}</h1>
<p style="color:${accent};font-size:1rem;margin-bottom:22px;font-weight:300">${data.title || ''}</p>
<p style="font-size:0.84rem;color:#888">${[data.email,data.location,data.github].filter(Boolean).join(' · ')}</p>
</header>
${data.summary ? `<section><h2>About</h2><p style="font-size:1rem;line-height:1.85;color:${isDark ? '#bbb' : '#444'};max-width:680px">${data.summary}</p></section>` : ''}
${skills ? `<section><h2>Skills</h2><div style="display:flex;flex-wrap:wrap;gap:8px">${skills}</div></section>` : ''}
${experience ? `<section><h2>Experience</h2>${experience}</section>` : ''}
${projects ? `<section><h2>Projects</h2>${projects}</section>` : ''}
${education ? `<section><h2>Education</h2>${education}</section>` : ''}
<section style="text-align:center">
<h2 style="justify-content:center">Contact</h2>
${data.email ? `<a href="mailto:${data.email}" style="display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#7a1f35,${accent});color:white;border-radius:8px;text-decoration:none;font-family:'Syne',sans-serif;font-weight:600">${data.email}</a>` : ''}
</section>
<footer style="padding:18px 64px;text-align:center;font-size:0.75rem;color:#555;border-top:1px solid ${isDark ? 'rgba(251,113,133,0.06)' : '#ece8e4'}">
Made with Resume2Portfolio · Rose Studio Theme
</footer>
</body></html>`
}

export default function PreviewPanel({ data, template }) {
  const [viewport, setViewport] = useState('desktop')

  const handleExport = () => {
    if (!data) return
    const html = generateHTML(data, template)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(data.name || 'portfolio').replace(/\s+/g, '-').toLowerCase()}-portfolio.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!data) {
    return (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '20px'
      }}>
        <div style={{ position: 'relative', width: '90px', height: '90px' }}>
          <div style={{
            width: '90px', height: '90px', borderRadius: '50%',
            border: '1px solid var(--accent-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'var(--accent-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px'
            }}>✦</div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p className="font-syne" style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Live Preview
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '240px', lineHeight: '1.6' }}>
            Upload your resume and generate your portfolio to see it here
          </p>
        </div>

        <div style={{
          padding: '16px 20px', background: 'var(--bg-surface)',
          border: '1px solid var(--border)', borderRadius: '10px', width: '220px'
        }}>
          {['Hero · Name & Title', 'About & Summary', 'Skills Grid', 'Experience', 'Projects', 'Education', 'Contact'].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-border)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const TemplateComponent = template === 'minimal' ? MinimalTemplate : ModernTemplate

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Browser toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-panel)', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7a1f35' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a83050' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
          <span style={{ marginLeft: '10px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
            {data.name?.toLowerCase().replace(/\s+/g, '-')}.portfolio.html
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Viewport toggle */}
          <div style={{
            display: 'flex', background: 'var(--bg-surface)',
            borderRadius: '6px', padding: '2px', border: '1px solid var(--border)'
          }}>
            {[
              { id: 'desktop', icon: <Monitor size={13} /> },
              { id: 'mobile', icon: <Smartphone size={13} /> },
            ].map(v => (
              <button key={v.id} onClick={() => setViewport(v.id)} style={{
                padding: '5px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                background: viewport === v.id ? 'var(--accent-dim)' : 'transparent',
                color: viewport === v.id ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'all 0.15s'
              }}>
                {v.icon}
              </button>
            ))}
          </div>

          {/* Export button */}
          <button onClick={handleExport} style={{
            padding: '6px 14px', borderRadius: '6px',
            border: '1px solid var(--accent-border)',
            background: 'var(--accent-dim)', color: 'var(--accent)',
            fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '5px',
            fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s'
          }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(251,113,133,0.25)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--accent-dim)'}
          >
            <Download size={12} /> Export HTML
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE PREVIEW AREA ── */}
      <div
        className="preview-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: viewport === 'mobile' ? '20px' : '0',
          display: 'flex',
          justifyContent: viewport === 'mobile' ? 'center' : 'flex-start',
          background: viewport === 'mobile' ? 'rgba(10,5,8,0.6)' : 'transparent'
        }}
      >
        <div style={{
          width: viewport === 'mobile' ? '390px' : '100%',
          flexShrink: 0,
          boxShadow: viewport === 'mobile' ? '0 0 60px rgba(251,113,133,0.1)' : 'none',
          borderRadius: viewport === 'mobile' ? '16px' : '0',
          overflow: 'visible'
        }}>
          <TemplateComponent data={data} />
        </div>
      </div>

    </div>
  )
}