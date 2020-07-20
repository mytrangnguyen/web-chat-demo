import React from "react";
import { Video, Info, ArrowLeft } from "react-feather";
import actions from "./actions";
import {selectRecord} from "./selectors";
import { Button, Row, Layout } from "antd";
import userSelectors from "../UserPage/selectors";
import AvatarCus from "../../components/AvatarCus";
import { useSelector, useDispatch } from "react-redux";
import { emitCheckListenerStatus } from "../CallPage/socket";
import layoutActions from "../Layout/actions";
import layoutSelectors from "../Layout/selectors";
import { Link } from "react-router-dom";
import { textAbstract } from "../shared/helper";
const { Header } = Layout;

function ChatContentHeader() {
  const dispatch = useDispatch();
  const record = useSelector(selectRecord);
  const receiver = useSelector(selectors.selectReceiver);
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const userLoginLocalStorage = JSON.parse(localStorage.getItem("userLogin"));

  const handleCallVideoClick = () => {
    // b01. kiểm trả listener có online hay không
    let caller = {
      id: userLoginLocalStorage.id,
      firstname: userLoginLocalStorage.firstname,
      lastname: userLoginLocalStorage.lastname,
      picture: currentUser.picture,
    };
    emitCheckListenerStatus({ caller, listener: record.receiver });
  };

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.3rem 2rem",
        zIndex: "1",
        boxShadow: "0 2px 2px rgba(0, 0, 0, 0.02), 0 1px 0 rgba(0, 0, 0, 0.02)",
        height: "auto",
        lineHeight: "auto",
        backgroundColor: "#fff",
      }}
    >
      <Row type="flex" align="middle">
        <Link to="/">
          <Button
            style={{ border: "0", marginLeft: "-1.2rem" }}
            shape="circle"
            onClick={() => {
              dispatch(actions.doClear());
              dispatch(layoutActions.doShowLeftSidebar());
            }}
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </Button>
        </Link>

        <AvatarCus record={record ? receiver : null} />
        <span className="ml-3" style={{ lineHeight: "1" }}>
          <span style={{ display: "block" }}>
            {Object.keys(receiver).length === 0 &&
            receiver.constructor === Object
              ? "General"
              : `${receiver.firstname} ${receiver.lastname}`}
          </span>
        </span>
      </Row>
      <span className="mr-auto" />
      <div>
        {record && record.conversationType === "User" && (
          <>
            <Button
              style={{ border: "0" }}
              shape="circle"
              onClick={handleCallVideoClick}
            >
              <Video size={20} strokeWidth={1} />
            </Button>
          </>
        )}
        <Button
          style={{ border: "0" }}
          shape="circle"
          onClick={() => dispatch(layoutActions.doToggleRightSidebar())}
        >
          <Info size={20} strokeWidth={1} />
        </Button>
      </div>
    </Header>
  );
}

export default ChatContentHeader;
