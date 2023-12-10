// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
   User : null ,
   token : null
};

// ==============================|| SLICE - MENU ||============================== //

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
     logIn(state , action  ){
      state.User = action.payload
      state.token = action.payload.token
     }    
  }
});

export default user.reducer;

export const { logIn } = user.actions;
