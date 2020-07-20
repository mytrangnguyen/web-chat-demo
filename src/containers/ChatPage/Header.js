import { Icon, Layout, Menu, Dropdown, Avatar, Button, Badge } from "antd";
import React, { useEffect } from "react";
import HeaderWrapper from "./styles/HeaderWrapper";
// import selectors from "./selectors";
// import actions from "./actions";
import {doSignout} from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
const { Header: AntHeader } = Layout;

const Header = () => {
    // const ssauth = JSON.parse(window.localStorage.getItem("ssauth"));
    const dispatch = useDispatch();
    const userLoginLocalStorage = JSON.parse(localStorage.getItem('userLogin'));



    let Signout = () => {
        doSignout();
    };

    
    let doNavigateToProfile = () => {
        // getHistory().push('/profile');
    };

    let doToggleMenu = () => {
        dispatch(actions.doToggleMenu());
    };

    let userMenu = (
        <Menu selectedKeys={[]}>
            <Menu.Item onClick={doNavigateToProfile} key="userCenter">
                <Icon type="user" />
                Thông tin cá nhân
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={Signout} key="logout">
                <Icon type="logout" />
                Thoát
            </Menu.Item>
        </Menu>
    );

    return (
        <HeaderWrapper>
            <AntHeader>
                <Icon
                    className="trigger"
                    type={
                        useSelector(selectors.selectMenuVisible)
                            ? "menu-fold"
                            : "menu-unfold"
                    }
                    onClick={doToggleMenu}
                />
                <div>
                    <Badge count={noteUnReadCount}>
                        <Button
                            icon="edit"
                            style={{ border: "0px" }}
                            onClick={() => dispatch(noteActions.doToggle())}
                        />
                    </Badge>
                    <Dropdown
                        className="user-dropdown"
                        overlay={userMenu}
                        ssauth
                    >
                        <span>
                            <Avatar
                                className="user-dropdown-avatar"
                                size="small"
                                src={undefined}
                                alt="avatar"
                            />
                            <span className="user-dropdown-text">
                                {userLoginLocalStorage.email}
                            </span>
                        </span>
                    </Dropdown>
                </div>
            </AntHeader>
        </HeaderWrapper>
    );
};

export default Header;
