import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function RenteeDashboard() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <h1>I am Rentee</h1>
      <Footer />
    </DashboardLayout>
  );
}

export default RenteeDashboard;
