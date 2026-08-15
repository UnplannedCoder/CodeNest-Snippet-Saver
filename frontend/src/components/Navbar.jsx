import React from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <nav className={`w-full border-b transition-colors duration-300 ${
      isDarkMode ? 'border-gray-800 bg-black text-white' : 'border-gray-200 bg-white text-gray-900'
    }`}>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center w-full'>
        <div className='font-bold text-2xl sm:text-3xl'>
          <Link to="/">CodeNest</Link>
        </div>

        <div className='flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto'>
          <div className='flex gap-3 sm:gap-4 font-semibold'>
            <Link to="/" className='hover:opacity-80 transition font-bold text-base sm:text-lg'>Home</Link>
            <Link to="/codenest" className='hover:opacity-80 transition font-bold text-base sm:text-lg'>Snippets</Link>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 border rounded-xl flex items-center justify-center transition shadow-sm ${
              isDarkMode 
                ? 'border-gray-800 bg-gray-900 text-yellow-400 hover:bg-gray-800' 
                : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title='Toggle Theme'
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar