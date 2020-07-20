import { createSlice } from "@reduxjs/toolkit";

const callSlice = createSlice({
  name: "call",
  initialState: {
    caller: {},
    listener: {},
    status: null,
    peerId: "",
    localStream: null,
    remoteStream: null,
    iceServer: null,
    peer: null,
    audioInput: undefined,
    videoInput: undefined,
    audioOutput: undefined,
  },
  reducers: {
    // setInitLoading: (state, action) => {
    //   state.init = action.payload;
    // },
  },
  extraReducers: {},
});

export const { actions, reducer } = callSlice;
export default reducer;
