import { type CSSProperties, memo } from 'react'
import styles from './Tile.module.css'

interface TileProps {
  value: number
  size: number
  col: number
  row: number
  isMovable: boolean
  isImageMode: boolean
  imageSrc?: string
  onClick: () => void
  transitionDuration?: string
  celebrateDelay?: number
}

function Tile({ value, size, col, row, isMovable, isImageMode, imageSrc, onClick, transitionDuration, celebrateDelay }: TileProps) {
  const style: CSSProperties = {
    width: `${100 / size}%`,
    aspectRatio: '1',
    transform: `translate(${col * 100}%, ${row * 100}%)`,
  }

  if (transitionDuration) {
    style.transition = `transform ${transitionDuration} ease-out, box-shadow 0.12s ease`
  }

  if (value === 0) {
    return (
      <div
        className={`${styles.tile} ${isImageMode ? styles.imageEmpty : styles.empty}`}
        style={style}
      />
    )
  }

  const classNames = [styles.tile]
  if (isImageMode) {
    classNames.push(styles.imageTile)
  } else if (isMovable) {
    classNames.push(styles.movable)
  } else {
    classNames.push(styles.numberTile)
  }

  if (isImageMode && imageSrc) {
    style.backgroundImage = `url(${imageSrc})`
    style.backgroundSize = `${size * 100}%`
    const tileIndex = value - 1
    const tileRow = Math.floor(tileIndex / size)
    const tileCol = tileIndex % size
    style.backgroundPosition = `-${tileCol * 100}% -${tileRow * 100}%`
  }

  if (celebrateDelay !== undefined) {
    classNames.push(styles.celebrate)
    style.animationDelay = `${celebrateDelay}ms`
    style.animationDuration = '0.4s'
  }

  return (
    <div
      className={classNames.join(' ')}
      style={style}
      onClick={onClick}
    >
      {!isImageMode && value}
    </div>
  )
}

export default memo(Tile, (prev, next) => {
  return prev.value === next.value &&
    prev.size === next.size &&
    prev.col === next.col &&
    prev.row === next.row &&
    prev.isMovable === next.isMovable &&
    prev.isImageMode === next.isImageMode &&
    prev.imageSrc === next.imageSrc &&
    prev.transitionDuration === next.transitionDuration &&
    prev.celebrateDelay === next.celebrateDelay
})
