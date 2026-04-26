import React, { useState, useRef } from 'react'
import { Upload, FileText, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

export default function UploadPanel({ onGenerate, isLoading, hasData, onEdit, portfolioData }) {
  const [mode, setMode] = useState('upload')
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState(null)
  const [file, setFile] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [template, setTemplate] = useState('modern')
  const [showQuickEdit, setShowQuickEdit] = useState(false)
  const fileRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    if (f.type === 'application/pdf' || f.name.endsWith('.txt')) {
      setFile(f); setFileName(f.name)
    } else alert('Please upload a PDF or .txt file')
  }

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleGenerate = () => {
    if (mode === 'upload' && !file) return alert('Please upload a file first')
    if (mode === 'paste' && !text.trim()) return alert('Please paste your resume text')
    onGenerate({ mode, file, text, template })
  }

  const s = {
    input: {
      width: '100%', padding: '7px 10px',
      background: 'rgba(251,113,133,0.05)',
      border: '1px solid var(--border)',
      borderRadius: '7px', color: 'var(--text-primary)',
      fontSize: '0.8rem', outline: 'none',
      fontFamily: 'DM Sans, sans-serif',
      transition: 'border-color 0.15s'
    },
    label: { fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>

      {/* Logo */}
      <div style={{ padding: '22px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{
            width: '30px', height: '30px',
            background: 'linear-gradient(135deg, #7a1f35, #fb7185)',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px'
          }}>✦</div>
          <span className="font-syne" style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Resume<span style={{ color: 'var(--accent)' }}>2</span>Portfolio
          </span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '40px' }}>
          AI-powered · Built by Adamya
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)', margin: '18px 0 16px' }} />

      <div style={{ padding: '0 22px', flex: 1 }}>

        {/* Mode toggle */}
        <div style={{
          display: 'flex', background: 'var(--bg-surface)',
          borderRadius: '8px', padding: '3px', marginBottom: '18px',
          border: '1px solid var(--border)'
        }}>
          {['upload', 'paste'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '7px 0', borderRadius: '6px', border: 'none',
              cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500',
              background: mode === m ? 'var(--accent-dim)' : 'transparent',
              color: mode === m ? 'var(--accent)' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
              transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif',
              border: mode === m ? '1px solid var(--accent-border)' : '1px solid transparent'
            }}>
              {m === 'upload' ? <Upload size={12} /> : <FileText size={12} />}
              {m === 'upload' ? 'Upload PDF' : 'Paste Text'}
            </button>
          ))}
        </div>

        {/* Upload zone */}
        {mode === 'upload' && (
          <div
            className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
            style={{
              borderRadius: '10px', padding: '28px 16px', textAlign: 'center',
              cursor: 'pointer', marginBottom: '18px',
              background: fileName ? 'var(--accent-glow)' : 'var(--bg-surface)'
            }}
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <input ref={fileRef} type="file" accept=".pdf,.txt" hidden onChange={e => handleFile(e.target.files[0])} />
            {fileName ? (
              <>
                <div style={{
                  width: '38px', height: '38px', margin: '0 auto 10px',
                  background: 'var(--accent-dim)', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FileText size={18} color="var(--accent)" />
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: '600', marginBottom: '3px' }}>{fileName}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Click to replace</p>
              </>
            ) : (
              <>
                <div style={{
                  width: '38px', height: '38px', margin: '0 auto 10px',
                  background: 'var(--bg-card)', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Upload size={18} color="var(--text-muted)" />
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>Drop your resume here</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PDF or TXT · click to browse</p>
              </>
            )}
          </div>
        )}

        {/* Paste textarea */}
        {mode === 'paste' && (
          <textarea
            value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste your resume text here..."
            style={{
              ...s.input, height: '160px', resize: 'none',
              lineHeight: '1.6', marginBottom: '18px', padding: '12px 14px'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        )}

        {/* Template selector */}
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Portfolio Style
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '18px' }}>
          {[
            { id: 'modern', label: 'Modern Developer', desc: 'Dark, immersive' },
            { id: 'minimal', label: 'Minimal', desc: 'Clean editorial' },
          ].map(t => (
            <button key={t.id} onClick={() => setTemplate(t.id)} style={{
              padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
              border: template === t.id ? '1px solid var(--accent-border)' : '1px solid var(--border)',
              background: template === t.id ? 'var(--accent-dim)' : 'var(--bg-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'all 0.15s', textAlign: 'left', fontFamily: 'DM Sans, sans-serif'
            }}>
              <div>
                <p style={{ fontSize: '0.82rem', fontWeight: '600', color: template === t.id ? 'var(--accent)' : 'var(--text-secondary)' }}>{t.label}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>{t.desc}</p>
              </div>
              {template === t.id && (
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              )}
            </button>
          ))}
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate} disabled={isLoading}
          className={!isLoading ? 'glow-btn' : ''}
          style={{
            width: '100%', padding: '12px',
            background: isLoading
              ? 'rgba(122,31,53,0.4)'
              : 'linear-gradient(135deg, #7a1f35 0%, #fb7185 100%)',
            border: 'none', borderRadius: '9px', color: 'white',
            fontWeight: '700', fontSize: '0.88rem', cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontFamily: 'Syne, sans-serif', letterSpacing: '0.01em',
            transition: 'opacity 0.2s'
          }}
        >
          {isLoading
            ? <><Loader2 size={15} className="animate-spin" /> Generating...</>
            : <><Sparkles size={15} /> Generate Portfolio</>}
        </button>

        {/* Quick Edit */}
        {hasData && portfolioData && (
          <div style={{ marginTop: '14px' }}>
            <button onClick={() => setShowQuickEdit(!showQuickEdit)} style={{
              width: '100%', padding: '8px', borderRadius: '7px',
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              {showQuickEdit ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              Quick Edit
            </button>

            {showQuickEdit && (
              <div style={{
                marginTop: '8px', padding: '14px',
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px'
              }}>
                {['name','title','email','summary'].map(field => (
                  <div key={field}>
                    <label style={s.label}>{field}</label>
                    {field === 'summary' ? (
                      <textarea value={portfolioData[field] || ''} onChange={e => onEdit(field, e.target.value)}
                        rows={3} style={{ ...s.input, resize: 'none', lineHeight: '1.5' }}
                        onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                    ) : (
                      <input value={portfolioData[field] || ''} onChange={e => onEdit(field, e.target.value)}
                        style={s.input}
                        onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                    )}
                  </div>
                ))}
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>Live preview updates instantly</p>
              </div>
            )}
          </div>
        )}

        {/* Note */}
        <div style={{
          marginTop: '14px', marginBottom: '22px', padding: '10px 12px',
          background: 'var(--accent-glow)', border: '1px solid var(--border)',
          borderRadius: '8px'
        }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            ✦ Uses Gemini AI to extract resume data. Falls back to demo portfolio if backend is offline.
          </p>
        </div>

      </div>
    </div>
  )
}
