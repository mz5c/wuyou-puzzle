import { useState, useCallback } from 'react'
import { playMoveSound, playInvalidSound, playCompleteSound, startBGM, stopBGM } from '../utils/sound'

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [bgmEnabled, setBgmEnabled] = useState(false)

  const playMove = useCallback(() => {
    if (soundEnabled) playMoveSound()
  }, [soundEnabled])

  const playInvalid = useCallback(() => {
    if (soundEnabled) playInvalidSound()
  }, [soundEnabled])

  const playComplete = useCallback(() => {
    if (soundEnabled) playCompleteSound()
  }, [soundEnabled])

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev)
  }, [])

  const toggleBGM = useCallback(() => {
    setBgmEnabled(prev => {
      const next = !prev
      if (next) {
        startBGM()
      } else {
        stopBGM()
      }
      return next
    })
  }, [])

  return { soundEnabled, bgmEnabled, playMove, playInvalid, playComplete, toggleSound, toggleBGM }
}
