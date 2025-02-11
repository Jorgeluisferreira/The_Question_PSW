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
/* 
export const associarPlanoAoUsuario = createAsyncThunk(
  "plans/associarPlanoAoUsuario", 
  async ({ userId, planoId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/users/associar-plano/${userId}`, { assinatura: planoId });
      return response.data; // Retorna a resposta do backend com o usuário atualizado
    } catch (error) {
      console.error('Erro ao associar plano ao usuário:', error);
      return rejectWithValue(error.response ? error.response.data : 'Erro desconhecido ao associar plano');
    }
  }
);
*/

export const subscribePlan = createAsyncThunk(
  "plans/subscribePlan",
  async ({ userId, planId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/subscribe`, { userId, planId });
      return response.data; // Retorna a assinatura criada
    } catch (error) {
      console.error('Erro ao assinar plano:', error);
      return rejectWithValue(error.response ? error.response.data : 'Erro ao assinar plano');
    }
  }
);


export const associarPlanoAoUsuario = createAsyncThunk(
  "plans/associarPlanoAoUsuario", 
  async ({ userId, planoId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/associar-plano/${userId}`, { planId: planoId });
      return response.data; // Retorna a resposta do backend com o usuário atualizado
    } catch (error) {
      console.error('Erro ao associar plano ao usuário:', error);
      return rejectWithValue(error.response ? error.response.data : 'Erro desconhecido ao associar plano');
    }
  }
);

// Exemplo de deletePlan
export const deletePlan = createAsyncThunk('plans/deletePlan', async (planId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${BASE_URL}/plans/${planId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir o plano:', error);
    return rejectWithValue('Erro ao excluir o plano');
  }
});

// Exemplo de editPlan
export const editPlan = createAsyncThunk('plans/editPlan', async ({ planId, planData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}/plans/${planId}`, planData);
    return response.data;
  } catch (error) {
    console.error('Erro ao editar o plano:', error);
    return rejectWithValue('Erro ao editar o plano');
  }
});


// Rota para associar um plano ao usuário


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
      })
      .addCase(subscribePlan.rejected, (state, action) => {
        state.PlanStatus = "failed";
        state.error = action.payload || action.error.message;
        console.log(state.error);
      });
  builder
      .addCase(createPlan.rejected, (state, action) => {
        state.PlanStatus = "failed";
        state.error = action.payload || action.error.message;
        console.log(state.error);
      })
      .addCase(associarPlanoAoUsuario.rejected, (state, action) => {
        state.PlanStatus = "failed";
        state.error = action.payload || action.error.message;
        console.log(state.error);
      });
  },
});

export default plansSlice.reducer;


