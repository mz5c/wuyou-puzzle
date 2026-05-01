import Tile from './Tile'
import styles from './PuzzleBoard.module.css'
import type { PuzzleGameState } from '../types'

interface PuzzleBoardProps {
  state: PuzzleGameState
  movableIndices: number[]
  isImageMode: boolean
  imageParts?: string[]
  onTileClick: (index: number) => void
}

export default function PuzzleBoard({ state, movableIndices, isImageMode, imageParts, onTileClick }: PuzzleBoardProps) {
  return (
    <div className={styles.board}>
      {state.tiles.map((value, index) => (
        <Tile
          key={index}
          value={value}
          size={state.size}
          isMovable={movableIndices.includes(index)}
          isImageMode={isImageMode}
          imagePart={imageParts?.[value - 1]}
          onClick={() => onTileClick(index)}
        />
      ))}
    </div>
  )
}
