import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './components/Home'
import CodeNest from './components/CodeNest'
import ViewCodeNest from './components/ViewCodeNest'

const router = createBrowserRouter(
  [
    {
      path: "/",
      element:
      <div className='min-h-screen w-full flex flex-col bg-white'>
        <Navbar />
        <Home />
      </div>
    },
    {
      path: "/codenest",
      element:
      <div className='min-h-screen w-full flex flex-col bg-white'>
        <Navbar />
        <CodeNest />
      </div>
    },
    {
      path: "/codenest/:id",
      element:
      <div className='min-h-screen w-full flex flex-col bg-white'>
        <Navbar />
        <ViewCodeNest />
      </div>
    }
  ]
)

function App() {
  return (
    <div className='w-full min-h-screen bg-white'>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App