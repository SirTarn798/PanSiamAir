import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UserSlice {
  id: string;
  email: string;
}

const initialState: UserSlice = {
  id: "",
  email: "",
};

const counterSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
});

export const { setId } = counterSlice.actions;
export default counterSlice.reducer;
