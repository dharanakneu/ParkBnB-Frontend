import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
    navigate("/sign-in");
  }, [navigate]);

  return null; // No UI to render for logout
};

export default Logout;
