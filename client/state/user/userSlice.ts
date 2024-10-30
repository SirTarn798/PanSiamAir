import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UserSlice {
  id: string;
  name: string;
  image: string;
}

const initialState: UserSlice = {
  id: "",
  name: "",
  image:"",
};

const counterSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setImage: (state, action: PayloadAction<string>) => {
      state.image = action.payload;
    },
  },
});

export const { setId, setName, setImage } = counterSlice.actions;
export default counterSlice.reducer;
