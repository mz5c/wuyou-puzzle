import { useRef, useState, useCallback } from 'react'
import styles from './ImageUploader.module.css'

interface ImageUploaderProps {
  onImageReady: (imageData: string) => void
}

export default function ImageUploader({ onImageReady }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 })
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 })
  const [selection, setSelection] = useState({ x: 0, y: 0, size: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, selX: 0, selY: 0 })

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const data = reader.result as string
      const img = new Image()
      img.onload = () => {
        setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
        setImageSrc(data)
        setSelection({ x: 0, y: 0, size: 0 })
      }
      img.src = data
    }
    reader.readAsDataURL(file)
  }

  const handleImgLoad = useCallback(() => {
    const img = imgRef.current
    if (!img) return
    const w = img.clientWidth
    const h = img.clientHeight
    setDisplaySize({ w, h })
    const size = Math.min(w, h)
    setSelection({ x: Math.round((w - size) / 2), y: Math.round((h - size) / 2), size })
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      selX: selection.x,
      selY: selection.y,
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    let newX = dragRef.current.selX + dx
    let newY = dragRef.current.selY + dy
    newX = Math.round(Math.max(0, Math.min(newX, displaySize.w - selection.size)))
    newY = Math.round(Math.max(0, Math.min(newY, displaySize.h - selection.size)))
    setSelection(prev => ({ ...prev, x: newX, y: newY }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleConfirm = () => {
    if (!imageSrc) return
    const scaleX = naturalSize.w / displaySize.w
    const scaleY = naturalSize.h / displaySize.h
    const cropX = Math.round(selection.x * scaleX)
    const cropY = Math.round(selection.y * scaleY)
    const cropSize = Math.round(selection.size * scaleX)

    const canvas = document.createElement('canvas')
    canvas.width = cropSize
    canvas.height = cropSize
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, cropSize, cropSize)
      onImageReady(canvas.toDataURL('image/jpeg', 0.9))
    }
    img.src = imageSrc
  }

  const handleBack = () => {
    setImageSrc(null)
  }

  if (!imageSrc) {
    return (
      <div className={styles.container}>
        <div className={styles.uploadArea} onClick={() => inputRef.current?.click()}>
          点击上传图片，然后拖动选框选择 1:1 裁剪区域
        </div>
        <input ref={inputRef} type="file" accept="image/*" className={styles.hidden}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
      </div>
    )
  }

  const selStyle = selection.size > 0 ? {
    left: `${(selection.x / displaySize.w) * 100}%`,
    top: `${(selection.y / displaySize.h) * 100}%`,
    width: `${(selection.size / displaySize.w) * 100}%`,
    height: `${(selection.size / displaySize.h) * 100}%`,
  } : undefined

  return (
    <div className={styles.container}>
      <div className={styles.cropContainer}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img ref={imgRef} src={imageSrc} alt="裁剪预览" className={styles.cropImage}
          onLoad={handleImgLoad} draggable={false}
        />
        {selStyle && (
          <div className={styles.selectionBox} style={selStyle}
            onMouseDown={handleMouseDown}
          />
        )}
        <div className={styles.cropHint}>拖动白色方框选择裁剪区域</div>
      </div>
      <div className={styles.cropActions}>
        <button className={styles.button} onClick={handleBack}>重新选择</button>
        <button className={styles.buttonPrimary} onClick={handleConfirm}>确认裁剪</button>
      </div>
    </div>
  )
}
