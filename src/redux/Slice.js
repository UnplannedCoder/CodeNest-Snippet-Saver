import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';

const initialState = {
  codenest:localStorage.getItem("codenest")
    ? JSON.parse(localStorage.getItem("codenest"))
    : []
}

export const codeNestSlice = createSlice({
  name: 'codenest',
  initialState,
  reducers: {
    addToCodeNest: (state,action) => {
        const task = action.payload;
        const isDuplicate = state.codenest.some((item) => item.title === task.title || item.content === task.content);
        if (isDuplicate) {
            toast.error("Task with same title already exists!");
        }
        else {
            state.codenest.push(task);
            localStorage.setItem("codenest",JSON.stringify(state.codenest));
            toast.success("Task Created Successfully");
        }
        
    },
    updateToCodeNest: (state,action) => {
        const task = action.payload;
        const index = state.codenest.findIndex((item) => item._id === task._id);
        if (index>=0){
            state.codenest[index]=task
            localStorage.setItem("codenest",JSON.stringify(state.codenest));
            toast.success("Task Updated Successfully")
        }
    },
    resetAllCodeNest: (state, action) => {
        state.codenest = [];
        localStorage.removeItem("codenest");
    },
    removeFromCodeNest: (state, action) => {
        const codeId = action.payload;
        console.log(codeId);
        const index = state.codenest.findIndex((item) => item._id === codeId);
        if (index>=0){
            state.codenest.splice(index,1);
            localStorage.setItem("codenest",JSON.stringify(state.codenest));
            toast.success("Task Deleted Successfully")
        }
    }
  },
})

// Action creators are generated for each case reducer function
export const { addToCodeNest, updateToCodeNest, resetAllCodeNest, removeFromCodeNest } = codeNestSlice.actions

export default codeNestSlice.reducer