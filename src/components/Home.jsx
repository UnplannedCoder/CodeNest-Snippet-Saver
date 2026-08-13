import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { addToCodeNest, updateToCodeNest } from '../redux/Slice';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
    const [title, setTitle] = useState('');
    const [value, setValue] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const codeId = searchParams.get("codeId");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const allTasks = useSelector((state) => state.codenest.codenest);

    useEffect(() => {
        if(codeId) {
           const task = allTasks.find((item) => item._id === codeId);
           if(task) {
               setTitle(task.title);
               setValue(task.content);
           }
        }
    }, [codeId, allTasks])

    function createTask(){
        const task = {
            title: title || "Untitled",
            content: value,
            _id: codeId || Date.now().toString(30),
            createdAt: new Date().toISOString(),
        }        

        if (codeId){
            dispatch(updateToCodeNest(task));
        }
        else {
            dispatch(addToCodeNest(task));
        }

        setTitle('');
        setValue('');
        setSearchParams('');
        navigate('/codenest');
    }

  return (
    <div className='flex flex-col items-center w-full px-6 py-6 grow'>
        <div className='flex flex-col gap-6 w-full max-w-6xl mx-auto grow'>
            
            {/* Top Control Bar */}
            <div className='flex flex-row gap-4 justify-between w-full items-center'>
                <input 
                className='border-2 p-3 px-4 rounded-2xl w-full outline-none text-lg font-semibold border-gray-800 bg-black text-gray-300 shadow-sm'
                type="text"
                placeholder='Enter Title Here'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />

                <button onClick={createTask}
                className='border-2 px-8 py-3.5 rounded-2xl font-semibold hover:bg-white hover:text-black  transition whitespace-nowrap border-gray-800 bg-black text-gray-300 shadow-sm'>
                    {codeId ? "Update Task" : "Create Task"}
                </button>
            </div>

            {/* Mac-Style Window Container */}
            <div className='border-2 rounded-2xl w-full flex flex-col grow overflow-hidden shadow-xl bg-black text-white'>
                
                <div className='flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-gray-800'>
                    <div className='flex items-center gap-2'>
                        <div className='w-3.5 h-3.5 rounded-full bg-red-500'></div>
                        <div className='w-3.5 h-3.5 rounded-full bg-yellow-500'></div>
                        <div className='w-3.5 h-3.5 rounded-full bg-green-500'></div>
                    </div>

                    <button 
                        type="button"
                        onClick={() => {
                            navigator.clipboard.writeText(value);
                            toast.success("Copied to Clipboard");
                        }}
                        className='flex items-center gap-1.5 px-3 py-1.5 border border-gray-700 rounded-lg text-lg font-medium hover:bg-gray-800 hover:text-white transition bg-gray-900'
                        title='Copy Content'
                    >
                        <Copy size={20} />
                        <span>Copy</span>
                    </button>
                </div>

                <div className='p-2 bg-black flex flex-col grow'>
                    <textarea
                    className='w-full bg-black text-gray-200 outline-none p-4 font-mono text-xl resize-y min-h-[65vh] grow' 
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