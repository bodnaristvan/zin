import React from 'react'
import { usePageSettings } from '../app/ImagesContext'
import type { ImageData } from '../app/ImagesContext'
import spinnerGif from '../assets/spinner.gif'
import spacerGif from '../assets/spacer.gif'

// A plain `transform: rotate()` keeps the image's original layout box, so a
// quarter-turn leaves it sized for the wrong orientation and the page clips it.
// For 90°/270° we swap the box to the container's opposite dimensions (via
// `.page-image`'s size-container units cqh/cqw) so it fills the page after
// rotating.
function rotatedImageStyle(img: ImageData): React.CSSProperties {
  const rotation = ((img.rotation % 360) + 360) % 360
  const quarterTurn = rotation === 90 || rotation === 270
  return {
    objectFit: img.fit,
    transform: `rotate(${rotation}deg)`,
    width: quarterTurn ? '100cqh' : '100%',
    height: quarterTurn ? '100cqw' : '100%',
  }
}

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
              style={rotatedImageStyle(img)}
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
