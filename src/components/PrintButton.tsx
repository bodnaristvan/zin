import React from 'react'
import { useImages } from '../app/ImagesContext'

export const PrintButton: React.FC = () => {
  const images = useImages()
  function handlePrintBook() {
    window.print()
  }

  return (
    <button disabled={!images || images.length === 0} onClick={handlePrintBook}>
      <div className="icon">🖨️</div> Print Book
    </button>
  )
}
