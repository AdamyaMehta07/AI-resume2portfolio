import { useState, useEffect } from 'react'

const LIMIT = 5
const KEY = 'r2p_usage'

function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

function getUsage() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { date: getTodayKey(), count: 0 }
    const parsed = JSON.parse(raw)
    if (parsed.date !== getTodayKey()) return { date: getTodayKey(), count: 0 }
    return parsed
  } catch {
    return { date: getTodayKey(), count: 0 }
  }
}

export function useRateLimit() {
  const [usage, setUsage] = useState(getUsage)

  useEffect(() => { setUsage(getUsage()) }, [])

  const usesLeft = Math.max(0, LIMIT - usage.count)
  const isBlocked = usage.count >= LIMIT

  const consume = () => {
    if (isBlocked) return false
    const next = { date: getTodayKey(), count: usage.count + 1 }
    localStorage.setItem(KEY, JSON.stringify(next))
    setUsage(next)
    return true
  }

  return { usesLeft, isBlocked, consume, count: usage.count, limit: LIMIT }
}