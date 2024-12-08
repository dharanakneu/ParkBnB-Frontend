import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import Features from "./Features";
import Team from "./Team";
import Footer from "./Footer";
import { Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <Team />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Link to="/sign-in" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            style={{ color: "white" }}
          >
            Sign In
          </Button>
        </Link>
      </Box>
      <Footer />
    </div>
  );
};

export default LandingPage;
