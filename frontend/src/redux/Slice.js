import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import snippetService from '../services/snippetService';
import toast from 'react-hot-toast';

const initialState = {
  codenest: [],
  loading: false,
  error: null,
};

// Async thunk to fetch snippets from backend
export const fetchUserSnippets = createAsyncThunk(
  'codenest/fetchUserSnippets',
  async (_, { rejectWithValue }) => {
    try {
      return await snippetService.fetchSnippets();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load snippets');
    }
  }
);

// Async thunk to add snippet to backend
export const addToCodeNestThunk = createAsyncThunk(
  'codenest/addToCodeNest',
  async (snippetData, { rejectWithValue }) => {
    try {
      const result = await snippetService.createSnippet(snippetData);
      toast.success("Snippet Created Successfully");
      return result;
    } catch (error) {
      toast.error(error.message || "Failed to create snippet");
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update snippet in backend
export const updateToCodeNestThunk = createAsyncThunk(
  'codenest/updateToCodeNest',
  async (snippetData, { rejectWithValue }) => {
    try {
      const result = await snippetService.updateSnippet(snippetData._id, snippetData);
      toast.success("Snippet Updated Successfully");
      return result;
    } catch (error) {
      toast.error(error.message || "Failed to update snippet");
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete snippet from backend
export const removeFromCodeNestThunk = createAsyncThunk(
  'codenest/removeFromCodeNest',
  async (codeId, { rejectWithValue }) => {
    try {
      await snippetService.deleteSnippet(codeId);
      toast.success("Snippet Deleted Successfully");
      return codeId;
    } catch (error) {
      toast.error(error.message || "Failed to delete snippet");
      return rejectWithValue(error.message);
    }
  }
);

export const codeNestSlice = createSlice({
  name: 'codenest',
  initialState,
  reducers: {
    resetAllCodeNest: (state) => {
      state.codenest = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUserSnippets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSnippets.fulfilled, (state, action) => {
        state.loading = false;
        state.codenest = action.payload;
      })
      .addCase(fetchUserSnippets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addToCodeNestThunk.fulfilled, (state, action) => {
        state.codenest.unshift(action.payload);
      })
      // Update
      .addCase(updateToCodeNestThunk.fulfilled, (state, action) => {
        const index = state.codenest.findIndex((item) => item._id === action.payload._id);
        if (index >= 0) {
          state.codenest[index] = action.payload;
        }
      })
      // Delete
      .addCase(removeFromCodeNestThunk.fulfilled, (state, action) => {
        state.codenest = state.codenest.filter((item) => item._id !== action.payload);
      });
  },
});

export const { resetAllCodeNest } = codeNestSlice.actions;

export default codeNestSlice.reducer;