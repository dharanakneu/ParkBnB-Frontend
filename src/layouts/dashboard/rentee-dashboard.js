import React from "react";
import { Box, Typography, Container } from "@mui/material"; // Material-UI components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import SearchParkingLocation from "../../layouts/search-parking";
import Footer from "examples/Footer";

function RenteeDashboard() {
  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <Box
        sx={{
          textAlign: "center",
          mt: 4,
          mb: 4,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 2,
          }}
        >
          Welcome to ParkBnB
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: "text.secondary",
          }}
        >
          Find and book parking spots effortlessly.
        </Typography>
      </Box>

      {/* Search Parking Section */}
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyItems: "center",
          mb: 4,
          p: 3,
          backgroundColor: "background.paper", // Optional for a card-like effect
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Optional for elevation effect
        }}
      >
        <SearchParkingLocation />
      </Container>

      <Footer />
    </DashboardLayout>
  );
}

export default RenteeDashboard;
