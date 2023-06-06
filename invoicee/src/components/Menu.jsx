import { Paper, styled } from "@mui/material";
import MenuList from "./MenuList";

const StyledMenuPaper = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(180deg, #005C97 19.46%, #363795 122.95%)",
  borderRadius: "20px",
  padding: "30px 0px",
}));

const Menu = () => {
  return (
    <StyledMenuPaper elevation={1}>
      <MenuList />
    </StyledMenuPaper>
  );
};

export default Menu;
