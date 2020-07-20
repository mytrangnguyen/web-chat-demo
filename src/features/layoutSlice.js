import { createSlice } from "@reduxjs/toolkit";

export const doWindowResize = (windowWidth) =>{
  return (dispatch) => {

  }
}

const layoutSlice = createSlice({
    name: "layout",
    initialState: {
        leftSidebarVisible: true,
        rightSidebarVisible: false,
        windowWidth: 0,
        isMobileDevice: true,
        settings:{
            sound: true
        }
    },
    reducers: {
      setWindowSize: (state, action) => {
        state.init = action.payload;
      },
    },
    extraReducers: {
     
    }
  });
  
  export const { actions, reducer } = layoutSlice;
  export default reducer;
  