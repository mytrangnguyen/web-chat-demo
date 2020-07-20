import React, { useState, useEffect } from "react";
import { Icon, Spin, Tooltip, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import selectors from "./selectors";
import userSelectors from "../UserPage/selectors";
import AvatarCus from "../../components/AvatarCus";
import TypingIndicator from "../../components/TypingIndicator";
import Carousel, { Modal, ModalGateway } from "react-images";
import actions from "./actions";
import InfiniteScroll from "react-infinite-scroller";
import {
  loadPrivateMessage,
  loadGeneralMessage,
} from "../../redux/messageSlice";

function Conversation() {
  const dispatch = useDispatch();
  const record = useSelector(selectors.selectRecord);
  // const generalMessages = useSelector((state) => state.message.generalMessage);
  const typing = useSelector(selectors.selectTyping);
  const hasMoreConversation = useSelector(selectors.selectHasMoreConversation);
  const sending = useSelector(selectors.selectSending);
  const findLoading = useSelector(selectors.selectFindLoading);
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const [imageViewModelVisible, setImageViewModelVisible] = useState(false);
  const [currentImageViewIndex, setCurrentImageViewIndex] = useState(0);
  const userLoginLocalStorage = JSON.parse(localStorage.getItem("userLogin"));
  let imagesList = [];
  const receiver = useSelector(selectors.selectReceiver);

  const generalMessages = useSelector(
    (state) =>
      state.message.generalMessage &&
      state.message.generalMessage[`${userLoginLocalStorage.id}`]
  );

  const currentMessages = useSelector(
    (state) =>
      state.message.chatData &&
      state.message.chatData[`${userLoginLocalStorage.id}-${receiver.id}`]
  );

  var currentMessagesAfterSort = [];
  if (currentMessages) {
    currentMessagesAfterSort = currentMessages
      .slice()
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  console.log("currentMessagesAfterSort", currentMessagesAfterSort);

  var generalMessagesAfterSort = [];
  if (generalMessages) {
    generalMessagesAfterSort = generalMessages
      .slice()
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  const loadMoreConversation = () => {
    // dispatch(actions.doFind(record.receiver.id, record.messages.length));
  };

  useEffect(() => {
    const data = {
      senderId: userLoginLocalStorage.id,
      receiverId: receiver.id,
    };
    if (Object.keys(receiver).length === 0 && receiver.constructor === Object) {
      dispatch(loadGeneralMessage(userLoginLocalStorage.id));
    } else {
      dispatch(loadPrivateMessage(data));
    }
  }, [receiver.id]);

  const getFullName = (user) => {
    if (user) return user.firstname + " " + user.lastname;
    return "";
  };

  const renderConversation = (currentMessages, generalMessages) => {
    // console.log('generalMessages',generalMessages);
    console.log('cur',currentMessages);
    console.log('receiver',receiver);
    if (Object.keys(receiver).length === 0 && receiver.constructor === Object) {
      return (
        generalMessages &&
        generalMessages.map((chat, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <div style={{ width: 30, marginRight: "5px" }}>
                {chat.senderId !== userLoginLocalStorage.id && record && (
                  <Tooltip title={getFullName(receiver)}>
                    <AvatarCus record={chat.sender} size={30} />
                  </Tooltip>
                )}
              </div>
              <div
                key={index}
                className={`conversation
                                      ${
                                        chat.senderId ===
                                        userLoginLocalStorage.id
                                          ? "conversation-sent"
                                          : "conversation-received"
                                      }`}
              >
                {chat.senderId === userLoginLocalStorage.id ? (
                  // Nếu người gửi là user hiện tại
                  <>
                    <div className={`body body-sent`}>
                      <span color="inherit">{chat.message}</span>
                    </div>
                  </>
                ) : (
                  // Nếu người gửi không phải là user hiện tại
                  <>
                    <div className={`body body-received text-body`}>
                      <p
                        style={{
                          color: "#868686",
                          fontSize: "12px",
                        }}
                      >
                        {chat.firstname}
                      </p>
                      <p color="inherit">{chat.message}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })
      );
    } else {
      console.log("ahiahi");
      return (
        currentMessages &&
        currentMessages.map((chat, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <div style={{ width: 30, marginRight: "5px" }}>
                {chat.senderId !== userLoginLocalStorage.id && record && (
                  <Tooltip title={`General`}>
                    <AvatarCus record={userLoginLocalStorage} size={30} />
                  </Tooltip>
                )}
              </div>
              <div
                key={index}
                className={`conversation
                                      ${
                                        chat.senderId ===
                                        userLoginLocalStorage.id
                                          ? "conversation-sent"
                                          : "conversation-received"
                                      }`}
              >
                {chat.senderId === userLoginLocalStorage.id ? (
                  // Nếu người gửi là user hiện tại
                  <>
                    <div className={`body body-sent`}>
                      <span color="inherit">{chat.message}</span>
                    </div>
                  </>
                ) : (
                  // Nếu người gửi không phải là user hiện tại
                  <>
                    <div className={`body body-received text-body`}>
                      <p
                        style={{
                          color: "#868686",
                          fontSize: "12px",
                        }}
                      >
                        {receiver.firstname[0].toUpperCase() +
                          receiver.firstname.slice(1)}
                      </p>
                      <p color="inherit">{chat.message}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })
      );
    }
  };

  const typIndicator = (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <div style={{ width: 30, marginRight: "5px" }}>
        <AvatarCus
          record={typing && typing.info ? typing.info : null}
          size={30}
        />
      </div>
      <div className={`conversation conversation-received`}>
        <div>
          <TypingIndicator />
        </div>
      </div>
    </div>
  );

  if (record && record.messages) {
    let tempList = [];
    record.messages.forEach((message, index) => {
      if (message.images && message.images.length > 0) {
        tempList = tempList.concat(message.images);
      }
    });
    tempList = tempList.reverse();
    imagesList = tempList.map((image) => {
      return { src: `${process.env.REACT_APP_STATIC_PHOTOS}/${image}` };
    });
  }

  const handleInfiniteOnLoad = () => {
    loadMoreConversation();
  };

  return (
    <>
      <ModalGateway>
        {imageViewModelVisible ? (
          <Modal onClose={() => setImageViewModelVisible(false)}>
            <Carousel
              currentIndex={currentImageViewIndex}
              components={{ FooterCaption: () => null }}
              views={imagesList}
            />
          </Modal>
        ) : null}
      </ModalGateway>

      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={handleInfiniteOnLoad}
        hasMore={!findLoading && hasMoreConversation}
        useWindow={false}
        isReverse={true}
      >
        <div style={{ textAlign: "center" }}>
          <Spin spinning={findLoading && hasMoreConversation}></Spin>
        </div>
        {renderConversation(currentMessagesAfterSort, generalMessagesAfterSort)}
        {typing && typing.status && typIndicator}
        <div
          style={{
            textAlign: "right",
            color: "#8d8d8d",
            fontSize: "12px",
          }}
        >
          {sending && <span>Sending...</span>}
        </div>
      </InfiniteScroll>
    </>
  );
}

export default Conversation;
