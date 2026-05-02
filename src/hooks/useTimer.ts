import { useState, useRef, useCallback, useEffect } from 'react'

export function useTimer(isPaused: boolean, isComplete: boolean) {
  const [time, setTime] = useState(0)
  const [resetKey, setResetKey] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isPaused || isComplete) {
      clearTimer()
    } else if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTime(t => t + 1)
      }, 1000)
    }
    return clearTimer
  }, [isPaused, isComplete, clearTimer, resetKey])

  const reset = useCallback(() => {
    clearTimer()
    setTime(0)
    setResetKey(k => k + 1)
  }, [clearTimer])

  return { time, reset }
}
