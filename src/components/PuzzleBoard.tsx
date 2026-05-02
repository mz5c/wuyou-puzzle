import Tile from './Tile'
import styles from './PuzzleBoard.module.css'
import type { PuzzleGameState } from '../types'

interface PuzzleBoardProps {
  state: PuzzleGameState
  movableIndices: number[]
  isImageMode: boolean
  imageSrc?: string
  onTileClick: (index: number) => void
}

export default function PuzzleBoard({ state, movableIndices, isImageMode, imageSrc, onTileClick }: PuzzleBoardProps) {
  return (
    <div className={styles.board}>
      {state.tiles.map((value, index) => (
        <Tile
          key={index}
          value={value}
          size={state.size}
          isMovable={movableIndices.includes(index)}
          isImageMode={isImageMode}
          imageSrc={imageSrc}
          onClick={() => onTileClick(index)}
        />
      ))}
    </div>
  )
}
