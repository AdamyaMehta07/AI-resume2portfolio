import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!form.email || !form.password) return setError('Please fill in all fields.')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed. Please try again.')
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
        position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(122,31,53,0.18) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%', maxWidth: '420px',
        background: '#140b0f',
        border: '1px solid rgba(251,113,133,0.16)',
        borderRadius: '20px',
        boxShadow: '0 32px 80px rgba(122,31,53,0.3)',
        overflow: 'hidden', position: 'relative'
      }}>
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #7a1f35, #fb7185, #7a1f35)' }} />

        <div style={{ padding: '36px 32px 32px' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
            <div style={{
              width: '28px', height: '28px',
              background: 'linear-gradient(135deg, #7a1f35, #fb7185)',
              borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px'
            }}>✦</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '1rem', color: '#fff0f3' }}>
              Resume<span style={{ color: '#fb7185' }}>2</span>Portfolio
            </span>
          </Link>

          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: '800',
            fontSize: '1.8rem', color: '#fff0f3', letterSpacing: '-0.02em', marginBottom: '6px'
          }}>Welcome back</h1>
          <p style={{ fontSize: '0.85rem', color: '#7a4a56', marginBottom: '28px' }}>
            Sign in to continue generating portfolios
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Field icon={<Mail size={15} />} placeholder="Email address" type="email"
              value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />

            <div style={{ position: 'relative' }}>
              <Field icon={<Lock size={15} />} placeholder="Password"
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

            {error && <ErrorBox>{error}</ErrorBox>}

            <button onClick={handleSubmit} disabled={loading} style={{
              width: '100%', padding: '13px',
              background: loading ? 'rgba(122,31,53,0.4)' : 'linear-gradient(135deg, #7a1f35, #fb7185)',
              border: 'none', borderRadius: '10px', color: 'white',
              fontWeight: '700', fontSize: '0.92rem', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Syne, sans-serif', marginTop: '4px'
            }}>
              {loading ? 'Signing in...' : '✦ Sign In'}
            </button>
          </div>

          <div style={{
            marginTop: '20px', padding: '12px 14px',
            background: 'rgba(251,113,133,0.05)',
            border: '1px solid rgba(251,113,133,0.1)', borderRadius: '8px'
          }}>
            <p style={{ fontSize: '0.78rem', color: '#7a4a56', lineHeight: '1.5' }}>
              🎁 Free plan · <span style={{ color: '#fb7185', fontWeight: '600' }}>5 AI generations per day</span> — no credit card needed
            </p>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#7a4a56', textAlign: 'center', marginTop: '20px' }}>
            <Link to="/forgot-password" style={{ color: '#7a4a56', fontSize: '0.82rem', textDecoration: 'none', display: 'block', textAlign: 'center', marginBottom: '14px' }}>Forgot your password?</Link>
          Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#fb7185', fontWeight: '600', textDecoration: 'none' }}>
              Sign up free
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

function ErrorBox({ children }) {
  return (
    <div style={{
      padding: '9px 13px', background: 'rgba(251,113,133,0.08)',
      border: '1px solid rgba(251,113,133,0.2)', borderRadius: '7px',
      fontSize: '0.8rem', color: '#fb7185'
    }}>⚠ {children}</div>
  )
}