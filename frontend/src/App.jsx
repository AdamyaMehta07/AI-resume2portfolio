import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import UploadPanel from './components/UploadPanel'
import PreviewPanel from './components/PreviewPanel'
import EditModal from './components/EditModal'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { useRateLimit } from './hooks/useRateLimit'
import { MOCK_DATA } from './mockData'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function Navbar({ user, onLogout }) {
  return (
    <div style={{
      height: '48px', flexShrink: 0,
      borderBottom: '1px solid rgba(251,113,133,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', background: '#0d0810'
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '24px', height: '24px',
          background: 'linear-gradient(135deg, #7a1f35, #fb7185)',
          borderRadius: '6px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '11px'
        }}>✦</div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '0.95rem', color: '#fff0f3' }}>
          Resume<span style={{ color: '#fb7185' }}>2</span>Portfolio
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {user ? (
          <>
            {/* Avatar + name */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '4px 12px 4px 6px',
              background: 'rgba(251,113,133,0.07)',
              border: '1px solid rgba(251,113,133,0.15)',
              borderRadius: '20px'
            }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #7a1f35, #fb7185)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: '700', color: 'white'
              }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#ffb3c0', fontWeight: '500' }}>{user.name}</span>
            </div>
            <button onClick={onLogout} style={{
              padding: '5px 12px', borderRadius: '7px',
              border: '1px solid rgba(251,113,133,0.12)',
              background: 'transparent', color: '#7a4a56',
              fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
            }}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              padding: '5px 14px', borderRadius: '7px',
              border: '1px solid rgba(251,113,133,0.18)',
              background: 'transparent', color: '#c9a0ad',
              fontSize: '0.78rem', fontWeight: '500', textDecoration: 'none',
              transition: 'all 0.15s'
            }}>Log in</Link>
            <Link to="/signup" style={{
              padding: '5px 14px', borderRadius: '7px', border: 'none',
              background: 'linear-gradient(135deg, #7a1f35, #fb7185)',
              color: 'white', fontSize: '0.78rem', fontWeight: '700',
              textDecoration: 'none', fontFamily: 'Syne, sans-serif'
            }}>✦ Sign up</Link>
          </>
        )}
      </div>
    </div>
  )
}

function MainApp({ user }) {
  const [portfolioData, setPortfolioData] = useState(null)
  const [template, setTemplate] = useState('modern')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showEdit, setShowEdit] = useState(false)
  const { usesLeft, isBlocked, consume } = useRateLimit()
  const navigate = useNavigate()

  const handleGenerate = async ({ mode, file, text, template: chosenTemplate }) => {
    // If not logged in → send to signup
    if (!user) return navigate('/signup')

    // Rate limit check
    if (isBlocked) {
      setError('Daily limit reached (5/5). Come back tomorrow!')
      return
    }

    setTemplate(chosenTemplate)
    setError(null)
    setLoading(true)

    // Consume one use
    consume()

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
      setError('Backend offline — showing demo portfolio.')
      await new Promise(r => setTimeout(r, 800))
      setPortfolioData(MOCK_DATA)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* LEFT */}
      <div style={{
        width: '310px', flexShrink: 0,
        borderRight: '1px solid rgba(251,113,133,0.08)',
        background: '#0d0810', display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <UploadPanel
          onGenerate={handleGenerate}
          isLoading={loading}
          hasData={!!portfolioData}
          onEdit={(f, v) => setPortfolioData(p => ({ ...p, [f]: v }))}
          portfolioData={portfolioData}
          usesLeft={usesLeft}
          isBlocked={isBlocked}
          isLoggedIn={!!user}
        />
      </div>

      {/* RIGHT */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Sub-bar */}
        <div style={{
          height: '36px', flexShrink: 0,
          borderBottom: '1px solid rgba(251,113,133,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', background: 'rgba(20,11,15,0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.7rem', color: '#4a2030' }}>Template:</span>
            <span style={{
              fontSize: '0.7rem', color: '#fb7185', padding: '2px 8px',
              background: 'rgba(251,113,133,0.1)',
              border: '1px solid rgba(251,113,133,0.2)', borderRadius: '20px'
            }}>
              {template === 'modern' ? 'Modern Developer' : 'Minimal'}
            </span>
          </div>

          {error && <span style={{ fontSize: '0.7rem', color: '#f59e0b' }}>⚠ {error}</span>}

          {portfolioData && (
            <button onClick={() => setShowEdit(true)} style={{
              padding: '3px 12px', borderRadius: '6px',
              border: '1px solid rgba(251,113,133,0.15)',
              background: 'rgba(251,113,133,0.06)',
              color: '#fb7185', fontSize: '0.74rem', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}>✦ Full Edit</button>
          )}
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          <PreviewPanel data={portfolioData} template={template} />
        </div>
      </div>

      {showEdit && portfolioData && (
        <EditModal
          data={portfolioData}
          onSave={updated => { setPortfolioData(updated); setShowEdit(false) }}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('r2p_user')) } catch { return null }
  })

  const handleLogout = () => {
    localStorage.removeItem('r2p_user')
    setUser(null)
  }

  // Listen for login from pages
  useEffect(() => {
    const check = () => {
      try { setUser(JSON.parse(localStorage.getItem('r2p_user'))) } catch {}
    }
    window.addEventListener('storage', check)
    // Poll for same-tab login
    const id = setInterval(check, 500)
    return () => { window.removeEventListener('storage', check); clearInterval(id) }
  }, [])

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#100a0d' }}>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<MainApp user={user} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}