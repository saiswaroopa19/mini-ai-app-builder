import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/auth";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleHistory = () => {
    handleClose();
    navigate("/history");
  };

  const handleSignout = async () => {
    await fetch("http://localhost:8080/users/signout", { method: "POST", credentials: "include" });
    clearAuth();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Mini AI App Builder</Typography>
        <IconButton color="inherit" onClick={handleMenu}>
          <AccountCircle />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleHistory}>View History</MenuItem>
          <MenuItem onClick={handleSignout}>Sign Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
