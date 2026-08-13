import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const ViewCodeNest = () => {
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
            className='border-2 p-3 px-4 rounded-2xl w-full outline-none border-gray-800 bg-black text-gray-300 font-semibold text-lg shadow-sm'
            type="text"
            value={task.title}
            disabled
          />
          <button 
            onClick={() => navigate(-1)}
            className='border-2 px-8 py-3.5 rounded-2xl font-semibold hover:bg-white hover:text-black transition whitespace-nowrap border-gray-800 bg-black text-gray-300 shadow-sm'
          >
            Back
          </button>
        </div>

        {/* Code Window Container Spanning Full Width and Height */}
        <div className='border-2 rounded-2xl w-full flex flex-col grow overflow-hidden shadow-xl bg-black text-white'>
          
          {/* Window Header Bar with macOS dots and Copy button */}
          <div className='flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-gray-800'>
            {/* Left: Red, Yellow, Green macOS style dots */}
            <div className='flex items-center gap-2'>
              <div className='w-3.5 h-3.5 rounded-full bg-red-500'></div>
              <div className='w-3.5 h-3.5 rounded-full bg-yellow-500'></div>
              <div className='w-3.5 h-3.5 rounded-full bg-green-500'></div>
            </div>

            {/* Right: Copy Button */}
            <button 
              onClick={() => {
                  navigator.clipboard.writeText(task.content);
                  toast.success("Copied to Clipboard");
              }}
              className='flex items-center gap-1.5 px-3 py-1.5 border border-gray-700 rounded-lg text-lg font-medium hover:bg-gray-800 hover:text-white transition bg-gray-900'
              title='Copy Code'
            >
              <Copy size={20} />
              <span>Copy</span>
            </button>
          </div>

          {/* Content / Code Body Area */}
          <div className='p-6 font-mono text-xl whitespace-pre-wrap wrap-break-words text-gray-200 min-h-[65vh] grow bg-black'>
              {task.content}
          </div>

        </div>

      </div>
    </div>
  )
}

export default ViewCodeNest