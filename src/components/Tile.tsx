import type { CSSProperties } from 'react'
import styles from './Tile.module.css'

interface TileProps {
  value: number
  size: number
  isMovable: boolean
  isImageMode: boolean
  imagePart?: string
  onClick: () => void
}

export default function Tile({ value, size, isMovable, isImageMode, imagePart, onClick }: TileProps) {
  if (value === 0) {
    return (
      <div
        className={`${styles.tile} ${isImageMode ? styles.imageEmpty : styles.empty}`}
        style={{ width: `${100 / size}%`, aspectRatio: '1' }}
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

  const style: CSSProperties = {
    width: `${100 / size}%`,
    aspectRatio: '1',
  }

  if (isImageMode && imagePart) {
    style.backgroundImage = `url(${imagePart})`
    style.backgroundSize = `${size * 100}%`
    const tileIndex = value - 1
    const row = Math.floor(tileIndex / size)
    const col = tileIndex % size
    style.backgroundPosition = `-${col * 100}% -${row * 100}%`
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
