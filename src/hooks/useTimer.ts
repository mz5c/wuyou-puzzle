import { useState, useRef, useCallback, useEffect } from 'react'

export function useTimer(isPaused: boolean, isComplete: boolean, hasStarted: boolean) {
  const [time, setTime] = useState(0)
  const [resetKey, setResetKey] = useState(0)
  const startTimeRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (hasStarted && !isPaused && !isComplete) {
      if (!intervalRef.current) {
        startTimeRef.current = performance.now()
        intervalRef.current = setInterval(() => {
          const elapsed = Math.floor((performance.now() - startTimeRef.current) / 1000)
          setTime(elapsed)
        }, 1000)
      }
    } else {
      clearTimer()
    }
    return clearTimer
  }, [hasStarted, isPaused, isComplete, clearTimer, resetKey])

  const reset = useCallback(() => {
    clearTimer()
    setTime(0)
    setResetKey(k => k + 1)
  }, [clearTimer])

  return { time, reset }
}
