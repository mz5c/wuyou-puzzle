import { useState, useCallback } from 'react'
import type { PuzzleMode, Difficulty } from './types'
import { useLeaderboard } from './hooks/useLeaderboard'
import { useSound } from './hooks/useSound'
import Header from './components/Header'
import SoundToggle from './components/SoundToggle'
import NumberPuzzlePage from './pages/NumberPuzzlePage'
import ImagePuzzlePage from './pages/ImagePuzzlePage'
import LeaderboardPage from './pages/LeaderboardPage'
import styles from './App.module.css'
import './index.css'

type Page = 'number' | 'image' | 'leaderboard'

export default function App() {
  const [page, setPage] = useState<Page>('number')
  const sound = useSound()
  const leaderboard = useLeaderboard()

  const handleSaveScore = useCallback((
    time: number,
    moves: number,
    difficulty: Difficulty,
    mode: PuzzleMode,
    playerName?: string,
    thumb?: string,
  ) => {
    leaderboard.addEntry({
      mode,
      difficulty,
      time,
      moves,
      playerName: playerName || '匿名',
      imageThumb: thumb,
    })
  }, [leaderboard])

  return (
    <div className={styles.app}>
      <Header
        mode={page === 'leaderboard' ? 'number' : page as PuzzleMode}
        onModeChange={m => setPage(m)}
        onLeaderboard={() => setPage('leaderboard')}
      />
      <div className={styles.content}>
        {page === 'number' && (
          <NumberPuzzlePage
            sound={sound}
            onSaveScore={(t, m, d, playerName) => handleSaveScore(t, m, d, 'number', playerName)}
          />
        )}
        {page === 'image' && (
          <ImagePuzzlePage
            sound={sound}
            onSaveScore={(t, m, d, playerName, thumb) => handleSaveScore(t, m, d, 'image', playerName, thumb)}
          />
        )}
        {page === 'leaderboard' && (
          <LeaderboardPage entries={leaderboard.entries} onBack={() => setPage('number')} />
        )}
      </div>
      <SoundToggle
        soundEnabled={sound.soundEnabled}
        bgmEnabled={sound.bgmEnabled}
        onToggleSound={sound.toggleSound}
        onToggleBGM={sound.toggleBGM}
      />
    </div>
  )
}
