import React, { useState } from 'react'
import { ImagesProvider, PageSettingsProvider, usePageSettings } from './ImagesContext'
import { PrintablePages } from '../components/PrintView'
import { ImageGrid } from '../components/ImageGrid'
import { PrintPreview } from '../components/PrintPreview'
import { ImageUploader } from '../components/ImageUploader'
import { BookView } from '../components/BookView'
import { Instructions } from '../components/Instructions'
import { PrintButton } from '../components/PrintButton'
import '../style.css'

enum DisplayedModule {
  ImageGrid,
  PrintPreview,
  BookView,
  InstructionsView,
}

const App: React.FC = () => {
  return (
    <ImagesProvider>
      <PageSettingsProvider>
        <AppShell />
      </PageSettingsProvider>
    </ImagesProvider>
  )
}

const AppShell: React.FC = () => {
  const [displayedModule, setDisplayedModule] = useState(DisplayedModule.InstructionsView)
  const { margin } = usePageSettings()

  return (
    <div className="app" style={{ '--page-margin': `${margin}%` } as React.CSSProperties}>
      <header>
        <h1>'zin</h1>
        <h2>A tool for printing your photos.</h2>
      </header>

      <div className="container">
        <div className="menu">
          <ImageUploader onUploadStart={() => setDisplayedModule(DisplayedModule.ImageGrid)} />

          <button onClick={() => setDisplayedModule(DisplayedModule.BookView)}>
            <div className="icon">📖</div> Book View
          </button>
          <button onClick={() => setDisplayedModule(DisplayedModule.ImageGrid)}>
            <div className="icon">✏️</div> Edit Images
          </button>
          <button onClick={() => setDisplayedModule(DisplayedModule.PrintPreview)}>
            <div className="icon">📄</div> Sheets View
          </button>

          <PrintButton />

          <button onClick={() => setDisplayedModule(DisplayedModule.InstructionsView)}>
            <div className="icon">📜</div> Instructions
          </button>
        </div>

        {displayedModule === DisplayedModule.BookView && <BookView />}

        {displayedModule === DisplayedModule.ImageGrid && <ImageGrid />}

        {displayedModule === DisplayedModule.PrintPreview && <PrintPreview />}

        {displayedModule === DisplayedModule.InstructionsView && <Instructions />}
      </div>

      <PrintablePages />
    </div>
  )
}

export default App
