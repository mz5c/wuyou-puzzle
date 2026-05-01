import styles from './SoundToggle.module.css'

interface SoundToggleProps {
  soundEnabled: boolean
  bgmEnabled: boolean
  onToggleSound: () => void
  onToggleBGM: () => void
}

export default function SoundToggle({ soundEnabled, bgmEnabled, onToggleSound, onToggleBGM }: SoundToggleProps) {
  return (
    <div className={styles.footer}>
      <button className={`${styles.toggle} ${soundEnabled ? styles.active : ''}`} onClick={onToggleSound}>
        {soundEnabled ? '🔊 音效' : '🔇 音效'}
      </button>
      <button className={`${styles.toggle} ${bgmEnabled ? styles.active : ''}`} onClick={onToggleBGM}>
        🎵 背景音乐
      </button>
    </div>
  )
}
