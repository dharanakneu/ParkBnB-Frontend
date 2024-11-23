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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset previous error message

    try {
      // First, try to login as a renter
      const renterResponse = await axios.post(
        "http://localhost:8080/api/renter/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json", // Ensure proper content type
          },
        }
      );

      if (renterResponse.status === 200) {
        // If renter login is successful, navigate to dashboard
        const { email, token } = renterResponse.data;

        // Validate renter token
        const validateResponse = await axios.get(
          "http://localhost:8080/api/renter/validate",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Store renter info and token in sessionStorage
        sessionStorage.setItem("userType", "renter");
        sessionStorage.setItem("userEmail", email);
        sessionStorage.setItem("token", token);
        navigate("/dashboard");
        setMessage(
          `Login successful! Token is valid for user: ${validateResponse.data}`
        );

        return; // Exit early, no need to check rentee login
      }
    } catch (error) {
      // If renter login fails (401 or any other error), handle the rentee login
      console.log("Renter login failed, attempting rentee login...");
      try {
        const renteeResponse = await axios.post(
          "http://localhost:8080/api/rentees/login",
          formData,
          {
            headers: {
              "Content-Type": "application/json", // Ensure proper content type
            },
          }
        );

        if (renteeResponse.status === 200) {
          // If rentee login is successful, navigate to dashboard
          const { email, token } = renteeResponse.data;

          // Store rentee info and token in sessionStorage
          sessionStorage.setItem("userType", "rentee");
          sessionStorage.setItem("userEmail", email);
          sessionStorage.setItem("token", token);

          // Validate rentee token
          const validateResponse = await axios.get(
            "http://localhost:8080/api/rentees/validate",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          navigate("/dashboard");
          setMessage(
            `Login successful! Token is valid for user: ${validateResponse.data}`
          );
          return; // Exit early, no need to show an error
        }
      } catch (error) {
        // If both renter and rentee logins fail, show an error message
        setErrorMessage("Invalid email or password. Please try again.");
        console.error(error); // Log error for debugging
      }
    }
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
            Sign in
          </MDTypography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ mt: 1, mb: 2 }}
          >
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              >
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              >
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              >
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
