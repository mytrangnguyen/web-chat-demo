import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../services/firebase";
import { useDispatch, useSelector } from "react-redux";
import selectorsUser from "../containers/UserPage/selectors";

export const doAddContact = (userInfo) => {
  console.log("user Info reducer", userInfo);
  return (dispatch) => {
    dispatch(actionsr.doCreateContact({ ...userInfo, type: "requestSent" }));
  };
};

const ref = db.collection("manageRequestAddContact");
export const manageAddFr = createAsyncThunk("requests", async () => {
  try {
    const userLoginLocalStorage = JSON.parse(localStorage.getItem("userLogin"));
    const listRequest = [];
    const snapshot = await ref.get();
    snapshot.forEach((doc) => {
      // console.log("doc.data().id", doc.data());
      // console.log("userLoginLocalStorage.id", userLoginLocalStorage.id);
      if (doc.data().receiverID === userLoginLocalStorage.id) {
        listRequest.push(doc.data());
      }
    });
    return listRequest;
  } catch (ex) {
    console.log(ex);
  }
});

const contactSlice = createSlice({
  name: "layout",
  initialState: {
    initLoading: true,
    dataLoading: false,
    findLoading: false,
    saveLoading: false,
    destroyLoading: false,
    exportLoading: false,
    error: null,
    redirectTo: "/contact",
    selectedRowKeys: [],
    selectedRows: [],
    record: null,
    contactLoading: false,
    requestLoading: false,
    requestSentLoading: false,
    contacts: [],
    requests: [],
    requestsSent: [],
  },
  reducers: {
    doCreateContact: (state, action) => {
      state.saveLoading = false;
    },
    doDeleteFriend: (state, action) => {
      ref.on("child_removed", (snapshot) => {
        var arrAfterRemove = state.requests.filter(
          (item) => item.id !== action.payload.id
        );
        state.requests = arrAfterRemove;
      });
      
    }
  },
  extraReducers: {
    [manageAddFr.pending]: (state, action) => {
      state.requestLoading = true;
    },
    [manageAddFr.fulfilled]: (state, action) => {
      // console.log("manage Fr", action.payload);
      state.requestLoading = false;
      state.requests = action.payload;
    },
    [manageAddFr.error]: (state, action) => {
      state.requestLoading = false;
    },
  },
});

export const { actionsr, reducer } = contactSlice;
export default reducer;
