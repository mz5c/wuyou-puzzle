import type { PuzzleMode } from '../types'
import styles from './Header.module.css'

interface HeaderProps {
  mode: PuzzleMode
  onModeChange: (mode: PuzzleMode) => void
  onLeaderboard: () => void
}

export default function Header({ mode, onModeChange, onLeaderboard }: HeaderProps) {
  return (
    <header className={styles.header}>
      <span className={styles.title}>🧩 无忧拼图</span>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${mode === 'number' ? styles.tabActive : styles.tabInactive}`} onClick={() => onModeChange('number')}>数字</button>
        <button className={`${styles.tab} ${mode === 'image' ? styles.tabActive : styles.tabInactive}`} onClick={() => onModeChange('image')}>图片</button>
        <button className={`${styles.tab} ${styles.tabInactive}`} onClick={onLeaderboard}>排行</button>
      </div>
    </header>
  )
}
