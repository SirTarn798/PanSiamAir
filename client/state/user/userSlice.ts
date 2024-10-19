import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UserSlice {
  id: string;
  name: string;
}

const initialState: UserSlice = {
  id: "",
  name: "",
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
  },
});

export const { setId, setName } = counterSlice.actions;
export default counterSlice.reducer;
