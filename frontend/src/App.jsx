import React, { useState } from 'react'
import UploadPanel from './components/UploadPanel'
import PreviewPanel from './components/PreviewPanel'
import EditModal from './components/EditModal'
import { MOCK_DATA } from './mockData'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function App() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [template, setTemplate] = useState('modern')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showEdit, setShowEdit] = useState(false)

  const handleGenerate = async ({ mode, file, text, template: chosenTemplate }) => {
    setTemplate(chosenTemplate)
    setError(null)
    setLoading(true)

    try {
      let extractedData
      if (mode === 'upload' && file) {
        const formData = new FormData()
        formData.append('resume', file)
        const res = await fetch(`${API_URL}/api/parse-resume`, { method: 'POST', body: formData })
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        extractedData = await res.json()
      } else if (mode === 'paste' && text?.trim()) {
        const res = await fetch(`${API_URL}/api/parse-text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        })
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        extractedData = await res.json()
      } else {
        throw new Error('No resume content provided')
      }
      setPortfolioData(extractedData)
    } catch (err) {
      console.warn('API failed, using mock data:', err.message)
      setError(`Demo mode — connect backend for real AI parsing.`)
      await new Promise(r => setTimeout(r, 900))
      setPortfolioData(MOCK_DATA)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickEdit = (field, value) => {
    setPortfolioData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>

      {/* LEFT PANEL */}
      <div style={{
        width: '310px', flexShrink: 0,
        borderRight: '1px solid var(--border)',
        background: 'var(--bg-panel)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <UploadPanel
          onGenerate={handleGenerate}
          isLoading={loading}
          hasData={!!portfolioData}
          onEdit={handleQuickEdit}
          portfolioData={portfolioData}
        />
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div style={{
          height: '38px', flexShrink: 0,
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px',
          background: 'rgba(20,11,15,0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Template:</span>
            <span style={{
              fontSize: '0.72rem', color: 'var(--accent)',
              padding: '2px 8px', background: 'var(--accent-dim)',
              borderRadius: '20px', fontWeight: '500',
              border: '1px solid var(--accent-border)'
            }}>
              {template === 'modern' ? 'Modern Developer' : 'Minimal'}
            </span>
          </div>

          {error && (
            <span style={{ fontSize: '0.7rem', color: '#f59e0b', opacity: 0.8 }}>
              ◈ {error}
            </span>
          )}

          {portfolioData && (
            <button onClick={() => setShowEdit(true)} style={{
              padding: '4px 12px', borderRadius: '6px',
              border: '1px solid var(--border-strong)',
              background: 'var(--accent-glow)',
              color: 'var(--accent)', fontSize: '0.75rem', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              ✦ Full Edit
            </button>
          )}
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          <PreviewPanel data={portfolioData} template={template} />
        </div>
      </div>

      {showEdit && portfolioData && (
        <EditModal
          data={portfolioData}
          onSave={(updated) => { setPortfolioData(updated); setShowEdit(false) }}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  )
}
