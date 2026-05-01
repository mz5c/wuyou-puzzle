import styles from './GameStats.module.css'

interface GameStatsProps {
  time: number
  moves: number
  showHint: boolean
  onToggleHint: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function GameStats({ time, moves, showHint, onToggleHint }: GameStatsProps) {
  return (
    <div className={styles.stats}>
      <span className={styles.statItem}>⏱ <span className={`${styles.statValue} ${styles.timeValue}`}>{formatTime(time)}</span></span>
      <span className={styles.statItem}>👣 <span className={`${styles.statValue} ${styles.movesValue}`}>{moves}</span> 步</span>
      <span className={styles.statItem} onClick={onToggleHint} style={{ cursor: 'pointer' }}>
        💡 <span className={`${styles.statValue} ${styles.hintValue}`}>{showHint ? '关闭' : '可移动'}</span>
      </span>
    </div>
  )
}
