
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Shopprovider } from './Context/ShopContext.tsx'

createRoot(document.getElementById('root')!).render(
  <Shopprovider>
    <App />
  </Shopprovider>,
)
