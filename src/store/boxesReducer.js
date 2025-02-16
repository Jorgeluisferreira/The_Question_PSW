import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:3004'; // Atualize com a URL do seu JSON Server

// Thunk para buscar caixas
export const fetchBoxes = createAsyncThunk("boxes/fetchBoxes", async () => {
  const response = await axios.get(`${BASE_URL}/boxes`);
  return response.data;
});

export const createBox = createAsyncThunk("boxes/createBox", async (boxData) => {
  const response = await axios.post(`${BASE_URL}/boxes`, boxData);
  return response.data;  // Retorna a box criada (ou qualquer dado relevante)
});

// Atualizar caixa
export const updateBox = createAsyncThunk("boxes/updateBox", async ({ id, data }) => {
  const response = await axios.put(`${BASE_URL}/boxes/${id}`, data);
  return response.data; // Retorna a caixa atualizada
});

// Deletar caixa
export const deleteBox = createAsyncThunk("boxes/deleteBox", async (id) => {
  await axios.delete(`${BASE_URL}/boxes/${id}`);
  return id; // Retorna o id da caixa deletada
});


// Slice de caixas
const boxesSlice = createSlice({
  name: "boxes",
  initialState: {boxes: [], boxStatus: "idle", boxError: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchBoxes.fulfilled, (state, action) => {
      state.boxes = action.payload
      state.boxStatus = "succeeded";
    })
    .addCase(fetchBoxes.pending, (state) => {
      state.boxStatus = "loading";
    })
    .addCase(fetchBoxes.rejected, (state, action) => {
      state.boxStatus = "failed";
      state.boxError = action.error.message;
    })
    .addCase(createBox.fulfilled, (state, action) => {
      state.boxes.push(action.payload); // Adiciona a caixa nova
    })
    .addCase(updateBox.fulfilled, (state, action) => {
      const index = state.boxes.findIndex(box => box._id === action.payload._id);
      if (index !== -1) {
        state.boxes[index] = action.payload; // Atualiza a caixa
      }
    })
    .addCase(deleteBox.fulfilled, (state, action) => {
      state.boxes = state.boxes.filter(box => box._id !== action.payload); // Remove a caixa deletada
    })
  },
}) ;

export default boxesSlice.reducer;
