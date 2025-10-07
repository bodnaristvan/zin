import React, { createContext, useContext, useReducer } from 'react'

export type ImageData = {
  index: number
  src: string // original image
  name: string
  rotation: number
  thumbnail: string // thumbnail image
  state: 'loading' | 'empty' | 'ready'
}

export const BLANK_IMAGE: ImageData = {
  index: -1,
  src: '',
  name: 'Blank Page',
  rotation: 0,
  thumbnail: '',
  state: 'empty',
}

export type Sheet = {
  front: Page
  back: Page
}

export type Page = {
  pageNumber: number
  imgLeft: ImageData | null
  imgRight: ImageData | null
}

const ImagesContext = createContext<ImageData[] | null>(null)
const ImagesDispatchContext = createContext<React.Dispatch<ImagesAction> | null>(null)

export function ImagesProvider({ children }: { children: React.ReactNode }) {
  const [images, dispatch] = useReducer(imagesReducer, [] as ImageData[])

  return (
    <ImagesContext.Provider value={images}>
      <ImagesDispatchContext.Provider value={dispatch}>{children}</ImagesDispatchContext.Provider>
    </ImagesContext.Provider>
  )
}

export function useImages() {
  return useContext(ImagesContext)
}

export function useImagesDispatch() {
  return useContext(ImagesDispatchContext)
}

type ImagesAction =
  | { type: 'added'; image: ImageData }
  | { type: 'changed'; image: ImageData }
  | { type: 'reorder'; fromIdx: number; toIdx: number }
  | { type: 'deleted'; index: number }
  | { type: 'reindex' }

function imagesReducer(images: ImageData[], action: ImagesAction) {
  function reindex(images: ImageData[]): ImageData[] {
    return images.map((img, idx) => ({
      ...img,
      index: idx,
    }))
  }
  switch (action.type) {
    case 'added': {
      const existingIdx = images.findIndex(img => img.index === action.image.index)
      if (existingIdx !== -1) {
        const arr = [...images]
        arr.splice(existingIdx, 0, action.image)
        // Update index values to match new order
        return reindex(arr)
      }
      return [...images, action.image]
    }
    case 'changed': {
      return images.map(t => {
        if (t.index === action.image.index) {
          return action.image
        } else {
          return t
        }
      })
    }
    case 'reorder': {
      const { fromIdx, toIdx } = action
      const fromIndex = images.findIndex(img => img.index === fromIdx)
      const toIndex = images.findIndex(img => img.index === toIdx)
      if (fromIndex === -1 || toIndex === -1) return images
      const arr = [...images]
      const [moved] = arr.splice(fromIndex, 1)
      arr.splice(toIndex, 0, moved)
      // Update index values to match new order
      return reindex(arr)
    }
    case 'deleted': {
      return reindex(images.filter(t => t.index !== action.index))
    }
    case 'reindex': {
      return reindex(images)
    }
    default: {
      throw Error('Unknown action: ' + action)
    }
  }
}

export function createPages(imgs: ImageData[]): Page[] {
  const numberOfSheets = Math.ceil(imgs.length / 4)
  const numberOfPages = numberOfSheets * 2
  const maxPossibleImages = numberOfSheets * 4
  const pages: Page[] = Array.from({ length: numberOfPages }, (_, i) => {
    const pageNum = i + 1

    const leftImgIdx = pageNum % 2 === 0 ? maxPossibleImages - pageNum + 2 : pageNum + 1
    const rightImgIdx = pageNum % 2 === 0 ? pageNum - 1 : maxPossibleImages - pageNum

    return {
      pageNumber: pageNum,
      imgLeft: imgs.find(img => img.index === leftImgIdx - 1) || null,
      imgRight: imgs.find(img => img.index === rightImgIdx - 1) || null,
    } as Page
  })
  return pages
}

export function createSheets(imgs: ImageData[]): Sheet[] {
  const numberOfSheets = Math.ceil(imgs.length / 4)
  const pages = createPages(imgs)
  const sheets: Sheet[] = Array.from({ length: numberOfSheets }, (_, i) => {
    return {
      front: pages[i * 2],
      back: pages[i * 2 + 1],
    } as Sheet
  })

  return sheets
}
