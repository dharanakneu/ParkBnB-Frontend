import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../../assets/images/loonapix_17326378291388662408.png"; // Adjust the path based on your directory structure

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo - Use Box or img tag for better layout control */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo} // Change this path to your logo image
            alt="Park BnB Logo"
            style={{ height: 250 }} // Adjust the size of the logo as needed
          />
        </Box>

        {/* Navigation buttons with anchor links, aligned to the right */}
        <Box sx={{ ml: "auto" }}>
          <Button color="inherit" href="#">
            About
          </Button>
          <Button color="inherit" href="#features">
            Features
          </Button>
          <Button color="inherit" href="#team">
            Team
          </Button>
          <Link to="/sign-in" style={{ textDecoration: "none" }}>
            <Button color="inherit">Sign In</Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
