import { List, ListItem, ListItemText, Typography, styled } from "@mui/material";
import { NavLink } from "react-router-dom";
import useAuth from "../features/login/useAuth";

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  textTransform: "none",
}));

const MenuList = () => {
  const {logout} = useAuth();
  const MENU_ITEMS = [
    {
      label: "Create Invoice",
      value: "/create-invoice",
    },
    {
      label: "View Invoices",
      value: "/view-invoices",
    },
    {
      label: "Logout",
      value: "logout",
      isAction: true,
    }
  ];

  const handleLogout = () => {
    // Perform your logout logic here
    // For example, redirect to the login page or clear session data
    console.log("Logout clicked");
    logout();
  };

  return (
    <List>
      {MENU_ITEMS.map((item, index) => (
        <StyledNavLink to={item.value} key={index}>
          <ListItem disablePadding onClick={item.isAction ? logout : null}>
            <ListItemText>
              <Typography variant="h6" color={"common.white"} >{item.label}</Typography>
            </ListItemText>
          </ListItem>
        </StyledNavLink>
      ))}
    </List>
  )
}

export default MenuList;
