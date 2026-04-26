import React, { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

export default function EditModal({ data, onSave, onClose }) {
  const [form, setForm] = useState(JSON.parse(JSON.stringify(data)))
  const [activeSection, setActiveSection] = useState('basic')

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))
  const updateItem = (key, index, field, value) => {
    setForm(prev => {
      const arr = JSON.parse(JSON.stringify(prev[key] || []))
      arr[index][field] = value
      return { ...prev, [key]: arr }
    })
  }
  const addItem = (key, tpl) => setForm(prev => ({ ...prev, [key]: [...(prev[key] || []), { ...tpl }] }))
  const removeItem = (key, index) => setForm(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }))

  const sections = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'summary', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
  ]

  const inputStyle = {
    width: '100%', padding: '8px 12px',
    background: 'rgba(251,113,133,0.05)',
    border: '1px solid rgba(251,113,133,0.12)',
    borderRadius: '7px', color: '#fff0f3',
    fontSize: '0.84rem', outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 0.15s'
  }
  const labelStyle = { fontSize: '0.7rem', color: '#7a4a56', display: 'block', marginBottom: '5px' }
  const focusIn = e => e.target.style.borderColor = 'rgba(251,113,133,0.4)'
  const focusOut = e => e.target.style.borderColor = 'rgba(251,113,133,0.12)'

  const cardStyle = {
    padding: '16px', marginBottom: '12px',
    background: 'rgba(251,113,133,0.03)',
    border: '1px solid rgba(251,113,133,0.08)',
    borderRadius: '10px'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(10,4,7,0.82)', backdropFilter: 'blur(8px)', padding: '16px'
    }}>
      <div style={{
        background: '#140b0f', border: '1px solid rgba(251,113,133,0.14)',
        borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '88vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 32px 80px rgba(122,31,53,0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: '1px solid rgba(251,113,133,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '3px', height: '20px', background: '#7a1f35', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff0f3', fontFamily: 'Syne, sans-serif' }}>
              Edit Portfolio
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#7a4a56', cursor: 'pointer' }}>
            <X size={17} />
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <div style={{
            width: '140px', flexShrink: 0, padding: '12px 10px',
            borderRight: '1px solid rgba(251,113,133,0.06)',
            display: 'flex', flexDirection: 'column', gap: '3px'
          }}>
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                padding: '8px 12px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontSize: '0.81rem', fontWeight: '500',
                background: activeSection === s.id ? 'rgba(251,113,133,0.12)' : 'transparent',
                color: activeSection === s.id ? '#fb7185' : '#7a4a56',
                fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                borderLeft: activeSection === s.id ? '2px solid #7a1f35' : '2px solid transparent'
              }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

            {activeSection === 'basic' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {['name','title','email','phone','location','github','linkedin'].map(f => (
                  <div key={f} style={f === 'name' || f === 'title' ? { gridColumn: 'span 2' } : {}}>
                    <label style={labelStyle}>{f}</label>
                    <input value={form[f] || ''} onChange={e => update(f, e.target.value)}
                      style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'summary' && (
              <>
                <label style={labelStyle}>About / Summary</label>
                <textarea value={form.summary || ''} onChange={e => update('summary', e.target.value)}
                  rows={9} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.65' }}
                  onFocus={focusIn} onBlur={focusOut} />
              </>
            )}

            {activeSection === 'skills' && (
              <>
                <label style={labelStyle}>Skills — one per line</label>
                <textarea value={(form.skills || []).join('\n')}
                  onChange={e => update('skills', e.target.value.split('\n'))}
                  rows={12} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', lineHeight: '1.9' }}
                  onFocus={focusIn} onBlur={focusOut} />
              </>
            )}

            {activeSection === 'experience' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                  <button onClick={() => addItem('experience', { company:'', role:'', period:'', description:'' })}
                    style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 12px', background:'rgba(251,113,133,0.1)', border:'1px solid rgba(251,113,133,0.2)', borderRadius:'6px', color:'#fb7185', fontSize:'0.79rem', cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>
                    <Plus size={13} /> Add Role
                  </button>
                </div>
                {(form.experience || []).map((exp, i) => (
                  <div key={i} style={cardStyle}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
                      <span style={{ fontSize:'0.72rem', color:'#fb7185', fontWeight:'700' }}>Role {i+1}</span>
                      <button onClick={() => removeItem('experience', i)} style={{ background:'none', border:'none', color:'#7a4a56', cursor:'pointer' }}><Trash2 size={13} /></button>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px' }}>
                      {['company','role','period'].map(f => (
                        <div key={f}>
                          <label style={labelStyle}>{f}</label>
                          <input value={exp[f]||''} onChange={e => updateItem('experience',i,f,e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                        </div>
                      ))}
                    </div>
                    <label style={labelStyle}>description</label>
                    <textarea value={exp.description||''} onChange={e => updateItem('experience',i,'description',e.target.value)}
                      rows={3} style={{...inputStyle, resize:'vertical'}} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                ))}
              </>
            )}

            {activeSection === 'projects' && (
              <>
                <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'12px' }}>
                  <button onClick={() => addItem('projects', { name:'', description:'', tech:[], link:'' })}
                    style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 12px', background:'rgba(251,113,133,0.1)', border:'1px solid rgba(251,113,133,0.2)', borderRadius:'6px', color:'#fb7185', fontSize:'0.79rem', cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>
                    <Plus size={13} /> Add Project
                  </button>
                </div>
                {(form.projects || []).map((proj, i) => (
                  <div key={i} style={cardStyle}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
                      <span style={{ fontSize:'0.72rem', color:'#fb7185', fontWeight:'700' }}>Project {i+1}</span>
                      <button onClick={() => removeItem('projects', i)} style={{ background:'none', border:'none', color:'#7a4a56', cursor:'pointer' }}><Trash2 size={13} /></button>
                    </div>
                    {['name','link'].map(f => (
                      <div key={f} style={{ marginBottom:'10px' }}>
                        <label style={labelStyle}>{f}</label>
                        <input value={proj[f]||''} onChange={e => updateItem('projects',i,f,e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                      </div>
                    ))}
                    <div style={{ marginBottom:'10px' }}>
                      <label style={labelStyle}>description</label>
                      <textarea value={proj.description||''} onChange={e => updateItem('projects',i,'description',e.target.value)}
                        rows={3} style={{...inputStyle, resize:'vertical'}} onFocus={focusIn} onBlur={focusOut} />
                    </div>
                    <label style={labelStyle}>tech (comma separated)</label>
                    <input value={(proj.tech||[]).join(', ')} onChange={e => updateItem('projects',i,'tech',e.target.value.split(',').map(t=>t.trim()).filter(Boolean))} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                  </div>
                ))}
              </>
            )}

            {activeSection === 'education' && (
              <>
                <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'12px' }}>
                  <button onClick={() => addItem('education', { institution:'', degree:'', period:'', details:'' })}
                    style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 12px', background:'rgba(251,113,133,0.1)', border:'1px solid rgba(251,113,133,0.2)', borderRadius:'6px', color:'#fb7185', fontSize:'0.79rem', cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>
                    <Plus size={13} /> Add
                  </button>
                </div>
                {(form.education || []).map((edu, i) => (
                  <div key={i} style={cardStyle}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
                      <span style={{ fontSize:'0.72rem', color:'#fb7185', fontWeight:'700' }}>Education {i+1}</span>
                      <button onClick={() => removeItem('education', i)} style={{ background:'none', border:'none', color:'#7a4a56', cursor:'pointer' }}><Trash2 size={13} /></button>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                      {['institution','degree','period','details'].map(f => (
                        <div key={f} style={f==='institution'||f==='degree' ? { gridColumn:'span 2' } : {}}>
                          <label style={labelStyle}>{f}</label>
                          <input value={edu[f]||''} onChange={e => updateItem('education',i,f,e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display:'flex', gap:'10px', padding:'16px 22px', borderTop:'1px solid rgba(251,113,133,0.08)' }}>
          <button onClick={onClose} style={{
            flex:1, padding:'10px', borderRadius:'8px',
            border:'1px solid rgba(251,113,133,0.1)',
            background:'transparent', color:'#7a4a56',
            fontSize:'0.84rem', cursor:'pointer', fontFamily:'DM Sans,sans-serif'
          }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{
            flex:2, padding:'10px', borderRadius:'8px', border:'none',
            background:'linear-gradient(135deg, #7a1f35, #fb7185)',
            color:'white', fontSize:'0.84rem', fontWeight:'700',
            cursor:'pointer', fontFamily:'Syne,sans-serif'
          }}>✦ Save & Apply</button>
        </div>
      </div>
    </div>
  )
}
