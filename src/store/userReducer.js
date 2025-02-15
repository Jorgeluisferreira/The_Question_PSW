import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// URL do backend
const BASE_URL = "http://127.0.0.1:3004/users";

// Thunk para buscar os dados do backend
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
});

// Thunk para salvar novo usuário no backend
export const addUser = createAsyncThunk("users/addUser", async (user) => {
  const response = await axios.post(BASE_URL, user);
  return response.data;
});

// Thunk para verificar o login
export const loginUser = createAsyncThunk(
  "users/loginUser",
  async ({ email, senha }, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      const users = response.data;

      // Verifica se o usuário existe e a senha está correta
      const user = users.find((u) => u.email === email && u.senha === senha);
      if (!user) {
        throw new Error("E-mail ou senha inválidos.");
      }

      // Salva o usuário no localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));

      return user; // Retorna o usuário encontrado
    } catch (error) {
      return rejectWithValue(error.message); // Rejeita com a mensagem de erro
    }
  }
);

// Thunk para editar os dados do usuário
export const editUser = createAsyncThunk(
  "users/editUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/${userData.id}`, userData);
      const user = response.data;

      // Atualiza o usuário no localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));

      return user; // Retorna os dados atualizados
    } catch (error) {
      return rejectWithValue(error.message); // Rejeita com a mensagem de erro
    }
  }
);

export const logout = () => (dispatch) => {
  dispatch({
    type: "users/logout", // Dispara a ação de logout
  });
  localStorage.removeItem("currentUser"); // Remove o usuário do localStorage
};

// Slice de usuário
const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null, // Carrega do localStorage se existir
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null; // Limpa o estado do currentUser
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        localStorage.setItem("currentUser", JSON.stringify(action.payload)); // Salva o novo usuário no localStorage
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser = action.payload; // Define o usuário logado
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload; // Armazena o erro do login
      })
      .addCase(editUser.fulfilled, (state, action) => {
        // Verifica se o usuário editado é o mesmo que está logado
        if (state.currentUser && state.currentUser.id === action.payload.id) {
          state.currentUser = action.payload; // Atualiza o usuário logado
        }
        // Atualiza os dados do usuário na lista de usuários
        state.users = state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser)); // Atualiza no localStorage
      })
      .addCase(editUser.rejected, (state, action) => {
        state.error = action.payload; // Armazena o erro da edição
      });
  },
});

export default userSlice.reducer;
