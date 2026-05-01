import styles from './DirectionPad.module.css'

interface DirectionPadProps {
  onDirection: (dir: 'up' | 'down' | 'left' | 'right') => void
}

export default function DirectionPad({ onDirection }: DirectionPadProps) {
  return (
    <div className={styles.dpad}>
      <div />
      <button className={styles.btn} onClick={() => onDirection('up')}>↑</button>
      <div />
      <button className={styles.btn} onClick={() => onDirection('left')}>←</button>
      <button className={styles.btn} onClick={() => onDirection('down')}>↓</button>
      <button className={styles.btn} onClick={() => onDirection('right')}>→</button>
    </div>
  )
}
