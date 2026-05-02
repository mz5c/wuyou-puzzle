import { useRef, useState } from 'react'
import styles from './ImageUploader.module.css'

interface ImageUploaderProps {
  onImageReady: (imageData: string) => void
}

export default function ImageUploader({ onImageReady }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleConfirm = () => {
    if (!preview) return
    const img = new Image()
    img.onload = () => {
      const size = Math.min(img.width, img.height)
      const offsetX = 0
      const offsetY = 0
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size)
      const imageData = canvas.toDataURL('image/jpeg', 0.9)
      onImageReady(imageData)
      setPreview(null)
    }
    img.src = preview
  }

  return (
    <div className={styles.container}>
      <div className={styles.uploadArea} onClick={() => inputRef.current?.click()}>
        {preview ? '点击重新选择图片' : '点击上传图片，将自动切割为拼图'}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className={styles.hidden}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
      {preview && (
        <>
          <img src={preview} alt="preview" className={styles.preview} />
          <button className={styles.button} onClick={handleConfirm}>确认使用此图片</button>
        </>
      )}
    </div>
  )
}
