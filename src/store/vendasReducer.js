import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:3004'; // Atualize com a URL do seu JSON Server

// Thunk para buscar planos
export const fetchVendas = createAsyncThunk("vendas/fetchVendas", async () => {
  const response = await axios.get(`${BASE_URL}/vendas`);
  return response.data;
});

export const subscribeBox = createAsyncThunk(
  "vendas/subscribeBox",
  async ({ userId, boxId }) => {
    const response = await axios.post(`${BASE_URL}/subscribe`, {
      userId,
      boxId,
    });
    return response.data;
  }
);


// Slice de planos
const vendasSlice = createSlice({
  name: "vendas",
  initialState: { vendas: [], vendasStatus: "idle", vendasError: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendas.fulfilled, (state, action) => {
        state.vendas = action.payload;
        state.vendasStatus = "succeeded";
      })
      .addCase(fetchVendas.pending, (state) => {
        state.vendasStatus = "loading";
      })
      .addCase(fetchVendas.rejected, (state, action) => {
        state.vendasStatus = "failed";
        state.vendasError = action.error.message;
      });
      
  },
});

export default vendasSlice.reducer;
