import React from 'react'
import { useImages, createSheets } from '../app/ImagesContext'
import type { Page as PageType } from '../app/ImagesContext'
import { Page } from './Page'

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
            <div className="sheet-pair" key={idx}>
              <SheetSide page={sheet.front} sheetNum={idx + 1} side="front" />
              <SheetSide page={sheet.back} sheetNum={idx + 1} side="back" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const SheetSide: React.FC<{
  page: PageType
  sheetNum: number
  side: string
}> = ({ page, sheetNum, side }) => {
  return (
    <div className={`sheet ${side}`}>
      <Page img={page.imgLeft} />
      <Page img={page.imgRight} />
      <div className="page-number">
        Sheet {sheetNum} / Page {page.pageNumber}
      </div>
    </div>
  )
}
