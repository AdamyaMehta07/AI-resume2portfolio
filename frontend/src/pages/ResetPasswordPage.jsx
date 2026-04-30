import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function ResetPasswordPage() {
  const [searchParams]            = useSearchParams()
  const navigate                  = useNavigate()
  const token                     = searchParams.get('token')

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [showConf, setShowConf]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)

  // No token in URL
  if (!token) {
    return (
      <div style={{
        minHeight: '100vh', background: '#100a0d', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif'
      }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#fb7185', fontSize: '1rem', marginBottom: '16px' }}>
            ⚠ Invalid or missing reset token.
          </p>
          <Link to="/forgot-password" style={{ color: '#c9a0ad', fontSize: '0.88rem' }}>
            Request a new reset link →
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async () => {
    setError('')
    if (!password) return setError('Please enter a new password.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (password !== confirm) return setError('Passwords do not match.')

    setLoading(true)
    try {
      const res  = await fetch(`${API_URL}/api/auth/reset-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, password })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }

      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)

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
        position: 'fixed', top: '15%', left: '50%', transform: 'translateX(-50%)',
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

          {success ? (
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
                Password updated!
              </h1>
              <p style={{ fontSize: '0.88rem', color: '#7a4a56', lineHeight: '1.65', marginBottom: '24px' }}>
                Your password has been reset successfully.<br />
                Redirecting you to login in 3 seconds...
              </p>
              <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '10px 24px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #7a1f35, #fb7185)',
                color: 'white', textDecoration: 'none',
                fontSize: '0.85rem', fontWeight: '700',
                fontFamily: 'Syne, sans-serif'
              }}>
                ✦ Go to Login
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <h1 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: '800',
                fontSize: '1.8rem', color: '#fff0f3', letterSpacing: '-0.02em', marginBottom: '8px'
              }}>Set new password</h1>
              <p style={{ fontSize: '0.85rem', color: '#7a4a56', marginBottom: '28px' }}>
                Enter your new password below.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>

                {/* New password */}
                <div style={{ position: 'relative' }}>
                  <Field
                    icon={<Lock size={15} />}
                    placeholder="New password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={setPassword}
                  />
                  <button onClick={() => setShowPass(p => !p)} style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#7a4a56'
                  }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Confirm password */}
                <div style={{ position: 'relative' }}>
                  <Field
                    icon={<Lock size={15} />}
                    placeholder="Confirm new password"
                    type={showConf ? 'text' : 'password'}
                    value={confirm}
                    onChange={setConfirm}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  />
                  <button onClick={() => setShowConf(p => !p)} style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#7a4a56'
                  }}>
                    {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Password strength hint */}
                {password.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: '3px', borderRadius: '2px',
                        background: password.length >= i * 3
                          ? (password.length >= 10 ? '#22c55e' : '#fb7185')
                          : 'rgba(255,255,255,0.08)'
                      }} />
                    ))}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div style={{
                    padding: '9px 13px',
                    background: 'rgba(251,113,133,0.08)',
                    border: '1px solid rgba(251,113,133,0.2)',
                    borderRadius: '7px', fontSize: '0.8rem', color: '#fb7185'
                  }}>⚠ {error}</div>
                )}

                {/* Submit */}
                <button onClick={handleSubmit} disabled={loading} style={{
                  width: '100%', padding: '13px', marginTop: '4px',
                  background: loading ? 'rgba(122,31,53,0.4)' : 'linear-gradient(135deg, #7a1f35, #fb7185)',
                  border: 'none', borderRadius: '10px', color: 'white',
                  fontWeight: '700', fontSize: '0.92rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Syne, sans-serif'
                }}>
                  {loading ? 'Updating...' : '✦ Update Password'}
                </button>

                <Link to="/login" style={{
                  textAlign: 'center', fontSize: '0.82rem',
                  color: '#7a4a56', textDecoration: 'none'
                }}>
                  Back to Login
                </Link>
              </div>
            </>
          )}
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
          width: '100%', padding: '11px 40px 11px 40px',
          background: 'rgba(251,113,133,0.05)',
          border: `1px solid ${focused ? 'rgba(251,113,133,0.45)' : 'rgba(251,113,133,0.14)'}`,
          borderRadius: '9px', color: '#fff0f3', fontSize: '0.875rem',
          outline: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.15s'
        }}
      />
    </div>
  )
}