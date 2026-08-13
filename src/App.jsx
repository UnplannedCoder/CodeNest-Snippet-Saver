import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './components/Home'
import CodeNest from './components/CodeNest'
import ViewCodeNest from './components/ViewCodeNest'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: (
          <div className={`min-h-screen w-full flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <Home isDarkMode={isDarkMode} />
          </div>
        )
      },
      {
        path: "/codenest",
        element: (
          <div className={`min-h-screen w-full flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <CodeNest isDarkMode={isDarkMode} />
          </div>
        )
      },
      {
        path: "/codenest/:id",
        element: (
          <div className={`min-h-screen w-full flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <ViewCodeNest isDarkMode={isDarkMode} />
          </div>
        )
      }
    ]
  );

  return (
    <div className='w-full min-h-screen'>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App