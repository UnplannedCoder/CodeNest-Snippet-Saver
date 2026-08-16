import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { addToCodeNestThunk, updateToCodeNestThunk } from '../redux/Slice';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const Home = ({ isDarkMode }) => {
    const [title, setTitle] = useState('');
    const [value, setValue] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const codeId = searchParams.get("codeId");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const allSnippets = useSelector((state) => state.codenest.codenest);

    useEffect(() => {
        if(codeId) {
           const snippet = allSnippets.find((item) => item._id === codeId);
           if(snippet) {
               setTitle(snippet.title);
               setValue(snippet.content);
           }
        } else {
            // Reset fields when there is no codeId (e.g. clicking Home)
            setTitle('');
            setValue('');
        }
    }, [codeId, allSnippets])

    async function createSnippet(){
        if (!value.trim()) {
            toast.error("Please enter snippet content!");
            return;
        }

        const snippet = {
            title: title || "Untitled",
            content: value,
        }        

        if (codeId){
            await dispatch(updateToCodeNestThunk({ ...snippet, _id: codeId }));
        }
        else {
            await dispatch(addToCodeNestThunk(snippet));
        }

        setTitle('');
        setValue('');
        setSearchParams('');
        navigate('/codenest');
    }


  return (
    <div className='flex flex-col items-center w-full px-3 sm:px-4 md:px-6 pt-3 sm:pt-5 pb-6 sm:pb-8 flex-1 min-h-0'>
        <div className='flex flex-col gap-3 sm:gap-5 w-full max-w-3xl mx-auto flex-1 min-h-0'>
            
            {/* Top Control Bar */}
            <div className='flex flex-col gap-3 sm:flex-row sm:gap-4 justify-between w-full items-stretch sm:items-center shrink-0'>
                <input 
                className={`border-2 p-3 px-4 rounded-2xl w-full outline-none text-base sm:text-lg font-semibold shadow-sm transition-colors duration-300 ${
                    isDarkMode 
                        ? 'border-gray-800 bg-black text-gray-300 placeholder-gray-600' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                }`}
                type="text"
                placeholder='Enter Title Here'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />

                <button onClick={createSnippet}
                className={`border-2 px-5 sm:px-8 py-3 rounded-2xl font-semibold transition whitespace-nowrap shadow-sm w-full sm:w-auto ${
                    isDarkMode 
                        ? 'border-gray-800 bg-black text-gray-300 hover:bg-white hover:text-black' 
                        : 'border-gray-300 bg-white text-gray-800 hover:bg-black hover:text-white'
                }`}>
                    {codeId ? "Update Snippet" : "Create Snippet"}
                </button>
            </div>

            {/* Window Container */}
            <div className={`border-2 rounded-2xl w-full flex flex-col flex-1 min-h-[380px] sm:min-h-[480px] md:min-h-[540px] shadow-xl overflow-hidden transition-colors duration-300 ${
                isDarkMode ? 'border-gray-800 bg-black text-white' : 'border-gray-300 bg-white text-gray-900'
            }`}>
                
                <div className={`flex justify-between items-center px-3 sm:px-4 py-3 border-b shrink-0 transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-300'
                }`}>
                    <div className='flex items-center gap-2'>
                        <div className='w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-red-500'></div>
                        <div className='w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-yellow-500'></div>
                        <div className='w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-green-500'></div>
                    </div>

                    <button 
                        type="button"
                        onClick={() => {
                            navigator.clipboard.writeText(value);
                            toast.success("Copied to Clipboard");
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm sm:text-base font-medium transition ${
                            isDarkMode 
                                ? 'border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800 hover:text-white' 
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-200 hover:text-black'
                        }`}
                        title='Copy Content'
                    >
                        <Copy size={18} />
                        <span>Copy</span>
                    </button>
                </div>

                <div className={`p-2 flex flex-col flex-1 min-h-0 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
                    <textarea
                    className={`home-textarea w-full flex-1 min-h-[300px] sm:min-h-[400px] outline-none p-3 sm:p-4 font-mono text-sm sm:text-base md:text-lg resize-none overflow-y-auto transition-colors duration-300 ${
                        isDarkMode ? 'bg-black text-gray-200' : 'bg-white text-gray-800'
                    }`} 
                    value={value}
                    placeholder='Enter Your Content / Code here...'
                    onChange={(e) => setValue(e.target.value)}
                    />
                </div>

            </div>
        </div>
    </div>
  )

}

export default Home