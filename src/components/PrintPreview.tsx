import React, { useState } from 'react'
import { useImages, createSheets } from '../app/ImagesContext'
import type { ImageData, Page } from '../app/ImagesContext'

export const PrintPreview: React.FC = () => {
  const images = useImages()

  if (images?.length === 0) {
    return (
      <div className="no-images-message">
        <p>No images uploaded. Please upload images.</p>
      </div>
    )
  }

  return (
    <div className="printpreview">
      {images && (
        <div className="sheets">
          {createSheets(images).map((sheet, idx) => (
            <div className="sheet" key={idx}>
              <SheetPage page={sheet.front} sheetNum={idx + 1} className="front" />
              <SheetPage page={sheet.back} sheetNum={idx + 1} className="back" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const SheetPage: React.FC<{
  page: Page
  sheetNum: number
  className: string
}> = ({ page, sheetNum, className }) => {
  return (
    <div className={`page ${className}`}>
      <div className="page-number">
        Sheet {sheetNum} / Page {page.pageNumber}
      </div>
      <div className="thumbnail thumbnail-left">
        {page.imgLeft ? <Image img={page.imgLeft} /> : <Blank />}
      </div>
      <div className="thumbnail thumbnail-right">
        {page.imgRight ? <Image img={page.imgRight} /> : <Blank />}
      </div>
    </div>
  )
}

const Image: React.FC<{
  img: ImageData
}> = ({ img }) => {
  return (
    <div key={img.index} className="preview-item">
      <div className="image-with-tools">
        <img
          src={img.thumbnail}
          alt={img.name}
          style={{ transform: `rotate(${img.rotation}deg)` }}
          data-index={img.index}
        />
        <span className="index-num">{img.index + 1}</span>
      </div>
    </div>
  )
}

const Blank: React.FC = () => {
  return <div className="blank-page">Blank Page</div>
}
