import { useState } from 'react'
import type { PuzzleMode, Difficulty, LeaderboardEntry } from '../types'
import styles from './LeaderboardPage.module.css'

interface LeaderboardPageProps {
  entries: LeaderboardEntry[]
  onBack: () => void
}

const MODES: { label: string; value: PuzzleMode }[] = [
  { label: '数字', value: 'number' },
  { label: '图片', value: 'image' },
]
const DIFFICULTIES: { label: string; value: Difficulty }[] = [
  { label: '3×3', value: 3 },
  { label: '4×4', value: 4 },
  { label: '5×5', value: 5 },
]

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatDate(iso: string): string {
  try { return new Date(iso).toLocaleDateString('zh-CN') } catch { return iso }
}

export default function LeaderboardPage({ entries, onBack }: LeaderboardPageProps) {
  const [filterMode, setFilterMode] = useState<PuzzleMode>('number')
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty>(3)

  const filtered = entries
    .filter(e => e.mode === filterMode && e.difficulty === filterDifficulty)
    .sort((a, b) => a.time - b.time)

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={onBack}>← 返回游戏</button>
      <div className={styles.filters}>
        {MODES.map(m => (
          <button key={m.value} className={`${styles.filter} ${filterMode === m.value ? styles.filterActive : styles.filterInactive}`} onClick={() => setFilterMode(m.value)}>
            {m.label}
          </button>
        ))}
        {DIFFICULTIES.map(d => (
          <button key={d.value} className={`${styles.filter} ${filterDifficulty === d.value ? styles.filterActive : styles.filterInactive}`} onClick={() => setFilterDifficulty(d.value)}>
            {d.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className={styles.empty}>暂无记录</div>
      ) : (
        <table className={styles.table}>
          <thead><tr><th>#</th><th>玩家</th><th>用时</th><th>步数</th><th>日期</th></tr></thead>
          <tbody>
            {filtered.map((entry, i) => (
              <tr key={entry.id}>
                <td className={styles.rank}>{i + 1}</td>
                <td className={styles.playerName}>{entry.playerName}</td>
                <td className={styles.statScore}>{formatTime(entry.time)}</td>
                <td className={styles.statScore}>{entry.moves}</td>
                <td className={styles.date}>{formatDate(entry.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {filtered.length > 0 && (
        <button className={styles.clearBtn} onClick={() => { if (confirm('确定清除所有记录？')) { localStorage.removeItem('wuyou-puzzle-leaderboard'); window.location.reload() } }}>
          清除记录
        </button>
      )}
    </div>
  )
}
