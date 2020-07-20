import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {uniqBy} from 'lodash'
import { database, db } from "../services/firebase";
import { act } from "@testing-library/react";

const ref = database.ref("general/");
export const getGeneralMessage = createAsyncThunk("general/", async () => {
  try {
    const message = [];
    await ref.once("value").then((snap) => {
      snap.forEach((data) => {
        let mess = data.val();
        message.push(mess);
      });
    });
    console.log("general mess", message);
    return message;

  } catch (ex) {
    console.log(ex);
  }
});

export const getPrivateMessage = createAsyncThunk(
  "privateChat/",
  async (data) => {
    try {
      const ref = database.ref(`messages/${data.senderId}-${data.receiverId}/`);
      let responseData = [];
      const snapshot = await ref.once("value");
      console.log("get message,", snapshot);
      snapshot.forEach((data) => {
        console.log("mes dataa", data.val());
        responseData.push(data.val());
      });
      console.log("responseData", responseData);
      return responseData;
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const loadPrivateMessage = (data) => {
  return (dispatch) => {
    database
      .ref(`messages/${data.senderId}-${data.receiverId}/`)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          const ref = database.ref(
            `messages/${data.senderId}-${data.receiverId}/`
          );
          ref.on("child_added", (snapshot) => {
            dispatch(
              actions.addMessage({
                chatId: `${data.senderId}-${data.receiverId}`,
                messages: snapshot.val(),
              })
            );
          });
        }
      });
    database
      .ref(`messages/${data.receiverId}-${data.senderId}/`)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          const ref = database.ref(
            `messages/${data.receiverId}-${data.senderId}/`
          );
          ref.on("child_added", (snapshot) => {
            dispatch(
              actions.addMessage({
                chatId: `${data.senderId}-${data.receiverId}`,
                messages: snapshot.val(),
              })
            );
          });
        }
      });
  };
};

export const loadGeneralMessage = (senderId) => {
  return (dispatch) => {
    const ref = database.ref("general/");
    ref.on("child_added", (snapshot) => {
      dispatch(actions.addGeneralMessage({
        chatId: senderId,
        message: snapshot.val()
      }));
    });
  };
};

const messageSlice = createSlice({
  name: "message",
  initialState: {
    isLoading: false,
    initLoading: true,
    messageListLoading: true,
    hasMoreMessageList: true,
    sending: false,
    scrollToBottom: false,
    findLoading: false,
    hasMoreConversation: true,
    getImageListLoading: false,
    getFileListLoading: false,
    error: null,
    record: {
      // khởi tạo giá trị ban đầu đối tượng
      messages: "",
      receiver: {},
      conversationType: "",
    },
    receiver: {},
    messages: [],
    
    inputMesage: {
      images: [],
      text: "",
      files: [],
    },
    typing: {},
    imageList: [],
    fileList: [],
    chatData: {},
    generalMessage: {},
  },

  reducers: {
    doFind: (state, action) => {
      state.record = action.payload;
    },
    doSetReciver: (state, action) => {
      state.receiver = action.payload;
    },
    doChangeMessage: (state, action) => {
      state.inputMesage.text = action.payload;
    },
    addMessage: (state, action) => {
      // state.messages = [...state.messages, action.payload];
      state.chatData = {
        [action.payload.chatId]: uniqBy([
          ...(state.chatData[action.payload.chatId] || []),
          action.payload.messages,
        ], item => item.timestamp),
      };
      console.log("check state priavte mess", state.chatData);
    },
    addGeneralMessage: (state, action) => {
      state.generalMessage = {
        [action.payload.chatId]: uniqBy([
          ...(state.generalMessage[action.payload.chatId] || []),
          action.payload.message,
        ], item => item.timestamp),
      };
      console.log("check state general mess", state.generalMessage);
    },
  },
  extraReducers: {
    [getPrivateMessage.pending]: (state, action) => {
      if (state.isLoading === false) {
        state.isLoading = true;
      }
    },
    [getPrivateMessage.fulfilled]: (state, action) => {
      if (state.isLoading === true) {
        action.payload.sort((a, b) => {
          return a.timestamp - b.timestamp;
        });
        console.log("check state mess", action.payload);
        state.messages = action.payload;
      }
    },
    [getPrivateMessage.rejected]: (state, action) => {
      if (state.isLoading === true) {
        state.isLoading = false;
        state.error = action.payload;
      }
    },
  },
});

export const { actions, reducer } = messageSlice;
export default reducer;
