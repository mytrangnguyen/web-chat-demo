import React, { useState } from "react";
import { Icon, List, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import selectors from "./selectors";
// import actions from "./actions";
import { Link, useParams } from "react-router-dom";
import userSelectors from "../UserPage/selectors";
import AvatarCus from "../../components/AvatarCus";
import InfiniteScroll from "react-infinite-scroller";
import { formatDistanceToNowStrict } from "date-fns";
import { textAbstract } from "../shared/helper";
import { current } from "@reduxjs/toolkit";
import actions from "../../redux/messageSlice";

const MessageList = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const users = useSelector(userSelectors.selectUsers);
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const messageListLoading = useSelector(selectors.selectMessageListLoading);
  const hasMoreMessageList = useSelector(selectors.selectHasMoreMessageList);
  const userLoginLocalStorage = JSON.parse(localStorage.getItem("userLogin"));
  const messages = useSelector((state) => state.message.chatData);
  const friends = users.filter((item) => item.id !== userLoginLocalStorage.id);
  const [isActive, setIsActive] = useState(false);
  const receiver = useSelector(selectors.selectReceiver);

  const loadMoreMessageList = () => {
    let gskip = 0;
    let pskip = 0;
    messages.forEach((message) => {
      if (message.conversationType === "User") pskip += 1;
      if (message.conversationType === "ChatGroup") gskip += 1;
    });
    dispatch(actions.list({ gskip, pskip }));
  };
  // if (messages && messages.length > 0) {
  return (
    <div className="scroll-y flex-1 bg-transparent">
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={loadMoreMessageList}
        hasMore={!messageListLoading && hasMoreMessageList}
        useWindow={false}
      >
        <Link to={`/m/general`}>
          <List.Item
            style={{
              backgroundColor: userId ? "#fff" : "#e6f7ff",
              cursor: "pointer",
              borderRadius: "0.8rem",
            }}
            className={`${"border-0"} border-0 px-4 py-3`}
          >
            <List.Item.Meta
              avatar={<AvatarCus Icon="user" />}
              title={
                <p
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      flex: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {
                      // ? textAbstract(item.receiver.name, 20)
                      "General"
                    }
                  </span>
                  <small></small>
                </p>
              }
              description={
                <p
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    width: "200px",
                    textOverflow: "ellipsis",
                  }}
                >
                  {"Messages(s)"}
                </p>
              }
            />
          </List.Item>
        </Link>
        <List
          style={{ marginTop: "5px" }}
          itemLayout="horizontal"
          dataSource={friends}
          renderItem={(item, index) => {
            if (!userLoginLocalStorage) return <span></span>;
            let user = item;
            // if(user){
            //   dispatch(actions.doSetReciver(user));
            // }
            // if (item.conversationType === "ChatGroup") {
            //   user = item.receiver;
            // } else {
            //   user =
            //     item.sender._id === currentUser.id
            //       ? item.receiver
            //       : item.sender;
            // }
            return (
              <>
                <Link to={`/m/${user.id}`}>
                  <List.Item
                    style={{
                      backgroundColor: user.id === userId ? "#e6f7ff" : "#fff",
                      cursor: "pointer",
                      borderRadius: "0.8rem",
                    }}
                    className={`${
                      user.id === userId ? "" : "border-0"
                    } border-0 px-4 py-3`}
                  >
                    <List.Item.Meta
                      avatar={<AvatarCus record={user} />}
                      title={
                        <p
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              flex: 1,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {
                              // ? textAbstract(item.receiver.name, 20)
                              textAbstract(
                                user.firstname[0].toUpperCase() +  
                                user.firstname.slice(1) + " " + user.lastname[0].toUpperCase() +  
                                user.lastname.slice(1),
                                20
                              )
                            }
                          </span>
                          <small>
                            {item.updatedAt
                              ? formatDistanceToNowStrict(
                                  new Date(item.updatedAt),
                                  {
                                    addSuffix: false,
                                  }
                                )
                              : ""}
                          </small>
                        </p>
                      }
                      description={
                        <p
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            width: "200px",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {"Messages(s)"}
                        </p>
                      }
                    />
                  </List.Item>
                </Link>
              </>
            );
          }}
        ></List>
      </InfiniteScroll>
    </div>
  );
};
export default MessageList;
