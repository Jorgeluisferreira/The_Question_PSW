import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:3004"; // Atualize com a URL do backend

// **Thunk** para buscar sugestões do backend
export const fetchSuggestions = createAsyncThunk("suggestions/fetchSuggestions", async () => {
  try {
    const response = await axios.get(`${BASE_URL}/suggestions`);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao buscar sugestões: " + (error.response?.data?.error || error.message));
  }
});

// **Thunk** para adicionar uma nova sugestão**
export const addSuggestion = createAsyncThunk(
  "suggestions/addSuggestion",
  async ({ nome, mensagem }) => {  // Alterado de { userId, mensagem } para { nome, mensagem }
    try {
      const response = await axios.post(`${BASE_URL}/suggestions`, { nome, mensagem });
      return response.data; // Retorna a sugestão salva no backend
    } catch (error) {
      throw new Error("Erro ao adicionar sugestão: " + (error.response?.data?.error || error.message));
    }
  }
);

// **Thunk** para atualizar uma sugestão
export const updateSuggestion = createAsyncThunk(
  "suggestions/updateSuggestion",
  async ({ id, mensagem }) => {
    try {
      const response = await axios.put(`${BASE_URL}/suggestions/${id}`, { mensagem });
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar sugestão: " + (error.response?.data?.error || error.message));
    }
  }
);

// **Thunk** para excluir uma sugestão
export const deleteSuggestion = createAsyncThunk(
  "suggestions/deleteSuggestion",
  async (id) => {
    try {
      await axios.delete(`${BASE_URL}/suggestions/${id}`);
      return id; // Retornamos o ID para remover localmente do Redux
    } catch (error) {
      throw new Error("Erro ao excluir sugestão: " + (error.response?.data?.error || error.message));
    }
  }
);      

// **Slice** para gerenciar o estado de sugestões
const suggestionSlice = createSlice({
  name: "suggestions",
  initialState: {
    suggestions: [], // Lista de sugestões
    suggestionStatus: "idle", // Status (idle, loading, succeeded, failed)
    suggestionError: null, // Mensagem de erro, caso ocorra
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // **Fetch Suggestions**: Atualiza o estado quando as sugestões são carregadas
      .addCase(fetchSuggestions.pending, (state) => {
        state.suggestionStatus = "loading";
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
        state.suggestionStatus = "succeeded";
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.suggestionStatus = "failed";
        state.suggestionError = action.error.message;
      })

      // **Add Suggestion**: Atualiza o estado ao adicionar uma nova sugestão
      .addCase(addSuggestion.pending, (state) => {
        state.suggestionStatus = "loading";
      })
      .addCase(addSuggestion.fulfilled, (state, action) => {
        state.suggestions.push(action.payload); // Adiciona localmente a nova sugestão
        state.suggestionStatus = "succeeded";
      })
      .addCase(addSuggestion.rejected, (state, action) => {
        state.suggestionStatus = "failed";
        state.suggestionError = action.error.message;
      })
      .addCase(updateSuggestion.fulfilled, (state, action) => {
        const index = state.suggestions.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.suggestions[index] = action.payload;
        }
      })
      .addCase(deleteSuggestion.fulfilled, (state, action) => {
        state.suggestions = state.suggestions.filter(s => s._id !== action.payload);
      });
  },
});

// Exporta o reducer para ser adicionado na store
export default suggestionSlice.reducer;
