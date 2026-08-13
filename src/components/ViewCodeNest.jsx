import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const ViewCodeNest = ({ isDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const allTasks = useSelector((state) => state.codenest.codenest);
  const task = allTasks.find((item) => item._id === id);

  if (!task) {
    return <div className="p-5 text-center">Task not found</div>;
  }

  return (
    <div className='flex flex-col items-center w-full px-6 py-6 grow'>
      <div className='flex flex-col gap-6 w-full max-w-6xl mx-auto grow'>
        
        {/* Top Bar with Title Input and Back Button */}
        <div className='flex flex-row gap-4 justify-between w-full items-center'>
          <input 
            className={`border-2 p-3 px-4 rounded-2xl w-full outline-none font-semibold text-lg shadow-sm transition-colors duration-300 ${
              isDarkMode 
                ? 'border-gray-800 bg-black text-gray-300' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
            type="text"
            value={task.title}
            disabled
          />
          <button 
            onClick={() => navigate(-1)}
            className={`border-2 px-8 py-3.5 rounded-2xl font-semibold transition whitespace-nowrap shadow-sm ${
              isDarkMode 
                ? 'border-gray-800 bg-black text-gray-300 hover:bg-white hover:text-black' 
                : 'border-gray-300 bg-white text-gray-800 hover:bg-black hover:text-white'
            }`}
          >
            Back
          </button>
        </div>

        {/* Code Window Container */}
        <div className={`border-2 rounded-2xl w-full flex flex-col grow overflow-hidden shadow-xl transition-colors duration-300 ${
          isDarkMode ? 'border-gray-800 bg-black text-white' : 'border-gray-300 bg-white text-gray-900'
        }`}>
          
          <div className={`flex justify-between items-center px-4 py-3 border-b transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-300'
          }`}>
            <div className='flex items-center gap-2'>
              <div className='w-3.5 h-3.5 rounded-full bg-red-500'></div>
              <div className='w-3.5 h-3.5 rounded-full bg-yellow-500'></div>
              <div className='w-3.5 h-3.5 rounded-full bg-green-500'></div>
            </div>

            <button 
              onClick={() => {
                  navigator.clipboard.writeText(task.content);
                  toast.success("Copied to Clipboard");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-lg font-medium transition ${
                isDarkMode 
                    ? 'border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800 hover:text-white' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-200 hover:text-black'
              }`}
              title='Copy Code'
            >
              <Copy size={20} />
              <span>Copy</span>
            </button>
          </div>

          <div className={`p-6 font-mono text-xl whitespace-pre-wrap wrap-break-words min-h-[65vh] grow cursor-not-allowed transition-colors duration-300 ${
            isDarkMode ? 'bg-black text-gray-200' : 'bg-white text-gray-800'
          }`}>
              {task.content}
          </div>

        </div>

      </div>
    </div>
  )
}

export default ViewCodeNest