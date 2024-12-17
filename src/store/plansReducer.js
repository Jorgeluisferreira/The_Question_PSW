import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const fetchPlans = createAsyncThunk("plans/fetchPlans", async () => {
  const response = await axios.get(`${BASE_URL}/planos`);
  return response.data;
});

export const createPlan = createAsyncThunk('plans/createPlan', async (plan, { dispatch, rejectWithValue }) => {
  try {
    console.log('Plano enviado ao backend:', plan);
    const { data } = await axios.post(`${BASE_URL}/planos`, plan);
    console.log('Plano adicionado ao DB:', data);

    // Recarrega os planos após criar um plano
    dispatch(fetchPlans());
    return data;
  } catch (error) {
    console.error('Erro ao criar o plano:', error.message);
    return rejectWithValue('Erro ao criar o plano');
  }
});


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
        state.PlanStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export default plansSlice.reducer;


