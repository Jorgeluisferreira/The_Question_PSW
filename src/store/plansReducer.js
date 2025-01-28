import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:3004'; // Atualize com a URL do seu JSON Server

// Thunk para buscar planos
export const fetchPlans = createAsyncThunk("plans/fetchPlans", async () => {
  const response = await axios.get(`${BASE_URL}/plans`);
  return response.data;
  });

// Slice de planos
const plansSlice = createSlice({
  name: "plans",
  initialState: { plans: [], PlanStatus: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.plans = action.payload;
        state.PlanStatus = "succeeded";
      })
      .addCase(fetchPlans.pending, (state) => {
        state.PlanStatus = "loading";
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        console.log(state.error)
      });
      
  },
});

export default plansSlice.reducer;
