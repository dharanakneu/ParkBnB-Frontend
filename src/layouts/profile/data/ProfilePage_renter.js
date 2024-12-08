import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  CardHeader,
  Typography,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const ProfilePage_renter = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // Get renterId dynamically from sessionStorage (assuming "userId" is stored in sessionStorage)
  const renterId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!renterId) {
      setError("No renter ID found.");
      setLoading(false);
      return;
    }

    // Fetching renter data using axios from Spring Boot backend
    axios
      .get(`http://localhost:8080/api/renter/${renterId}`)
      .then((response) => {
        console.log("Renter Profile Data:", response.data); // Log response data to check the structure
        setProfileData(response.data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching renter data:", error);
        setError("Failed to fetch profile data.");
        setLoading(false); // Set loading to false even if there's an error
      });
  }, [renterId]); // Depend on renterId to re-fetch data if it changes

  if (loading) {
    return <Typography>Loading...</Typography>; // Return loading text if data is still being fetched
  }

  if (error) {
    return <Typography>{error}</Typography>; // Show error message if there was a failure
  }

  return (
    <DashboardLayout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f4f6f8",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 400,
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <CardHeader
            title="Renter Profile"
            titleTypographyProps={{ align: "center" }}
          />
          <CardContent>
            {profileData ? (
              <Box sx={{ textAlign: "center" }}>
                <Avatar
                  alt="Profile Picture"
                  src={`http://localhost:8080/images/${profileData.profileImage}`} // Assuming profile image path
                  sx={{
                    width: 100,
                    height: 100,
                    marginBottom: 2,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    marginTop: 1,
                  }}
                >
                  {profileData.firstName} {profileData.lastName}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    marginTop: 1,
                  }}
                >
                  Email: {profileData.email}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    marginTop: 1,
                  }}
                >
                  Phone: {profileData.phone}
                </Typography>
              </Box>
            ) : (
              <Typography>No Profile Data Available</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default ProfilePage_renter;
