import React, { useState, useEffect } from "react";
import { List, Button, Tooltip } from "antd";
import Search from "antd/lib/input/Search";
import { useDispatch, useSelector } from "react-redux";
import selectors from "../selectors";
import contactActions from "../../ContactPage/actions";
import AvatarCus from "../../../components/AvatarCus";
import {actions} from "../../../redux/userSlice";
import {actionsr} from "../../../redux/contactSlice";
import {manageRequestAddContact} from "../../../services/firebase";
import {manageAddFr} from "../../../redux/contactSlice";

const UserList = () => {
  const dispatch = useDispatch();
  const [hasRequest, setHasRequest] = useState(false);
  const users = useSelector(selectors.selectUsers);
  const findLoading = useSelector(selectors.selectFindLoading);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const userLoginLocalStorage = JSON.parse(localStorage.getItem('userLogin'));

  useEffect(() => {});

  const handleChange = (event) => {
    setSearchValue(event.target.value);
    console.log("mảng users", users);
    console.log("check search user handle", searchValue);
    let resultSearchUsers = users.filter((user) =>
      user.firstname.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearchResult(resultSearchUsers);
    console.log("resultSearchUsers", resultSearchUsers);
  };

  const searchbar = (
    <div className="py-3 px-3" style={{ backgroundColor: "#fff" }}>
      <Search
        placeholder="Search contact"
        name="valueSearchUser"
        onChange={handleChange}
        loading={findLoading}
      />
    </div>
  );

  const handleAddContactClick = (userInfo) => {
    console.log("user info add contact", userInfo);
    setHasRequest(false);
    const userRequest ={ ...userInfo, type: "requestSent" }
    console.log("check has request", hasRequest);
    console.log("userLoginLocalStorage.id", userLoginLocalStorage.id);
    console.log("userInfo.id", userInfo.id);
    manageRequestAddContact(userLoginLocalStorage.id, userLoginLocalStorage.firstname, userLoginLocalStorage.lastname, userInfo.id);
    dispatch(actions.doCreateContact(userRequest))
    // dispatch(doAddContact(userInfo));
  };

  const handleRemoveContactClick = (userInfo) => {
      console.log("usser Infor destroy", userInfo);
      const userRemoveRequest = {...userInfo, type: "notContact"};
      dispatch(actions.doDestroyRequest(userRemoveRequest));
      console.log(" userRemoveRequest id", userRemoveRequest.id);
      
      dispatch(actionsr.doDeleteFriend(userRemoveRequest.id));
    
    // else if (userInfo.type === "requestSent") {
    //   dispatch(contactActions.doDestroyRequestSent(userInfo));
    // } else if (userInfo.type === "contact") {
    //   dispatch(contactActions.doDestroyContact(userInfo));
    // }
  };

  const handleConfirmContactClick = (userInfo) => {
    dispatch(contactActions.doUpdate(userInfo));
  };
  const renderFriendsList = () => {
    let listUsers = [];
    if (searchResult.length > 0) {
      listUsers = searchResult;
    } else listUsers = users;
    return (
      <List
        className="scroll-y flex-1 bg-transparent"
        itemLayout="horizontal"
        dataSource={listUsers}
        renderItem={(item, index) => (
          <List.Item className={`"border-0" border-0 px-4 py-3`}>
            <List.Item.Meta
              avatar={
                <AvatarCus record={item} />
              }
              title={
                <span
                  style={{
                    display: "flex",
                    width: "100%",
                  }}
                >
                  {item.firstname + " " + item.lastname}
                </span>
              }
              description={
                <>
                  {/* {!!item.type && item.type === "notContact" && ( */}
                  <Tooltip title="Add Contact">
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleAddContactClick(item)}
                    >
                      Add Contact
                    </Button>
                  </Tooltip>
                   {/* )} */}
                  {!!item.type && item.type === "request" && (
                    <>
                      <Tooltip title="Confirm request">
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleConfirmContactClick(item)}
                        >
                          Confirm
                        </Button>
                      </Tooltip>
                      <Tooltip title="Remove request">
                        <Button
                          size="small"
                          onClick={() => handleRemoveContactClick(item)}
                        >
                          Remove
                        </Button>
                      </Tooltip>
                    </>
                  )}
                  {!!item.type && item.type === "requestSent" && (
                    <Tooltip title="Cancel request">
                      <Button
                        size="small"
                        onClick={() => handleRemoveContactClick(item)}
                      >
                        Cancel Request
                      </Button>
                    </Tooltip>
                  )}
                  {!!item.type && item.type === "contact" && (
                    <>
                      <Tooltip title="Remove contact">
                        <Button
                          size="small"
                          onClick={() => handleRemoveContactClick(item)}
                        >
                          Remove Contact
                        </Button>
                      </Tooltip>
                    </>
                  )}
                  {!!item.type && item.type === "you" && <span>You</span>}
                </>
              }
            />
          </List.Item>
        )}
      />
    );
  };
  return (
    <>
      {searchbar}
      {renderFriendsList()}
    </>
  );
};
export default UserList;
