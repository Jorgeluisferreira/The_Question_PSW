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
  const response = await axios.post(`${BASE_URL}/register`, user);
  return response.data;
});

// Thunk para verificar o login usando POST
export const loginUser = createAsyncThunk(
  "users/loginUser",
  async ({ email, senha }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, senha });

      if (response.status !== 200) {
        throw new Error(response.data.error || "E-mail ou senha inválidos.");
      }

      const user = response.data;
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
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

      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Ação síncrona para logout
export const logout = () => (dispatch) => {
  dispatch(userSlice.actions.logout());
  localStorage.removeItem("currentUser");
};

// Slice de usuário
const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
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
        localStorage.setItem("currentUser", JSON.stringify(action.payload));
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        if (state.currentUser && state.currentUser.id === action.payload.id) {
          state.currentUser = action.payload;
        }
        state.users = state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
      })
      .addCase(editUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
