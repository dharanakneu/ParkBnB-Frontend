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

const ProfilePage_rentee = () => {
  const [profileData, setProfileData] = useState(null);

  // Get user ID from session storage
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8080/api/rentees/${userId}`)
        .then((response) => setProfileData(response.data))
        .catch((error) => console.error("Error fetching rentee data:", error));
    }
  }, [userId]);

  return (
    <DashboardLayout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          paddingBottom: "100px",
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
            title="Rentee Profile"
            titleTypographyProps={{ align: "center" }}
          />

          <CardContent>
            {profileData ? (
              <Box sx={{ textAlign: "center" }}>
                <Avatar
                  alt="Profile Picture"
                  src={`http://localhost:8080/images/${profileData.profileImage}`}
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
                <Typography sx={{ color: "text.secondary", marginTop: 1 }}>
                  Email: {profileData.email}
                </Typography>
                <Typography sx={{ color: "text.secondary", marginTop: 1 }}>
                  Phone: {profileData.phone}
                </Typography>
              </Box>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default ProfilePage_rentee;
