import React, { useRef } from 'react'
import { useImagesDispatch, useImages } from '../app/ImagesContext'
import type { ImageData } from '../app/ImagesContext'

interface ImageUploaderProps {
  onUploadStart?: (files: File[]) => void
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadStart }) => {
  const dispatch = useImagesDispatch()
  const uploadRef = useRef<HTMLInputElement>(null)
  const images = useImages()

  // if there are already existing images just append the new uploads to the end
  const nextIndex = images && images.length > 0 ? Math.max(...images.map(img => img.index)) + 1 : 0

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (onUploadStart) {
      onUploadStart(files)
    }
    files.forEach((file, idx) => {
      const newIndex = nextIndex + idx

      const newImage: ImageData = {
        index: newIndex,
        src: '',
        name: file.name,
        rotation: 0,
        thumbnail: '',
        state: 'loading',
      }
      dispatch?.({ type: 'added', image: newImage })
      const reader = new FileReader()
      reader.onload = evt => {
        const src = evt.target?.result as string
        generateThumbnail(src).then(thumbnail => {
          dispatch?.({
            type: 'changed',
            image: { ...newImage, src, thumbnail, state: 'ready' },
          })
        })
      }
      reader.readAsDataURL(file)
    })
    if (uploadRef.current) uploadRef.current.value = ''
  }

  function generateThumbnail(src: string): Promise<string> {
    return new Promise(resolve => {
      const img = new window.Image()
      img.onload = function () {
        const canvas = document.createElement('canvas')
        const maxDim = 360
        let w = img.width
        let h = img.height
        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w)
            w = maxDim
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h)
            h = maxDim
          }
        }
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h)
          resolve(canvas.toDataURL('image/jpeg', 0.7))
        } else {
          resolve(src)
        }
      }
      img.onerror = () => resolve(src)
      img.src = src
    })
  }

  return (
    <>
      <input
        type="file"
        multiple
        accept="image/*"
        ref={uploadRef}
        onChange={handleUpload}
        style={{ display: 'none' }}
      />
      <button type="button" className="upload" onClick={() => uploadRef.current?.click()}>
        <div className="icon">📤</div> Add files
      </button>
    </>
  )
}
