import React, { useState, useRef, useEffect } from "react";
import { Upload, Button, Input, Popover } from "antd";
import { Image, Send, Smile, Paperclip } from "react-feather";
import { useSelector, useDispatch } from "react-redux";
import selectors from "./selectors";
// import actions from "./actions";
import { actions } from "../../redux/messageSlice";
import constants from "./constants";
import userSelectors from "../UserPage/selectors";
import layoutSelectors from "../Layout/selectors";
import { Picker } from "emoji-mart";
import { isAuthenticated } from "../shared/routes/permissionChecker";
import { database } from "../../services/firebase";
import { v4 as uuidv4 } from "uuid";
import { getPrivateMessage, loadMessage } from "../../redux/messageSlice";
import { id } from "date-fns/locale";

let typingTimer = null;

function delay(callback, ms) {
  window.clearTimeout(typingTimer);
  typingTimer = setTimeout(function () {
    callback();
  }, 1500);
}

function ChatContentFooter() {
  const inputMessageRef = useRef();
  const receiver = useSelector(selectors.selectReceiver);
  const dispatch = useDispatch();
  const [emojiVisible, setEmojiVisible] = useState(false);
  const [typing, setTyping] = useState(false);
  const record = useSelector(selectors.selectRecord);
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const inputMessage = useSelector(selectors.selectInputMessage);
  const isMobileDevice = useSelector(layoutSelectors.selectIsMobileDevice);
  const userLoginLocalStorage = JSON.parse(localStorage.getItem("userLogin"));

  const handleTypingOff = () => {
    // emitTypingOff({
    //   info: currentUser,
    //   receiver: record.receiver,
    //   conversationType: record.conversationType,
    // });
  };

  const onInputMessageChange = (message) => {
    dispatch(actions.doChangeMessage(message));
  };

  const onInputImageListChange = ({ fileList }) => {
    dispatch({
      type: constants.INPUT_IMAGE_LIST_CHANGE,
      payload: [...fileList],
    });
  };

  const onInputFileListChange = ({ fileList }) => {
    dispatch({
      type: constants.INPUT_FILE_LIST_CHANGE,
      payload: [...fileList],
    });
  };

  const addEmoji = (e) => {
    onInputMessageChange(inputMessage.text + e.native);
    if (!isMobileDevice) inputMessageRef.current.focus();
  };

  const sendText = () => {
    if (inputMessage.text.trim() !== "") {
      // Gửi text và emoji
      if (
        Object.keys(receiver).length === 0 &&
        receiver.constructor === Object
      ) {
        database.ref("general/" + uuidv4()).set({
          senderId: userLoginLocalStorage.id,
          sender: {
            firstname: userLoginLocalStorage.firstname,
            lastname: userLoginLocalStorage.lastname,
          },
          message: inputMessage.text,
          timestamp: Date.now(),
        });
      } else {
        database
          .ref(`messages/${userLoginLocalStorage.id}-${receiver.id}`)
          .once("value", (snapshot) => {
            var id = uuidv4();
            if (snapshot.exists()) {
              database
                .ref(
                  `messages/${userLoginLocalStorage.id}-${receiver.id}/` + id
                )
                .set({
                  message: inputMessage.text,
                  senderId: userLoginLocalStorage.id,
                  receiverId: receiver.id,
                  timestamp: Date.now(),
                });
            } else {
              database
                .ref(
                  `messages/${receiver.id}-${userLoginLocalStorage.id}/` + id
                )
                .set({
                  message: inputMessage.text,
                  senderId: userLoginLocalStorage.id,
                  receiverId: receiver.id,
                  timestamp: Date.now(),
                });
            }
          });
        // database
        //   .ref(`messages/${receiver.id}-${userLoginLocalStorage.id}`)
        //   .once("value", (snapshot) => {
        //     if (snapshot.exists()) {
        //       database
        //         .ref(
        //           `messages/${receiver.id}-${userLoginLocalStorage.id}/` +
        //             uuidv4()
        //         )
        //         .set({
        //           message: inputMessage.text,
        //           senderId: userLoginLocalStorage.id,
        //           receiverId: receiver.id,
        //           timestamp: Date.now(),
        //         });
        //     } else {
        //       return "";
        //     }
        //   });
      }

      onInputMessageChange("");
    }
  };

  const sendImage = () => {
    // Nếu đang uploading thì không gửi
    let uploading = false;
    inputMessage.images.forEach((item) => {
      if (item.status === "uploading") uploading = true;
    });
    if (uploading) return;
    if (inputMessage.images.length > 0) {
      // gửi hình ảnh
      let images = [];
      inputMessage.images.forEach((item) => {
        if (item.response.name) {
          images.push(item.response.name);
        }
      });

      dispatch(
        actions.doCreate({
          images,
          type: "image",
          receiver: record.receiver.id,
          conversationType: record.conversationType,
        })
      );
      onInputImageListChange({ fileList: [] });
    }
  };

  const sendFile = () => {
    // Nếu đang uploading thì không gửi
    let uploading = false;
    inputMessage.files.forEach((item) => {
      if (item.status === "uploading") uploading = true;
    });
    if (uploading) return;
    if (inputMessage.files.length > 0) {
      // gửi file
      let files = [];
      inputMessage.files.forEach((item) => {
        if (item.response.name) {
          files.push({
            name: item.name,
            path: item.response.name,
          });
        }
      });

      dispatch(
        actions.doCreate({
          files,
          type: "file",
          receiver: record.receiver.id,
          conversationType: record.conversationType,
        })
      );
      onInputFileListChange({ fileList: [] });
    }
  };

  const handleSendClick = () => {
    sendText();
    // sendImage();
    // sendFile();
    //   dispatch(actions.doToggleScrollToBottom());

    // handleTypingOff();
    inputMessageRef.current.focus();
  };
  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Upload
          accept="image/*"
          name="photos"
          multiple={true}
          fileList={inputMessage.images}
          headers={{
            Authorization: `Bearer ${isAuthenticated()}`,
          }}
          action={`${process.env.REACT_APP_API_URI}/message/photos`}
          showUploadList={false}
          onChange={(files) => {
            onInputImageListChange(files);
          }}
        >
          <Button
            shape="circle"
            className="bg-transparent"
            style={{ border: "0" }}
          >
            <Image size={20} strokeWidth={1} />
          </Button>
        </Upload>
        <Upload
          accept="text/plain, application/pdf, .csv, .docx, .xlsx"
          name="files"
          multiple={true}
          fileList={inputMessage.files}
          headers={{
            Authorization: `Bearer ${isAuthenticated()}`,
          }}
          action={`${process.env.REACT_APP_API_URI}/message/files`}
          showUploadList={false}
          onChange={(files) => {
            onInputFileListChange(files);
          }}
        >
          <Button
            shape="circle"
            className="bg-transparent"
            style={{ border: "0" }}
          >
            <Paperclip size={20} strokeWidth={1} />
          </Button>
        </Upload>
        <Input
          ref={inputMessageRef}
          placeholder="Type a message"
          value={inputMessage.text}
          onChange={(e) => {
            onInputMessageChange(e.target.value);
          }}
          style={{ borderRadius: "1rem", color: "black" }}
          onPressEnter={handleSendClick}
          onKeyUp={() => {
            if (!typing) {
              setTyping(true);
              if (inputMessage.text.trim() !== "") {
                // emitTypingOn({
                //   info: currentUser,
                //   receiver: record.receiver,
                //   conversationType: record.conversationType,
                // });
              }
            }
            // delay(() => {
            //   handleTypingOff();
            //   setTyping(false);
            // }, 1000);
          }}
          suffix={
            <Popover
              content={
                <Picker set="facebook" sheetSize={32} onSelect={addEmoji} />
              }
              title="Title"
              trigger="click"
              visible={emojiVisible}
              onVisibleChange={() => setEmojiVisible(!emojiVisible)}
            >
              <Smile style={{ cursor: "pointer" }} size={20} strokeWidth={1} />
            </Popover>
          }
        />

        <Button shape="circle" type="link" onClick={handleSendClick}>
          <Send size={20} strokeWidth={1} />
        </Button>
      </div>
    </>
  );
}

export default ChatContentFooter;
