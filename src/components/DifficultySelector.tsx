import { Difficulty } from '../types'
import styles from './DifficultySelector.module.css'

interface DifficultySelectorProps {
  current: Difficulty
  onChange: (size: Difficulty) => void
}

const OPTIONS: Difficulty[] = [3, 4, 5]

export default function DifficultySelector({ current, onChange }: DifficultySelectorProps) {
  return (
    <div className={styles.selector}>
      {OPTIONS.map(size => (
        <button
          key={size}
          className={`${styles.option} ${current === size ? styles.active : styles.inactive}`}
          onClick={() => onChange(size)}
        >
          {size}×{size}
        </button>
      ))}
    </div>
  )
}
