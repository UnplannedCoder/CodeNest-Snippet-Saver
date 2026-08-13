import React, { useState } from 'react'
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

const CodeNest = ({ isDarkMode }) => {
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
    <div className={`flex flex-col items-center w-full px-6 py-6 grow transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className='flex flex-col gap-6 w-full max-w-6xl mx-auto grow'>
        
        {/* Search Bar */}
        <div className='relative w-full flex items-center'>
            <Search className='absolute left-4 text-gray-400' size={20} />
            <input 
            className={`border p-3.5 pl-12 rounded-2xl w-full outline-none text-lg font-semibold shadow-sm transition-colors duration-300 ${
                isDarkMode 
                    ? 'border-gray-800 bg-black text-white placeholder-gray-500' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
            }`}
            type="search" 
            placeholder='Search question here...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>

        {/* Outer Container */}
        <div className={`border p-6 rounded-2xl w-full flex flex-col gap-6 shadow-xl transition-colors duration-300 ${
            isDarkMode ? 'border-gray-800 bg-black text-white' : 'border-gray-300 bg-white text-gray-900'
        }`}>
          <div className='flex flex-col gap-1'>
              <h2 className='text-3xl font-bold tracking-wide'>All Tasks</h2>
              {filteredData.length === 0 && (
                  <p className='text-sm text-gray-400'>Create your first task to get started</p>
              )}
          </div>

          {filteredData.length > 0 ? (
              <div className='flex flex-col gap-5'>
                  {filteredData.map((task, index) => {
                      const contentType = analyzeContentType(task.content);

                      return (
                          <div key={task.id || index} className={`border p-5 rounded-2xl flex justify-between items-start shadow-sm transition-colors duration-300 ${
                              isDarkMode ? 'border-gray-800 bg-black' : 'border-gray-200 bg-gray-50'
                          }`}>
                              
                              {/* Left Side: Title and Content */}
                              <div className='flex flex-col gap-2 max-w-[70%]'>
                                  <div className='font-bold text-2xl'>
                                      {task.title}
                                  </div>
                                  <div className={`text-lg wrap-break-words line-clamp-3 font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                      {task.content}
                                  </div>
                              </div>

                              {/* Right Side: Icons, Date, Badge */}
                              <div className='flex flex-col items-end gap-2'>
                                  <div className='flex flex-row gap-1.5 items-center'>
                                      {[
                                          { icon: <Edit size={21} />, title: 'Edit', onClick: () => navigate(`/?codeId=${task._id}`) },
                                          { icon: <Trash2 size={21} />, title: 'Delete', onClick: () => handleDelete(task._id) },
                                          { icon: <Share2 size={21} />, title: 'Share', onClick: () => setShareId(shareId === task._id ? null : task._id) },
                                          { icon: <Eye size={21} />, title: 'View', onClick: () => navigate(`/codenest/${task._id}`) },
                                          { icon: <Copy size={21} />, title: 'Copy', onClick: () => { navigator.clipboard.writeText(task.content); toast.success("Copied to Clipboard"); } }
                                      ].map((btn, i) => (
                                          <button 
                                              key={i}
                                              className={`p-2.5 border rounded-xl transition ${
                                                  isDarkMode 
                                                      ? 'border-gray-800 bg-black text-gray-50 hover:bg-gray-900 hover:text-white' 
                                                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-black'
                                              }`} 
                                              onClick={btn.onClick} 
                                              title={btn.title}>
                                              {btn.icon}
                                          </button>
                                      ))}
                                  </div>

                                  {/* Date Section */}
                                  <div className={`text-base flex items-center gap-1.5 mt-1 font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
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
                                      <div className={`flex justify-center gap-2 mt-2 p-2 rounded-xl border ${
                                          isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-300'
                                      }`}>
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
              <div className={`border border-dashed rounded-2xl p-16 flex flex-col items-center justify-center gap-4 my-2 text-center ${
                  isDarkMode ? 'border-gray-800 bg-black/40 text-white' : 'border-gray-300 bg-gray-50 text-gray-900'
              }`}>
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-300' : 'bg-white border-gray-300 text-gray-700'}`}>
                      <FileText size={32} />
                  </div>
                  <div className='flex flex-col gap-1'>
                      <h3 className='text-xl font-bold'>No tasks yet</h3>
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