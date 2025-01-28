import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:3004'; // Atualize com a URL do seu JSON Server

// Thunk para buscar caixas
export const fetchBoxes = createAsyncThunk("boxes/fetchBoxes", async () => {
  const response = await axios.get(`${BASE_URL}/boxes`);
  return response.data;
});

// Slice de caixas
const boxesSlice = createSlice({
  name: "boxes",
  initialState: {boxes: [], boxStatus: "idle", boxError: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoxes.fulfilled, (state, action) => {
        state.boxes = action.payload;
        state.boxStatus = "succeeded";
      })
      .addCase(fetchBoxes.pending, (state) => {
        state.boxStatus = "loading";
      })
      .addCase(fetchBoxes.rejected, (state, action) => {
        state.boxStatus = "failed";
        state.boxError = action.error.message;
      });
  },
});

export default boxesSlice.reducer;
