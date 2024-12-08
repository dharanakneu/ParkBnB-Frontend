import React from "react";
import { Box, Button, Typography } from "@mui/material"; // Material-UI components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import { useNavigate } from "react-router-dom";

function RenterDashboard() {
  const navigate = useNavigate();
  const textColor = "primary.dark"; // Set to a theme color or specific color

  return (
    <DashboardLayout>
      {/* Main Content */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="80vh"
        textAlign="center"
        sx={{
          backgroundImage: "url('/images/parking-page-bg.jpg')", // Replace with your background image path
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent white overlay
            padding: 5,
            borderRadius: 2,
            width: "80%",
            maxWidth: "600px",
          }}
        >
          {/* Heading */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 2,
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)", // Subtle shadow for depth
            }}
          >
            Welcome to Park BnB
          </Typography>
          {/* Subheading */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "medium",
              mb: 3,
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)", // Subtle shadow for depth
            }}
          >
            Manage your parking spaces with ease.
          </Typography>
          {/* Button */}
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              px: 4,
              py: 1,
              backgroundColor: "#3f51b5",
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "uppercase",
              "&:hover": {
                backgroundColor: "#303f9f",
              },
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Button shadow for depth
            }}
            onClick={() => navigate("/post-parking-location")}
          >
            Post Parking
          </Button>
        </Box>
      </Box>
      <Footer />
    </DashboardLayout>
  );
}

export default RenterDashboard;
