import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!form.name.trim()) return setError('Name is required.')
    if (!form.email.includes('@')) return setError('Enter a valid email address.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Signup failed. Please try again.')
        setLoading(false)
        return
      }

      // Save token + user to localStorage
      localStorage.setItem('r2p_token', data.token)
      localStorage.setItem('r2p_user', JSON.stringify(data.user))
      localStorage.setItem('r2p_uses_left', data.usesLeft)

      navigate('/')

    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#100a0d',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif', padding: '20px'
    }}>
      <div style={{
        position: 'fixed', bottom: '10%', right: '15%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(122,31,53,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%', maxWidth: '440px',
        background: '#140b0f',
        border: '1px solid rgba(251,113,133,0.16)',
        borderRadius: '20px',
        boxShadow: '0 32px 80px rgba(122,31,53,0.3)',
        overflow: 'hidden', position: 'relative'
      }}>
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #7a1f35, #fb7185, #7a1f35)' }} />

        <div style={{ padding: '36px 32px 32px' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <div style={{
              width: '28px', height: '28px',
              background: 'linear-gradient(135deg, #7a1f35, #fb7185)',
              borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px'
            }}>✦</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '1rem', color: '#fff0f3' }}>
              Resume<span style={{ color: '#fb7185' }}>2</span>Portfolio
            </span>
          </Link>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 12px', marginBottom: '16px',
            background: 'rgba(251,113,133,0.1)',
            border: '1px solid rgba(251,113,133,0.2)',
            borderRadius: '20px', fontSize: '0.75rem', color: '#fb7185'
          }}>
            <Sparkles size={12} /> 5 free AI generations per day
          </div>

          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: '800',
            fontSize: '1.8rem', color: '#fff0f3', letterSpacing: '-0.02em', marginBottom: '6px'
          }}>Create account</h1>
          <p style={{ fontSize: '0.85rem', color: '#7a4a56', marginBottom: '26px' }}>
            Start generating beautiful portfolios today
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
            <Field icon={<User size={15} />} placeholder="Full name"
              value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
            <Field icon={<Mail size={15} />} placeholder="Email address" type="email"
              value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} />

            <div style={{ position: 'relative' }}>
              <Field icon={<Lock size={15} />} placeholder="Password (min 6 chars)"
                type={showPass ? 'text' : 'password'}
                value={form.password} onChange={v => setForm(p => ({ ...p, password: v }))}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              <button onClick={() => setShowPass(p => !p)} style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#7a4a56'
              }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && (
              <div style={{
                padding: '9px 13px', background: 'rgba(251,113,133,0.08)',
                border: '1px solid rgba(251,113,133,0.2)', borderRadius: '7px',
                fontSize: '0.8rem', color: '#fb7185'
              }}>⚠ {error}</div>
            )}

            <button onClick={handleSubmit} disabled={loading} style={{
              width: '100%', padding: '13px',
              background: loading ? 'rgba(122,31,53,0.4)' : 'linear-gradient(135deg, #7a1f35, #fb7185)',
              border: 'none', borderRadius: '10px', color: 'white',
              fontWeight: '700', fontSize: '0.92rem', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Syne, sans-serif', marginTop: '4px'
            }}>
              {loading ? 'Creating account...' : '✦ Create Free Account'}
            </button>
          </div>

          {/* Perks list */}
          <div style={{
            marginTop: '20px', padding: '14px',
            background: 'rgba(251,113,133,0.04)',
            border: '1px solid rgba(251,113,133,0.08)', borderRadius: '10px'
          }}>
            <p style={{ fontSize: '0.72rem', color: '#7a4a56', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Free plan includes
            </p>
            {[
              '5 AI portfolio generations per day',
              '2 portfolio templates (Modern + Minimal)',
              'Export as standalone HTML file',
              'Full content editing',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                <span style={{ color: '#fb7185', fontSize: '11px' }}>✦</span>
                <span style={{ fontSize: '0.8rem', color: '#c9a0ad' }}>{item}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.82rem', color: '#7a4a56', textAlign: 'center', marginTop: '18px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#fb7185', fontWeight: '600', textDecoration: 'none' }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({ icon, placeholder, type = 'text', value, onChange, onKeyDown }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)',
        color: focused ? '#fb7185' : '#7a4a56', pointerEvents: 'none', transition: 'color 0.15s'
      }}>{icon}</span>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '11px 14px 11px 40px',
          background: 'rgba(251,113,133,0.05)',
          border: `1px solid ${focused ? 'rgba(251,113,133,0.45)' : 'rgba(251,113,133,0.14)'}`,
          borderRadius: '9px', color: '#fff0f3', fontSize: '0.875rem',
          outline: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.15s'
        }}
      />
    </div>
  )
}