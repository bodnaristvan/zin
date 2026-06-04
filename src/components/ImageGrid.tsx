import React from 'react'
import { useImages, useImagesDispatch } from '../app/ImagesContext'
import type { ImageData } from '../app/ImagesContext'
import spinnerGif from '../assets/spinner.gif'

export const ImageGrid = () => {
  const images = useImages()
  const dispatch = useImagesDispatch()

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.dataTransfer.setData('text/plain', idx.toString())
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toIdx: number) => {
    e.preventDefault()
    const fromIdx = Number(e.dataTransfer.getData('text/plain'))
    if (fromIdx === toIdx) return

    dispatch?.({ type: 'reorder', fromIdx, toIdx })
  }

  if (images?.length === 0) {
    return (
      <div className="no-images-message">
        <p>No images uploaded. Please upload images.</p>
      </div>
    )
  }

  return (
    <div className="images-grid">
      <div className="instruction">Drag and drop to reorder images.</div>
      <div className="images">
        {images
          ?.sort((a, b) => a.index - b.index)
          .map(img => (
            <ImageItem
              key={img.index}
              img={img}
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
            />
          ))}
      </div>
    </div>
  )
}

const ImageItem: React.FC<{
  img: ImageData
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, idx: number) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>, toIdx: number) => void
}> = ({ img, handleDragStart, handleDrop }) => {
  const dispatch = useImagesDispatch()

  return (
    <div
      className="image-item"
      draggable
      onDragStart={e => {
        e.currentTarget.classList.add('dragging')
        handleDragStart(e, img.index)
      }}
      onDragEnd={e => e.currentTarget.classList.remove('dragging')}
      onDragOver={e => e.preventDefault()}
      onDrop={e => handleDrop(e, img.index)}
    >
      <div className="page-layout">
        {img.state === 'loading' && (
          <div className="loading-overlay">
            <img src={spinnerGif} />
          </div>
        )}
        {img.state === 'ready' && (
          <>
            <img
              src={img.thumbnail}
              alt={img.name}
              style={{ transform: `rotate(${img.rotation}deg)` }}
              data-index={img.index}
            />
            <span className="index-num">{img.index + 1}</span>
          </>
        )}
        <button
          className="delete-text"
          onClick={() => dispatch?.({ type: 'deleted', index: img.index })}
        >
          Remove?
        </button>
      </div>
    </div>
  )
}
