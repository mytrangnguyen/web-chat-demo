import React, { useEffect, lazy } from "react";
import { Layout, Row, Result } from "antd";
import layoutSelectors from "../Layout/selectors";
// import actions from "./actions";
import contactActions from "../ContactPage/actions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import selectors from "./selectors";
import layoutActions from "../Layout/actions";
import callActions from "../CallPage/actions";
// import SigninPage from "containers/AuthPage/SigninPage";
// import Signin from "../AuthPage/SigninPage";
import userSelectors from "../UserPage/selectors";
import { getAllUserFromDatabase } from "../../redux/userSlice";
import { loadGeneralMessage} from "../../redux/messageSlice";
import { manageAddFr } from "../../redux/contactSlice";
import { actions } from "../../redux/messageSlice";

const Sidebar = lazy(() => import("./Sidebar"));
const ChatContent = lazy(() => import("./ChatContent"));
const RightSideBar = lazy(() => import("./RightSidebar"));

export default function ChatPage() {
  const dispatch = useDispatch();
  let { userId } = useParams();
  const rightSidebarVisible = useSelector(
    layoutSelectors.selectRightSidebarVisible
  );
  const userLogin = useSelector((state) => state.auth.userLogin);
  const isMobileDevice = useSelector(layoutSelectors.selectIsMobileDevice);
  const record = useSelector(selectors.selectRecord);
  const users = useSelector(userSelectors.selectUsers);
  const userLoginLocalStorage = JSON.parse(localStorage.getItem("userLogin"));
  const currentMessages = useSelector(
    (state) =>
      state.message.chatData 
  );

  const windowOnResize = () => {
    dispatch(layoutActions.doWindowResize(window.innerWidth));
  };

  useEffect(() => {
    dispatch(getAllUserFromDatabase());
    dispatch(contactActions.listRequests());
    windowOnResize(window.innerWidth);
    window.addEventListener("resize", windowOnResize);
    dispatch(callActions.doGetIceServer());
    return () => {
      window.removeEventListener("resize", windowOnResize);
    };
  }, []);
  useEffect(() => {
    if (userId || userId === undefined) {
      console.log("user Id", userId);
      let userChat = {};
      users.map((item) => {
        if (item.id === userId) {
          userChat = item;
        }
      });
      const data = {
            senderId: userLoginLocalStorage.id,
            receiverId: userId, 
          }
      // dispatch(getPrivateMessage(data));
      dispatch(actions.doSetReciver(userChat));
      dispatch(actions.doFind(userId));
    }
  }, [userId]);

  if (record) {
    // dispatch(layoutActions.doHideLeftSidebar());
  }

  return (
    <Layout style={{ height: "100vh", backgroundColor: "#fff" }}>
      <Layout className="fill-workspace rounded shadow-sm overflow-hidden">
        <Sidebar />
        {record ? (
          <>
            <ChatContent />
            {rightSidebarVisible && <RightSideBar />}
          </>
        ) : (
          <Row
            type="flex"
            align="middle"
            justify="center"
            className="px-3 bg-white mh-page"
            style={{
              minHeight: "100vh",
              width: "100%",
            }}
          >
            <Result
              icon={<img width="300" src="/logo-chat.png" />}
              title="Welcome to Awesome Chat"
              subTitle="On Being Awesome"
            />
          </Row>
        )}
      </Layout>
    </Layout>
  );
}
