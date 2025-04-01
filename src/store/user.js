import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  usersList: [],
  status: "idle",
  error: null,
};

export const fetchAllUsers = createAsyncThunk("fetchAllUsers", async () => {
  try {
    const response = await axios.get(`/api/users`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const addUserProfile = createAsyncThunk(
  "addUserProfile",
  async (user, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/users", user);
      return data;
    } catch (err) {
      // Return the error message from the API
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      // If no specific error from API, return a generic message
      return rejectWithValue({ error: "Registration failed. Please try again." });
    }
  }
);

export const updateUser = createAsyncThunk(
  "updateUsers",
  async ({ data, id }) => {
    try {
      console.log(id);
      const response = await axios.put(`/api/users/${id}`, data);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.usersList = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      })
      .addCase(addUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.usersList.push(action.payload);
      })
      .addCase(addUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        return action.payload;
      });
  },
});

export default userSlice.reducer;
