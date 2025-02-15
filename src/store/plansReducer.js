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

export const editPlan = createAsyncThunk("plans/editPlan", async (plan) => {
  const response = await axios.put(`${BASE_URL}/plans/${plan.id}`, plan);
  return response.data;
});

export const deletePlan = createAsyncThunk(
  "plans/deletePlan",
  async (planId, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/plans/${planId}`);
      console.log(`Plano ${planId} deletado do DB`);

      // Recarrega os planos após a exclusão
      dispatch(fetchPlans());
      return planId;
    } catch (error) {
      console.error("Erro ao deletar o plano:", error.message);
      return rejectWithValue("Erro ao deletar o plano");
    }
  }
);

// Thunk para associação de plano
export const associarPlanoAoUsuario = createAsyncThunk(
  "plans/associarPlano",
  async ({ userId, planoId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/plans/subscribe`, { userId, planoId });
      return response.data.user.assinatura;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao assinar plano');
    }
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
      })
      .addCase(editPlan.fulfilled, (state, action) => {
        // Atualiza localmente o plano na lista para evitar duplicação
        state.plans = state.plans.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(editPlan.rejected, (state, action) => {
        state.PlanStatus = "failed";
        state.error = action.payload || action.error.message;
        console.log(state.error);
      }) .addCase(deletePlan.fulfilled, (state, action) => {
        state.plans = state.plans.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.PlanStatus = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default plansSlice.reducer;

