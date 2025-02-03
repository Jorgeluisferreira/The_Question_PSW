import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const BASE_URL = 'http://127.0.0.1:3004'; // Atualize com a URL do seu JSON Server


export const fetchPlans = createAsyncThunk("plans/fetchPlans", async () => {
  const response = await axios.get(`${BASE_URL}/plans`);
  return response.data;
  });

export const createPlan = createAsyncThunk('plans/createPlan', async (plan, { dispatch, rejectWithValue }) => {
  try {
    console.log('Plano enviado ao backend:', plan);
    const { data } = await axios.post(`${BASE_URL}/plans`, plan);
    console.log('Plano adicionado ao DB:', data);
    // Recarrega os planos após criar um plano
    dispatch(fetchPlans());
    return data;
  } catch (error) {
    console.error('Erro ao criar o plano:', error.message);
    return rejectWithValue('Erro ao criar o plano');
  }
});

// Thunk para associar o plano ao usuário
export const associarPlanoAoUsuario = createAsyncThunk(
  "plans/associarPlanoAoUsuario", 
  async ({ userId, planoId }) => {
    const response = await axios.post(`${BASE_URL}/associarPlano/${userId}`, { planoId });
    return response.data;
  }
);


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
        console.log(state.error)
      });
  builder
      .addCase(createPlan.rejected, (state, action) => {
        state.planStatus = "failed";
        state.error = action.payload || action.error.message;
        console.log(state.error);
      })
      .addCase(associarPlanoAoUsuario.rejected, (state, action) => {
        state.planStatus = "failed";
        state.error = action.payload || action.error.message;
        console.log(state.error);
      });
  },
});

export default plansSlice.reducer;


