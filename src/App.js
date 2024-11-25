import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

// SignIn component
import SignIn from "./layouts/authentication/sign-in";

import { AuthProvider, useAuth } from "./context/AuthContext";
import RenterDashboard from "./layouts/dashboard/renter-dashboard";
import RenteeDashboard from "./layouts/dashboard/rentee-dashboard";
import { renterRoutes, renteeRoutes } from "./routes";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const { userRole } = useAuth();

  useEffect(() => {
    console.log("Current user role:", userRole); // Log whenever userRole changes
  }, [userRole]);

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // const getRoutes = (allRoutes) =>
  //   allRoutes.map((route) => {
  //     if (route.collapse) {
  //       return getRoutes(route.collapse);
  //     }

  //     if (route.route) {
  //       return (
  //         <Route
  //           exact
  //           path={route.route}
  //           element={route.component}
  //           key={route.key}
  //         />
  //       );
  //     }

  //     return null;
  //   });

  return (
    <AuthProvider>
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={
                (transparentSidenav && !darkMode) || whiteSidenav
                  ? brandDark
                  : brandWhite
              }
              brandName="Park BnB"
              routes={userRole === "renter" ? renterRoutes : renteeRoutes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                {userRole === "renter" ? (
                  <RenterDashboard />
                ) : (
                  <RenteeDashboard />
                )}
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/sign-in" />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/sign-in" />;
};

// Define prop types for PrivateRoute
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, // Specify that children is required and of type node
};

//{
/* <Route
path="/dashboard"
element={
  <PrivateRoute>
    {userRole === "renter" ? (
      <RenterDashboard />
    ) : (
      <RenteeDashboard />
    )}
  </PrivateRoute>
}
/>
{getRoutes(routes)} */
//}

// {userRole === "renter" &&
//   renterRoutes.map((route) => (
//     <Route
//       key={route.key}
//       path={route.route}
//       element={route.component}
//     />
//   ))}
// {userRole === "rentee" &&
//   renteeRoutes.map((route) => (
//     <Route
//       key={route.key}
//       path={route.route}
//       element={route.component}
//     />
//   ))}
