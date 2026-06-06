import React from 'react'
import { usePageSettings } from '../app/ImagesContext'
import type { ImageData } from '../app/ImagesContext'
import spinnerGif from '../assets/spinner.gif'
import spacerGif from '../assets/spacer.gif'

export const Page: React.FC<{
  img: ImageData | null
  hiRes?: boolean
}> = ({ img, hiRes }) => {
  const { showCaption } = usePageSettings()

  return (
    <div className="page">
      <div className="page-content">
        <div className="page-image">
          {img && img.state === 'loading' && (
            <div className="loading-overlay">
              <img src={spinnerGif} alt="Loading..." />
            </div>
          )}
          {img && img.state === 'empty' && <img src={spacerGif} alt="" />}
          {img && img.state === 'ready' && (
            <img
              src={hiRes ? img.src : img.thumbnail}
              alt={img.name}
              style={{ objectFit: img.fit, transform: `rotate(${img.rotation}deg)` }}
              data-index={img.index}
            />
          )}
        </div>
        {showCaption && (
          <div className="caption" dangerouslySetInnerHTML={{ __html: img?.caption ?? '' }} />
        )}
      </div>
    </div>
  )
}
