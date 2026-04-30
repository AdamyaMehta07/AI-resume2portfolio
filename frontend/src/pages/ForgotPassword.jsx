import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [sent, setSent]         = useState(false)
  const [focused, setFocused]   = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!email || !email.includes('@'))
      return setError('Please enter a valid email address.')

    setLoading(true)
    try {
      const res  = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }

      setSent(true)
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
      {/* Background orb */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '400px', height: '400px', borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(122,31,53,0.15) 0%, transparent 70%)'
      }} />

      <div style={{
        width: '100%', maxWidth: '420px', position: 'relative',
        background: '#140b0f',
        border: '1px solid rgba(251,113,133,0.16)',
        borderRadius: '20px',
        boxShadow: '0 32px 80px rgba(122,31,53,0.3)',
        overflow: 'hidden'
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

          {sent ? (
            /* ── Success state ── */
            <div style={{ textAlign: 'center', padding: '10px 0 16px' }}>
              <div style={{
                width: '60px', height: '60px', margin: '0 auto 20px',
                background: 'rgba(251,113,133,0.1)',
                border: '1px solid rgba(251,113,133,0.25)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <CheckCircle size={28} color="#fb7185" />
              </div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '1.5rem', color: '#fff0f3', marginBottom: '10px' }}>
                Check your inbox
              </h1>
              <p style={{ fontSize: '0.88rem', color: '#7a4a56', lineHeight: '1.65', marginBottom: '28px' }}>
                We sent a password reset link to<br />
                <strong style={{ color: '#fb7185' }}>{email}</strong>.<br /><br />
                The link expires in <strong style={{ color: '#c9a0ad' }}>1 hour</strong>.
                Check your spam folder if you don't see it.
              </p>
              <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '10px 24px', borderRadius: '8px',
                background: 'rgba(251,113,133,0.1)',
                border: '1px solid rgba(251,113,133,0.2)',
                color: '#fb7185', textDecoration: 'none',
                fontSize: '0.85rem', fontWeight: '600'
              }}>
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <h1 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: '800',
                fontSize: '1.8rem', color: '#fff0f3', letterSpacing: '-0.02em', marginBottom: '8px'
              }}>Forgot password?</h1>
              <p style={{ fontSize: '0.85rem', color: '#7a4a56', marginBottom: '28px', lineHeight: '1.6' }}>
                Enter your email and we'll send you a link to reset your password.
              </p>

              {/* Email field */}
              <div style={{ position: 'relative', marginBottom: '14px' }}>
                <span style={{
                  position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)',
                  color: focused ? '#fb7185' : '#7a4a56', pointerEvents: 'none', transition: 'color 0.15s'
                }}>
                  <Mail size={15} />
                </span>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{
                    width: '100%', padding: '11px 14px 11px 40px',
                    background: 'rgba(251,113,133,0.05)',
                    border: `1px solid ${focused ? 'rgba(251,113,133,0.45)' : 'rgba(251,113,133,0.14)'}`,
                    borderRadius: '9px', color: '#fff0f3', fontSize: '0.875rem',
                    outline: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.15s'
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: '9px 13px', marginBottom: '14px',
                  background: 'rgba(251,113,133,0.08)',
                  border: '1px solid rgba(251,113,133,0.2)',
                  borderRadius: '7px', fontSize: '0.8rem', color: '#fb7185'
                }}>⚠ {error}</div>
              )}

              {/* Submit button */}
              <button onClick={handleSubmit} disabled={loading} style={{
                width: '100%', padding: '13px', marginBottom: '20px',
                background: loading ? 'rgba(122,31,53,0.4)' : 'linear-gradient(135deg, #7a1f35, #fb7185)',
                border: 'none', borderRadius: '10px', color: 'white',
                fontWeight: '700', fontSize: '0.92rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Syne, sans-serif'
              }}>
                {loading ? 'Sending...' : '✦ Send Reset Link'}
              </button>

              {/* Back to login */}
              <Link to="/login" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                fontSize: '0.82rem', color: '#7a4a56', textDecoration: 'none'
              }}>
                <ArrowLeft size={13} /> Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}