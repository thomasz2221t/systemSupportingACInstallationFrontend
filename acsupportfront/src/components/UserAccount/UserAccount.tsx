import React, { useState, useEffect } from "react";
import { Menu, MenuItem, ListItemIcon, Button } from "@mui/material";
import { UserType } from "types/UserType";
import { Link } from "react-router-dom";
import AuthService from "services/auth/AuthService";
import Logout from "@mui/icons-material/Logout";
import getUserBody from "services/UserService";

import "./UserAccount.scss";

export const USER_MENU_ITEMS = [
  {
    title: "Wyloguj się",
    url: "/logout",
  },
];

const USER_BODY_ITEMS = {
  id: 0,
  login: "",
  password: "",
  firstName: "",
  lastName: "",
  email: "",
  telephone: "",
};

export default function UserAccount() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userId] = useState<number>(AuthService.getCurrentUserId());
  const [userBody, setUserBody] = useState<UserType>(USER_BODY_ITEMS);
  const open = Boolean(anchorEl);

  useEffect(() => {
    handleGetingUserBuildings(userId);
  }, []);

  const handleGetingUserBuildings = async (userId: number) => {
    await getUserBody(userId).then((response) => {
      console.log(response.data);
      setUserBody(response.data);
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="user-menu">
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          {`użytkownik ${userBody?.firstName} ${userBody?.lastName}`}
        </Button>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "center", vertical: "center" }}
        >
          <MenuItem>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <Link to="/" className="logout-link">
              Wyloguj się
            </Link>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
}
