import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'

const root = document.getElementById('images')
if (root) {
  ReactDOM.createRoot(root).render(<App></App>)
}
