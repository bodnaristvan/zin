import React from 'react'
import { useImages, createPages } from '../app/ImagesContext'
import { Page } from './Page'

export const PrintablePages: React.FC = () => {
  const images = useImages()

  return (
    <div className="printable-pages">
      {images &&
        createPages(images).map((page, idx) => (
          <div className="sheet" key={idx}>
            <Page img={page.imgLeft} hiRes />
            <Page img={page.imgRight} hiRes />
          </div>
        ))}
    </div>
  )
}
