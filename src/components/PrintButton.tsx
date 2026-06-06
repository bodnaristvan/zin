import React from 'react'
import { useImages } from '../app/ImagesContext'

export const PrintButton: React.FC = () => {
  const images = useImages()
  function handlePrint() {
    window.print()
  }

  return (
    <button disabled={!images || images.length === 0} onClick={handlePrint}>
      <div className="icon">🖨️</div> Print Zine
    </button>
  )
}
