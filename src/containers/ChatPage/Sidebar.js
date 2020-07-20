import React, { useState } from "react";
import {
  Input,
  Layout,
  Menu,
  Badge,
  Row,
  Button,
  Dropdown,
  Tooltip,
} from "antd";
import {
  Users,
  MessageCircle,
  Search as SearchIcon,
  Edit,
} from "react-feather";
import { Link } from "react-router-dom";
import authActions from "../AuthPage/actions";
import MessageList from "./MessageList";
import ContactList from "../ContactPage/list/List";
import UserList from "../UserPage/list/List";
import { useSelector, useDispatch } from "react-redux";
import userSelectors from "../UserPage/selectors";
import contactSelectors from "../ContactPage/selectors";
import ModalCreateGroupchat from "./ModalCreateGroupchat";
import AvatarCus from "../../components/AvatarCus";
import { getSetting, setSetting } from "../shared/settings";
import { doSignout } from "../../redux/authSlice";
import { firebase } from "../../services/firebase";

const { Sider, Header } = Layout;
const { Search } = Input;

function ChatSidebar() {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("message");
  const [
    modalCreateGroupChatVisible,
    setModalCreateGroupChatVisible,
  ] = useState(false);
  const requests = useSelector(contactSelectors.selectRequests);
  const [playSound, setPlaySound] = useState(getSetting().sound);
  const userLoginLocalStorage = JSON.parse(localStorage.getItem("userLogin"));

  const signout = async () => {
    localStorage.removeItem("userLogin");
    await firebase.auth().signOut();
    dispatch(doSignout());
  };

  const messagesSidebar = () => {
    if (currentTab === "contact") {
      return <ContactList />;
    } else if (currentTab === "notification") {
      return <div>Notifications</div>;
    } else if (currentTab === "user") {
      return <UserList />;
    }
    return <MessageList />;
  };

  const handleMenuClick = (e) => {
    setCurrentTab(e.key);
  };

  const messageHeader = (
    <Menu
      mode="horizontal"
      className="border-0"
      selectedKeys={[currentTab]}
      onClick={handleMenuClick}
    >
      <Menu.Item
        key="message"
        style={{
          width: "33%",
          textAlign: "center",
        }}
      >
        <MessageCircle size={20} strokeWidth={1} />
      </Menu.Item>
      <Menu.Item
        key="contact"
        style={{
          width: "33%",
          textAlign: "center",
        }}
      >
        <Badge dot={requests && requests.length > 0}>
          <SearchIcon size={20} strokeWidth={1} />
        </Badge>
      </Menu.Item>
      <Menu.Item
        key="user"
        style={{
          width: "33%",
          textAlign: "center",
        }}
      >
        <Users size={20} strokeWidth={1} />
      </Menu.Item>
    </Menu>
  );

  const toggleMuteSound = () => {
    setSetting({ sound: !playSound });
    setPlaySound(!playSound);
  };

  const menu = (
    <Menu style={{ width: "150px" }}>
      {userLoginLocalStorage && (
        <Menu.Item key="0">
          <Link to={`/user/${userLoginLocalStorage.id}/update`}>
            Update info
          </Link>
        </Menu.Item>
      )}
      {userLoginLocalStorage && (
        <Menu.Item key="1">
          <Link to={`/user/${userLoginLocalStorage.id}/update-password`}>
            Change password
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="2" onClick={toggleMuteSound}>
        <span>{playSound ? "Mute sounds" : "Unmute sounds"}</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={signout}>
        <span>Sign out</span>
      </Menu.Item>
    </Menu>
  );

  const userInfo = (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.3rem 1.5rem",
        zIndex: "1",
        boxShadow: "0 2px 2px rgba(0, 0, 0, 0.02), 0 1px 0 rgba(0, 0, 0, 0.02)",
        height: "auto",
        lineHeight: "auto",
        backgroundColor: "#fff",
      }}
    >
      <Row type="flex" align="middle">
        <AvatarCus
          record={userLoginLocalStorage ? userLoginLocalStorage : null}
        />
        <span className="ml-3" style={{ lineHeight: "1" }}>
          <span style={{ display: "block" }}>
            {userLoginLocalStorage ? `${userLoginLocalStorage.firstname}` : ""}
          </span>
          {/* <small className="text-muted">
                        <span>Online</span>
                    </small> */}
        </span>
      </Row>
      <span className="mr-auto" />
      <div>
        <Tooltip title="Settings">
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button
              className="ant-dropdown-link"
              style={{ border: "0" }}
              shape="circle"
              icon="setting"
            ></Button>
          </Dropdown>
        </Tooltip>
        <Tooltip title="Create new group chat">
          <Button
            shape="circle"
            style={{ border: "0" }}
            onClick={() =>
              setModalCreateGroupChatVisible(!modalCreateGroupChatVisible)
            }
          >
            <Edit size={16} />
          </Button>
        </Tooltip>
      </div>
    </Header>
  );

  return (
    <Sider>
      <ModalCreateGroupchat
        visible={modalCreateGroupChatVisible}
        doToggle={() =>
          setModalCreateGroupChatVisible(!modalCreateGroupChatVisible)
        }
      />
      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          backgroundColor: "#fff",
          height: "100%",
          borderRight: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        {userInfo}
        {messageHeader}
        {messagesSidebar()}
      </div>
    </Sider>
  );
}

export default ChatSidebar;
