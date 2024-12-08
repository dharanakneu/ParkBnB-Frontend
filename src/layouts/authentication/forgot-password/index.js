import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-reset-cover.jpeg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // First attempt: Try to reset password for renter
      const renterResponse = await axios.post(
        "http://localhost:8080/api/renter/forgot-password",
        { email: email }, // Send plain password
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (renterResponse.status === 200) {
        setNotification({
          open: true,
          message: "Reset Link sent to email Successfully",
          severity: "success",
        });
        setTimeout(() => navigate("/login"), 3000); // Redirect to login after 2 seconds
        return;
      }
    } catch (error) {
      console.error("Error", error.response || error);

      // If renter reset failed, try for rentee
      try {
        const renteeResponse = await axios.post(
          "http://localhost:8080/api/rentees/forgot-password",
          { email: email }, // Send plain password
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (renteeResponse.status === 200) {
          setNotification({
            open: true,
            message: "Reset Link sent to email Successfully",
            severity: "success",
          });
          setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
          return;
        }
      } catch (error) {
        console.error("Error", error.response || error);

        // If both attempts fail
        setNotification({
          open: true,
          message: "Error resetting password. Please try again.",
          severity: "error",
        });
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: "", severity: "" });
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Forgot Password
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                Send Reset Link
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </BasicLayout>
  );
}

export default ForgotPassword;
