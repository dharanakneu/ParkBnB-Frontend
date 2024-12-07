import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { MaterialUIControllerProvider } from "context";

// Load Stripe with your public key
const stripePromise = loadStripe(
  "pk_test_51QDduYP2L02lGzxVPe2NgdRL4u9ZPZDZ7Yv6tOlV7SpzJxLl4ztBhREQmWoS0RqxKEMiMPFvPyFCcEUgXBnZZu0300Ka2VxPlo",
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
  </BrowserRouter>,
);
