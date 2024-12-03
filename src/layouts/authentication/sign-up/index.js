import React, { useState } from "react";
import bcrypt from "bcryptjs";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// Material-UI components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// Material Dashboard components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up.jpg";

function Cover() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    phone: "",
    role: "",
  });

  const [notification, setNotification] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const handleNotificationClose = () =>
    setNotification({ ...notification, open: false });

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, password, email, phone, role } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!firstName || !lastName || !password || !email || !phone || !role) {
      setNotification({
        open: true,
        severity: "error",
        message: "All fields are required. Please fill out the entire form.",
      });
      return false;
    }
    if (!emailRegex.test(email)) {
      setNotification({
        open: true,
        severity: "error",
        message: "Please enter a valid email address.",
      });
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setNotification({
        open: true,
        severity: "error",
        message: "Phone number must be 10 digits.",
      });
      return false;
    }
    if (password.length < 6) {
      setNotification({
        open: true,
        severity: "error",
        message: "Password must be at least 6 characters long.",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const hashedPassword = bcrypt.hashSync(formData.password, 10);
    const dataToSend = { ...formData, password: hashedPassword };

    try {
      const endpoint =
        formData.role === "Renter"
          ? "http://localhost:8080/api/renter"
          : "http://localhost:8080/api/rentees";

      const response = await axios.post(endpoint, dataToSend);
      setNotification({
        open: true,
        severity: "success",
        message: response.data.message || "User registered successfully!",
      });
      navigate("/sign-in");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setNotification({
          open: true,
          severity: "error",
          message: error.response.data.message,
        });
      } else {
        setNotification({
          open: true,
          severity: "error",
          message: "An error occurred during sign-up. Please try again.",
        });
      }
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your details to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="First Name"
                name="firstName"
                variant="standard"
                fullWidth
                onChange={handleChange}
                value={formData.firstName}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Last Name"
                name="lastName"
                variant="standard"
                fullWidth
                onChange={handleChange}
                value={formData.lastName}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                name="password"
                variant="standard"
                fullWidth
                onChange={handleChange}
                value={formData.password}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                name="email"
                variant="standard"
                fullWidth
                onChange={handleChange}
                value={formData.email}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="tel"
                label="Phone"
                name="phone"
                variant="standard"
                fullWidth
                onChange={handleChange}
                value={formData.phone}
                required
              />
            </MDBox>
            <MDBox mb={1}>
              <MDTypography variant="standard">Select Role:</MDTypography>
              <MDBox display="flex" flexDirection="column">
                <MDBox display="flex" alignItems="center" mb={2}>
                  <Checkbox
                    name="role"
                    value="Renter"
                    onChange={handleChange}
                    checked={formData.role === "Renter"}
                  />
                  <MDTypography ml={1}>Renter</MDTypography>
                </MDBox>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <Checkbox
                    name="role"
                    value="Rentee"
                    onChange={handleChange}
                    checked={formData.role === "Rentee"}
                  />
                  <MDTypography ml={1}>Rentee</MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                Sign Up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </CoverLayout>
  );
}

export default Cover;
