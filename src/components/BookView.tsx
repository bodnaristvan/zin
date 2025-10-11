import React, { useRef, useEffect, useState } from 'react'
import { useImages } from '../app/ImagesContext'
import type { ImageData } from '../app/ImagesContext'
import { BLANK_IMAGE } from '../app/ImagesContext'

export const BookView = () => {
  const images = useImages()

  const bookRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)

  const [pages, setPages] = useState<Array<[ImageData | null, ImageData | null]>>([])

  const scrollToPage = (pageIndex: number) => {
    if (bookRef.current) {
      const pageElement = bookRef.current.children[pageIndex] as HTMLElement
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setCurrentPage(pageIndex)
      }
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 0) {
      scrollToPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      scrollToPage(currentPage + 1)
    }
  }

  const updateCurrentPageFromScroll = () => {
    if (bookRef.current && pages.length > 0) {
      const container = bookRef.current
      const containerRect = container.getBoundingClientRect()
      const containerLeft = containerRect.left
      const containerWidth = containerRect.width

      // Find which page is most visible in the scroll container
      let mostVisiblePageIndex = 0
      let maxVisibleWidth = 0

      Array.from(container.children).forEach((pageElement, index) => {
        const pageRect = pageElement.getBoundingClientRect()
        const pageLeft = pageRect.left
        const pageRight = pageRect.right
        const containerRight = containerLeft + containerWidth

        // Calculate visible width of this page
        const visibleLeft = Math.max(pageLeft, containerLeft)
        const visibleRight = Math.min(pageRight, containerRight)
        const visibleWidth = Math.max(0, visibleRight - visibleLeft)

        if (visibleWidth > maxVisibleWidth) {
          maxVisibleWidth = visibleWidth
          mostVisiblePageIndex = index
        }
      })

      setCurrentPage(mostVisiblePageIndex)
    }
  }

  useEffect(() => {
    const container = bookRef.current
    if (container) {
      let scrollTimeout: ReturnType<typeof setTimeout> | null = null
      const handleScroll = () => {
        if (scrollTimeout) clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
          updateCurrentPageFromScroll()
        }, 100) // 100ms after scroll stops
      }
      container.addEventListener('scroll', handleScroll, { passive: true })
      // Also update on initial load
      updateCurrentPageFromScroll()

      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [pages.length])

  // create pages from images
  useEffect(() => {
    const newPages: Array<[ImageData | null, ImageData | null]> = []

    if (images && images.length > 0) {
      const sortedImages = [...images].sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      while (sortedImages.length % 4 !== 0) {
        sortedImages.push(BLANK_IMAGE)
      }
      let i = 0
      // Start with a blank image on the left
      newPages.push([null, sortedImages[i++] || null])
      while (i < sortedImages.length - 1) {
        const left = sortedImages[i++] || null
        const right = sortedImages[i++] || null
        newPages.push([left, right])
      }
      // End with a blank image on the right
      newPages.push([sortedImages[i++] || null, null])
    }
    setPages(newPages)
  }, [images])

  if (images?.length === 0) {
    return (
      <div className="no-images-message">
        <p>No images uploaded. Please upload images.</p>
      </div>
    )
  }

  return (
    <div className="book-view-container">
      <div ref={bookRef} className="book-view">
        {pages.map(([left, right], i) => (
          <div key={i} className="sheet">
            {left ? (
              <div className="page">
                <div className="page-layout">
                  {left.state === 'loading' && (
                    <div className="loading-overlay">
                      <img src="./spinner.gif" alt="Loading..." />
                    </div>
                  )}
                  {left.state === 'empty' && <img src="./spacer.gif" />}
                  {left.state === 'ready' && (
                    <>
                      <img src={left.thumbnail} alt={`Page ${i * 2 + 1}`} />
                      <div className="caption">{`${i * 2 + 1}`}</div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="page book-placeholder"></div>
            )}
            {right ? (
              <div className="page">
                <div className="page-layout">
                  {right.state === 'loading' && (
                    <div className="loading-overlay">
                      <img src="./spinner.gif" alt="Loading..." />
                    </div>
                  )}
                  {right.state === 'empty' && <img src="./spacer.gif" />}
                  {right.state === 'ready' && (
                    <img src={right.thumbnail} alt={`Page ${i * 2 + 2}`} />
                  )}
                </div>
              </div>
            ) : (
              <div className="page book-placeholder"></div>
            )}
          </div>
        ))}
      </div>

      <div className="book-navigation">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          className="nav-button prev-button"
        >
          ← Previous page
        </button>
        <span className="page-indicator">
          {currentPage + 1} of {pages.length}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === pages.length - 1}
          className="nav-button next-button"
        >
          Next page →
        </button>
      </div>
    </div>
  )
}
