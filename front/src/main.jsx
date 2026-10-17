// main.jsx es el punto de entrada de la aplicación React.
// Aquí le decimos a React dónde debe renderizar toda nuestra app dentro del HTML.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CarritoProvider } from './context/Carritocontext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CarritoProvider>
      <App />
    </CarritoProvider>
  </StrictMode>,
)