import { useRef } from 'react'
import Tile from './Tile'
import CelebrationParticles from './CelebrationParticles'
import styles from './PuzzleBoard.module.css'
import type { PuzzleGameState } from '../types'

interface PuzzleBoardProps {
  state: PuzzleGameState
  movableIndices: number[]
  isImageMode: boolean
  imageSrc?: string
  onTileClick: (index: number) => void
  showHints?: boolean
  isShuffling?: boolean
}

export default function PuzzleBoard({ state, movableIndices, isImageMode, imageSrc, onTileClick, showHints = true, isShuffling = false }: PuzzleBoardProps) {
  const moveLockedRef = useRef(false)
  const transitionDuration = isShuffling ? '600ms' : '200ms'

  const handleTileClick = (index: number) => {
    if (moveLockedRef.current || state.isComplete || isShuffling) return
    if (movableIndices.includes(index)) {
      moveLockedRef.current = true
      onTileClick(index)
      setTimeout(() => { moveLockedRef.current = false }, 200)
    }
  }

  return (
    <div className={styles.board}>
      {state.isComplete && <CelebrationParticles />}
      {state.tiles.map((value, index) => {
        const row = Math.floor(index / state.size)
        const col = index % state.size
        const celebrateDelay = state.isComplete ? (row * state.size + col) * 40 : undefined
        return (
          <Tile
            key={value}
            value={value}
            size={state.size}
            col={col}
            row={row}
            isMovable={showHints ? movableIndices.includes(index) : false}
            isImageMode={isImageMode}
            imageSrc={imageSrc}
            onClick={() => handleTileClick(index)}
            transitionDuration={transitionDuration}
            celebrateDelay={celebrateDelay}
          />
        )
      })}
    </div>
  )
}
