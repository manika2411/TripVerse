import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import './index.css'

import TravelProvider from './context/TravelContext'

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <BrowserRouter>
      <TravelProvider>
        <App />
      </TravelProvider>
    </BrowserRouter>
  </React.StrictMode>
)