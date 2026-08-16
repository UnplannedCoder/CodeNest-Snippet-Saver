import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const ViewCodeNest = ({ isDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const allSnippets = useSelector((state) => state.codenest.codenest);
  const snippet = allSnippets.find((item) => item._id === id);

  if (!snippet) {
    return <div className="p-5 text-center">Snippet not found</div>;
  }

  return (
    <div className='flex flex-col items-center w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-8 sm:pb-12 min-h-[calc(100vh-65px)]'>
      <div className='flex flex-col gap-4 sm:gap-6 w-full max-w-3xl mx-auto mb-4 sm:mb-6'>
        
        {/* Top Bar with Title Input and Back Button */}
        <div className='flex flex-row gap-3 sm:gap-4 justify-between w-full items-center'>
          <input 
            className={`border-2 p-3 px-4 rounded-2xl w-full outline-none font-semibold text-base sm:text-lg shadow-sm transition-colors duration-300 ${
              isDarkMode 
                ? 'border-gray-800 bg-black text-gray-300' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
            type="text"
            value={snippet.title}
            disabled
          />
          <button 
            onClick={() => navigate(-1)}
            className={`border-2 px-5 sm:px-8 py-3 rounded-2xl font-semibold transition whitespace-nowrap shadow-sm ${
              isDarkMode 
                ? 'border-gray-800 bg-black text-gray-300 hover:bg-white hover:text-black' 
                : 'border-gray-300 bg-white text-gray-800 hover:bg-black hover:text-white'
            }`}
          >
            Back
          </button>
        </div>

        {/* Code Window Container */}
        <div className={`border-2 rounded-2xl w-full flex flex-col overflow-hidden shadow-xl transition-colors duration-300 ${
          isDarkMode ? 'border-gray-800 bg-black text-white' : 'border-gray-300 bg-white text-gray-900'
        }`}>
          
          <div className={`flex justify-between items-center px-3 sm:px-4 py-3 border-b transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-300'
          }`}>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-red-500'></div>
              <div className='w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-yellow-500'></div>
              <div className='w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-green-500'></div>
            </div>

            <button 
              onClick={() => {
                  navigator.clipboard.writeText(snippet.content);
                  toast.success("Copied to Clipboard");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm sm:text-base font-medium transition ${
                isDarkMode 
                    ? 'border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800 hover:text-white' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-200 hover:text-black'
              }`}
              title='Copy Code'
            >
              <Copy size={18} />
              <span>Copy</span>
            </button>
          </div>

          <div className={`view-code-panel p-3 sm:p-4 font-mono text-sm sm:text-base whitespace-pre-wrap wrap-break-words min-h-[260px] sm:min-h-[380px] md:min-h-[460px] max-h-[55vh] sm:max-h-[65vh] overflow-y-auto overflow-x-hidden cursor-not-allowed transition-colors duration-300 ${
            isDarkMode ? 'border-gray-800 bg-black text-gray-200' : 'border-gray-300 bg-white text-gray-800'
          }`}>
              {snippet.content}
          </div>

        </div>

      </div>
    </div>
  )

}

export default ViewCodeNest