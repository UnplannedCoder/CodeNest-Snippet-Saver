import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCodeNest } from '../redux/Slice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Share2, Eye, Copy, Calendar, Search, FileText } from 'lucide-react';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    LinkedinShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    LinkedinIcon,
} from 'react-share';

const CodeNest = () => {
    const [shareId, setShareId] = useState(null);
    const navigate = useNavigate();

    const task = useSelector((state) => state.codenest.codenest);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm ] = useState('');
    const filteredData = task.filter((task)=>task.title.toLowerCase().includes(searchTerm.toLowerCase()))

    function handleDelete(codeId){
        dispatch(removeFromCodeNest(codeId))
    }

    const analyzeContentType = (content) => {
        if (!content) return "TEXT";
        const codeKeywords = ['const ', 'let ', 'var ', 'function ', 'class ', 'def ', 'import ', 'return ', '#include', 'public class', 'console.log'];
        const codeSymbols = ['{', '}', ';', '=>', '()', '===', '++'];
        const hasKeyword = codeKeywords.some(keyword => content.includes(keyword));
        const symbolCount = codeSymbols.filter(symbol => content.includes(symbol)).length;
        if (hasKeyword || symbolCount >= 2) return "CODE";
        return "TEXT";
    };

  return (
    <div className='flex flex-col items-center w-full px-6 py-6 grow bg-white'>
      <div className='flex flex-col gap-6 w-full max-w-6xl mx-auto grow'>
        
        {/* Dark Search Bar */}
        <div className='relative w-full flex items-center'>
            <Search className='absolute left-4 text-gray-400' size={20} />
            <input 
            className='border border-gray-800 bg-black p-3.5 pl-12 rounded-2xl w-full outline-none text-lg font-semibold text-white placeholder-gray-500 shadow-sm'
            type="search" 
            placeholder='Search question here...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>

        {/* Outer Dark Container */}
        <div className='border border-gray-800 p-6 rounded-2xl w-full flex flex-col gap-6 shadow-xl bg-black text-white'>
          <div className='flex flex-col gap-1'>
              <h2 className='text-3xl font-bold tracking-wide text-white'>All Tasks</h2>
              {/* Subtitle is now conditionally rendered only when there are no items */}
              {filteredData.length === 0 && (
                  <p className='text-sm text-gray-400'>Create your first task to get started</p>
              )}
          </div>

          {filteredData.length > 0 ? (
              <div className='flex flex-col gap-5'>
                  {filteredData.map((task, index) => {
                      const contentType = analyzeContentType(task.content);

                      return (
                          <div key={task.id || index} className='border border-gray-800 p-5 rounded-2xl flex justify-between items-start bg-black shadow-sm'>
                              
                              {/* Left Side: Title and Content */}
                              <div className='flex flex-col gap-2 max-w-[70%]'>
                                  <div className='font-bold text-2xl text-white'>
                                      {task.title}
                                  </div>
                                  <div className='text-gray-300 text-lg wrap-break-words line-clamp-3 font-mono'>
                                      {task.content}
                                  </div>
                              </div>

                              {/* Right Side: Icons, Date, Badge */}
                              <div className='flex flex-col items-end gap-2'>
                                  <div className='flex flex-row gap-1.5 items-center'>
                                      <button 
                                      className='p-2.5 border border-gray-800 rounded-xl bg-black text-gray-50 hover:bg-gray-900 hover:text-white transition' 
                                      onClick={() => navigate(`/?codeId=${task._id}`)} 
                                      title='Edit'>
                                          <Edit size={21} />
                                      </button>

                                      <button 
                                      className='p-2.5 border border-gray-800 rounded-xl bg-black text-gray-50 hover:bg-gray-900 hover:text-white transition' 
                                      onClick={() => handleDelete(task._id)} 
                                      title='Delete'>
                                          <Trash2 size={21} />
                                      </button>

                                      <button
                                      className='p-2.5 border border-gray-800 rounded-xl bg-black text-gray-50 hover:bg-gray-900 hover:text-white transition'
                                      onClick={() => setShareId(shareId === task._id ? null : task._id)} 
                                      title='Share'>
                                          <Share2 size={21} />
                                      </button>

                                      <button 
                                      className='p-2.5 border border-gray-800 rounded-xl bg-black text-gray-50 hover:bg-gray-900 hover:text-white transition' 
                                      onClick={() => navigate(`/codenest/${task._id}`)} 
                                      title='View'>
                                          <Eye size={21} />
                                      </button>

                                      <button 
                                      className='p-2.5 border border-gray-800 rounded-xl bg-black text-gray-50 hover:bg-gray-900 hover:text-white transition' 
                                      onClick={() => {
                                          navigator.clipboard.writeText(task.content); 
                                          toast.success("Copied to Clipboard");
                                      }} 
                                      title='Copy'>
                                          <Copy size={21} />
                                      </button>
                                  </div>

                                  {/* Date Section */}
                                  <div className="text-base text-gray-300 flex items-center gap-1.5 mt-1 font-mono">
                                      <Calendar size={18} />
                                      <span>
                                          {new Date(task.createdAt).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                          })}
                                      </span>
                                  </div>

                                  {/* Dynamic Type Badge */}
                                  <div className={`mt-2 px-4 py-1 border rounded-xl text-base font-semibold tracking-wider ${
                                      contentType === 'CODE' 
                                          ? 'text-green-500 border-green-800 bg-green-950/30' 
                                          : 'text-blue-500 border-blue-800 bg-blue-950/30'
                                  }`}>
                                      {contentType}
                                  </div>

                                  {/* Social Share Popout */}
                                  {shareId === task._id && (
                                      <div className='flex justify-center gap-2 mt-2 bg-gray-900 p-2 rounded-xl border border-gray-800'>
                                          <FacebookShareButton url={`${window.location.origin}/vault/${task._id}`} hashtag="#CodeNest">
                                          <FacebookIcon size={28} round />
                                          </FacebookShareButton>

                                          <TwitterShareButton url={`${window.location.origin}/vault/${task._id}`} title={task.title}>
                                          <TwitterIcon size={28} round />
                                          </TwitterShareButton>

                                          <WhatsappShareButton url={`${window.location.origin}/vault/${task._id}`} title={task.title}>
                                          <WhatsappIcon size={28} round />
                                          </WhatsappShareButton>

                                          <LinkedinShareButton url={`${window.location.origin}/vault/${task._id}`}>
                                          <LinkedinIcon size={28} round />
                                          </LinkedinShareButton>
                                      </div>
                                  )}
                              </div>

                          </div>
                      )
                  })}
              </div>
          ) : (
              /* Empty State Box matching your exact requirements */
              <div className='border border-dashed border-gray-800 rounded-2xl p-16 flex flex-col items-center justify-center gap-4 my-2 text-center bg-black/40'>
                  <div className='p-4 rounded-2xl bg-gray-900 border border-gray-800 text-gray-300'>
                      <FileText size={32} />
                  </div>
                  <div className='flex flex-col gap-1'>
                      <h3 className='text-xl font-bold text-white'>No tasks yet</h3>
                      <p className='text-sm text-gray-400'>Create your first task to share code snippets or text.</p>
                  </div>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeNest