import { type CSSProperties, memo, useLayoutEffect, useRef } from 'react'
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
  const tileRef = useRef<HTMLDivElement>(null)
  const prevPosRef = useRef({ col, row })

  useLayoutEffect(() => {
    const el = tileRef.current
    if (!el) return

    const prev = prevPosRef.current
    if (prev.col !== col || prev.row !== row) {
      el.getAnimations().forEach(anim => anim.cancel())
      const duration = transitionDuration ? parseInt(transitionDuration) : 200
      el.animate([
        { transform: `translate(${prev.col * 100}%, ${prev.row * 100}%)` },
        { transform: `translate(${col * 100}%, ${row * 100}%)` },
      ], {
        duration,
        easing: 'ease-out',
      })
    }

    prevPosRef.current = { col, row }
  }, [col, row, transitionDuration])

  const style: CSSProperties = {
    width: `${100 / size}%`,
    aspectRatio: '1',
    transform: `translate(${col * 100}%, ${row * 100}%)`,
  }

  if (value === 0) {
    return (
      <div
        ref={tileRef}
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
      ref={tileRef}
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
    prev.celebrateDelay === next.celebrateDelay &&
    prev.onClick === next.onClick
})
