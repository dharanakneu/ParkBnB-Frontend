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

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
// Stripe-related imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";

// Load Stripe with your public key
const stripePromise = loadStripe(
  "pk_test_51QDduYP2L02lGzxVPe2NgdRL4u9ZPZDZ7Yv6tOlV7SpzJxLl4ztBhREQmWoS0RqxKEMiMPFvPyFCcEUgXBnZZu0300Ka2VxPlo"
);

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </MaterialUIControllerProvider>
  </BrowserRouter>
);
