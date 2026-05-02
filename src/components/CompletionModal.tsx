import { useState } from 'react'
import styles from './CompletionModal.module.css'

interface CompletionModalProps {
  time: number
  moves: number
  onSave: (name: string) => void
  onClose: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function CompletionModal({ time, moves, onSave, onClose }: CompletionModalProps) {
  const [name, setName] = useState('')
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>🎉 拼图完成！</h2>
        <p className={styles.subtitle}>恭喜你完成了拼图</p>
        <div className={styles.stats}>
          <div><div className={styles.statLabel}>用时</div><div className={styles.statValue}>{formatTime(time)}</div></div>
          <div><div className={styles.statLabel}>步数</div><div className={styles.statValue}>{moves}</div></div>
        </div>
        <input className={styles.input} placeholder="输入你的名字" value={name} onChange={e => setName(e.target.value)} maxLength={12} />
        <div className={styles.buttons}>
          <button className={styles.saveButton} disabled={!name.trim()} onClick={() => onSave(name.trim() || '匿名')}>保存记录</button>
          <button className={styles.dismissButton} onClick={onClose}>不保存</button>
        </div>
      </div>
    </div>
  )
}
