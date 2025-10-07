import React from 'react'
import { useImages, createPages } from '../app/ImagesContext'
import type { ImageData } from '../app/ImagesContext'

export const PrintablePages: React.FC = () => {
  const images = useImages()

  return (
    <div className="printable-pages">
      {images &&
        createPages(images).map((page, idx) => (
          <div className="sheet" key={idx}>
            {/* <div className="page-number">Page {page.pageNumber}</div> */}
            <div className="page left">
              {page.imgLeft ? <Image img={page.imgLeft} /> : <Blank />}
              <div className="caption">{page.imgLeft && page.imgLeft?.index + 1}</div>
            </div>
            <div className="page right">
              {page.imgRight ? <Image img={page.imgRight} /> : <Blank />}
              <div className="caption">{page.imgRight && page.imgRight?.index + 1}</div>
            </div>
          </div>
        ))}
    </div>
  )
}

const Image: React.FC<{
  img: ImageData
}> = ({ img }) => {
  return <img src={img.src} alt={img.name} />
}

const Blank: React.FC = () => {
  return <div className="blank-page"></div>
}
