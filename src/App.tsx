import './App.css'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import MainLayout from './components/Layout/MainLayout'
import ProductsPage from './pages/ProductsPage/ProductsPage'
import ProductCart from './pages/cartPage/ProductCart'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const router = createBrowserRouter([
  {
    path:"/",
    element:<MainLayout/>,
    children:[
      {
        path:"/",
        element:<ProductsPage />
      },
      {
        path:"/products",
        element:<ProductsPage />
      },
      {
        path:"/cart",
        element:<ProductCart />
      }
    ]

  }
])

function App() {
  const queryClient = new QueryClient();

  return   (
    <>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} >
        </RouterProvider>
        </QueryClientProvider>
        </>
  )
   
  
}

export default App
