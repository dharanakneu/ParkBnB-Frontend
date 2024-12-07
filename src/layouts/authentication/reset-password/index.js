import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-reset-cover.jpeg";
import bcrypt from "bcryptjs";
function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const navigate = useNavigate();

  // Extract token from URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hashedPassword = bcrypt.hashSync(password, 10);
    // Validate password
    if (!password) {
      setNotification({
        open: true,
        message: "Password is required.",
        severity: "error",
      });
      return;
    }

    try {
      // First attempt: Try to reset password for renter
      const renterResponse = await axios.post(
        "http://localhost:8080/api/renter/reset-password",
        { token: token, password: hashedPassword }, // Send plain password
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (renterResponse.status === 200) {
        setNotification({
          open: true,
          message: "Password has been reset successfully for renter.",
          severity: "success",
        });
        setTimeout(() => navigate("/login"), 3000); // Redirect to login after 2 seconds
        return;
      }
    } catch (error) {
      console.error(
        "Error resetting password for renter:",
        error.response || error,
      );

      // If renter reset failed, try for rentee
      try {
        const renteeResponse = await axios.post(
          "http://localhost:8080/api/rentees/reset-password",
          { token: token, password: hashedPassword }, // Send plain password
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (renteeResponse.status === 200) {
          setNotification({
            open: true,
            message: "Password has been reset successfully for rentee.",
            severity: "success",
          });
          setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
          return;
        }
      } catch (error) {
        console.error(
          "Error resetting password for rentee:",
          error.response || error,
        );

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
            Reset Password
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                Reset Password
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

export default ResetPassword;
