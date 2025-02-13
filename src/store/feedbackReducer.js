import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:3004'; // Atualize com a URL do seu JSON Server

// Thunk para buscar caixas
export const fetchFeedbacks = createAsyncThunk("feedbacks/fetchFeedbacks", async () => {
  const response = await axios.get(`${BASE_URL}/feedback`);
  return response.data;
});

// Thunk para editar feedback
export const updateFeedback = createAsyncThunk(
  "feedbacks/updateFeedback",
  async ({ id, mensagem }) => {
    const response = await axios.put(`${BASE_URL}/feedback/${id}`, { mensagem });
    return response.data;
  }
);

export const deleteFeedback = createAsyncThunk(
  "feedbacks/deleteFeedback",
  async (id) => {
    await axios.delete(`${BASE_URL}/feedback/${id}`);
    return id;
  }
);



// Slice de caixas
const feedbackSlice = createSlice({
  name: "feedbacks",
  initialState: { feedbacks: [], feedbackStatus: "idle", feedbackError: null },
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
      })
      .addCase(updateFeedback.fulfilled, (state, action) => {
        const index = state.feedbacks.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.feedbacks[index] = action.payload;
        }
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.feedbacks = state.feedbacks.filter(f => f._id !== action.payload);
      });
  },
});

export default feedbackSlice.reducer;

