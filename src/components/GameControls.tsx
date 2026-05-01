import styles from './GameControls.module.css'

interface GameControlsProps {
  onShuffle: () => void
  onPause: () => void
  onReset: () => void
  isPaused: boolean
}

export default function GameControls({ onShuffle, onPause, onReset, isPaused }: GameControlsProps) {
  return (
    <div className={styles.controls}>
      <button className={styles.primary} onClick={onShuffle}>🔄 洗牌</button>
      <button className={styles.secondary} onClick={onPause}>{isPaused ? '▶ 继续' : '⏸ 暂停'}</button>
      <button className={styles.secondary} onClick={onReset}>↩ 重置</button>
    </div>
  )
}
