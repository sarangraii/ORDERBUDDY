// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { BrowserRouter } from 'react-router-dom'
// import App from './App'
// import './index.css'

// const queryClient = new QueryClient()

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
//         <App />
//       </BrowserRouter>
//     </QueryClientProvider>
//   </React.StrictMode>
// )
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import App from './App'
import './index.css'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)