/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import React, { useState } from "react";
import axios from "axios";

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
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.role === "Renter") {
        const response = await axios.post(
          "http://localhost:8080/api/renter", // Replace with your API endpoint
          formData
        );
        setMessage("Renter registered successfully!");
        console.log(response.data); // Optional: Log the response
      } else {
        const response = await axios.post(
          "http://localhost:8080/api/rentees", // Replace with your API endpoint
          formData
        );
        setMessage("Rentee registered successfully!");
        console.log(response.data); // Optional: Log the response
      }
    } catch (error) {
      setMessage("An error occurred during signup.");
      console.error(error);
    }
    navigate("/sign-in");
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
                  <MDInput
                    type="radio"
                    name="role"
                    value="Renter"
                    variant="standard"
                    onChange={handleChange}
                    checked={formData.role === "Renter"}
                    required
                  />
                  <MDTypography ml={1}>Renter</MDTypography>
                </MDBox>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <MDInput
                    type="radio"
                    name="role"
                    value="Rentee"
                    variant="standard"
                    onChange={handleChange}
                    checked={formData.role === "Rentee"}
                    required
                  />
                  <MDTypography ml={1}>Rentee</MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                sign in
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
    </CoverLayout>
  );
}

export default Cover;
