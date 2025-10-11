import React from 'react'
import { useImages, useImagesDispatch } from '../app/ImagesContext'
import type { ImageData } from '../app/ImagesContext'

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
          .map((img, idx) => (
            <ImageItem
              key={idx}
              img={img}
              idx={idx}
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
  idx: number
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, idx: number) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>, toIdx: number) => void
}> = ({ img, idx, handleDragStart, handleDrop }) => {
  const images = useImages()
  const dispatch = useImagesDispatch()

  /*
  const handleRotate = (idx: number) => {
    if (dispatch && images) {
      dispatch({
        type: 'changed',
        image: { ...images[idx], rotation: (images[idx].rotation + 90) % 360 },
      })
    }
  }
  */

  return (
    <div
      key={idx}
      className="image-item"
      draggable
      onDragStart={e => handleDragStart(e, idx)}
      onDragEnd={e => e.currentTarget.classList.remove('dragging')}
      onDragOver={e => e.preventDefault()}
      onDrop={e => handleDrop(e, idx)}
    >
      <div className="page-layout">
        {img.state === 'loading' && (
          <div className="loading-overlay">
            <img src="./spinner.gif" />
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
        {/*
        <button className="rotate-btn" onClick={() => handleRotate(idx)}>
          ⟳
        </button>
        */}
        <a
          className="delete-text"
          onClick={e => {
            e.preventDefault()
            dispatch?.({ type: 'deleted', index: img.index })
          }}
        >
          Remove?
        </a>
      </div>
    </div>
  )
}
