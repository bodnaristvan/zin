import React from 'react'

export function Instructions() {
  return (
    <div className="instructions">
      <h2>Instructions</h2>
      <ol>
        <li>Upload images using the "Add files" button.</li>
        <li>Reorder images by dragging and dropping them in the desired order.</li>
        <li>Preview the layout in "Book View".</li>
        <li>
          Click "Print Zine" to print your zine.
          <ul>
            <li>make sure to select "Landscape" orientation</li>
            <li>disable headers/footers in the print dialog</li>
            <li>
              print on both sides of the paper -- check the "Sheets View" for a preview of how pages
              should be arranged
            </li>
            <li>
              for best results, choose A4 paper size, and use a 80-100gr paper to allow easy folding
            </li>
          </ul>
        </li>
      </ol>
      <p></p>
    </div>
  )
}
