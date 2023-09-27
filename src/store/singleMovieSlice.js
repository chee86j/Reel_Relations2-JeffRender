import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMovieById = createAsyncThunk(
  "singleMovie/fetchMovieById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits%2C%20images&language=en-US&api_key=8ef1c18c56bc6d0d2ff280c6fd0b854d`
      );
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const fetchMovieVideoById = createAsyncThunk(
  "singleMovie/fetchMovieVideoById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=8ef1c18c56bc6d0d2ff280c6fd0b854d`
      );
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

const singleMovieSlice = createSlice({
  name: "singleMovie",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMovieById.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(fetchMovieById.rejected, (state, action) => {
      // handle the rejected case and set the state
      return "Error occurred while fetching the movie";
    });
    builder.addCase(fetchMovieVideoById.fulfilled, (state, action) => {
      state.video = action.payload.results[0];
    });
  },
});

export default singleMovieSlice.reducer;
