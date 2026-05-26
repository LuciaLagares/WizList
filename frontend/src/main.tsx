import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css"
import AppRouter from './router'

document.documentElement.setAttribute('data-theme', 'hogwarts')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
