import React, { useState } from 'react'
import { useImages, useImagesDispatch, usePageSettings } from '../app/ImagesContext'
import type { ImageData } from '../app/ImagesContext'
import { Page } from './Page'

export const ImageGrid = () => {
  const images = useImages()
  const { showCaption, margin, setShowCaption, setMargin } = usePageSettings()
  const [selected, setSelected] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.dataTransfer.setData('text/plain', idx.toString())
  }

  const dispatch = useImagesDispatch()
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
      <div className="page-settings">
        <label>
          <input
            type="checkbox"
            checked={showCaption}
            onChange={e => setShowCaption(e.target.checked)}
          />
          With captions
        </label>
        <label className="margin-control">
          Margin
          <input
            type="range"
            min={0}
            max={20}
            value={margin}
            onChange={e => setMargin(Number(e.target.value))}
          />
          <span className="margin-value">{margin}%</span>
        </label>
      </div>
      <div className="instruction">Drag to reorder · click an image to set fit</div>
      <div className="images">
        {images
          ?.sort((a, b) => a.index - b.index)
          .map(img => (
            <ImageItem
              key={img.index}
              img={img}
              selected={selected === img.index}
              showCaption={showCaption}
              onSelect={() => setSelected(prev => (prev === img.index ? null : img.index))}
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
  selected: boolean
  showCaption: boolean
  onSelect: () => void
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, idx: number) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>, toIdx: number) => void
}> = ({ img, selected, showCaption, onSelect, handleDragStart, handleDrop }) => {
  const dispatch = useImagesDispatch()

  const editCaption = (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = window.prompt('Caption (HTML allowed):', img.caption ?? '')
    if (next !== null) dispatch?.({ type: 'setCaption', index: img.index, caption: next })
  }

  return (
    <div
      className={`image-item${selected ? ' selected' : ''}`}
      draggable
      onClick={onSelect}
      onDragStart={e => {
        e.currentTarget.classList.add('dragging')
        handleDragStart(e, img.index)
      }}
      onDragEnd={e => e.currentTarget.classList.remove('dragging')}
      onDragOver={e => e.preventDefault()}
      onDrop={e => handleDrop(e, img.index)}
    >
      <Page img={img} />

      <span className="index-num">{img.index + 1}</span>

      {selected && img.state === 'ready' && (
        <>
          <div className="fit-controls">
            <button
              type="button"
              className={img.fit === 'contain' ? 'active' : ''}
              onClick={e => {
                e.stopPropagation()
                dispatch?.({ type: 'setFit', index: img.index, fit: 'contain' })
              }}
            >
              Fit
            </button>
            <button
              type="button"
              className={img.fit === 'cover' ? 'active' : ''}
              onClick={e => {
                e.stopPropagation()
                dispatch?.({ type: 'setFit', index: img.index, fit: 'cover' })
              }}
            >
              Fill
            </button>
            <button
              type="button"
              className="rotate-btn"
              title="Rotate 90°"
              onClick={e => {
                e.stopPropagation()
                dispatch?.({ type: 'rotate', index: img.index })
              }}
            >
              ↻
            </button>
          </div>
          {showCaption && (
            <button
              type="button"
              className="caption-edit"
              onClick={editCaption}
              title="Set caption"
            >
              <span aria-hidden>✏️</span>
            </button>
          )}
        </>
      )}

      <button
        className="delete-text"
        onClick={e => {
          e.stopPropagation()
          dispatch?.({ type: 'deleted', index: img.index })
        }}
      >
        Remove?
      </button>
    </div>
  )
}
