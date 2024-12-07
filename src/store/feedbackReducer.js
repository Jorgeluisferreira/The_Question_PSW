import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:3001'; // Atualize com a URL do seu JSON Server

// Thunk para buscar caixas
export const fetchFeedbacks = createAsyncThunk("feedbacks/fetchFeedbacks", async () => {
  const response = await axios.get(`${BASE_URL}/feedbacks`);
  return response.data;
});

// Slice de caixas
const feedbackSlice = createSlice({
  name: "feedbacks",
  initialState: {feedbacks: [], feedbackStatus: "idle", feedbackError: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.feedbacks = action.payload;
        state.feedbackStatus = "succeeded";
      })
      .addCase(fetchFeedbacks.pending, (state) => {
        state.feedbackStatus = "loading";
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.feedbackStatus = "failed";
        state.feedbackError = action.error.message;
      });
  },
});

export default feedbackSlice.reducer;
