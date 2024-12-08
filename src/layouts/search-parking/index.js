import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Container } from "@mui/material";

// Basic CSS for card styles, including layout improvements
const cardStyle = {
  display: "grid", // Use CSS Grid for equal-width columns
  gridTemplateColumns: "1fr 2fr 1fr", // Three columns: 1 for image, 2 for address, 1 for button
  alignItems: "center", // Align items vertically in the center
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  transition: "transform 0.2s ease-in-out",
};

const imageStyle = {
  width: "100%", // Make the image take full width of its grid cell
  height: "100px", // Fixed height for the image
  borderRadius: "8px",
  objectFit: "cover", // Ensure image scales correctly without distortion
};

const detailsStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center", // Center the address text vertically
  paddingLeft: "30px", // Add some space between the image and the text
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end", // Align button to the right
  alignItems: "center",
};

const loadingButtonStyle = {
  backgroundColor: "#007BFF",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "background-color 0.3s ease",
};

const loadingButtonDisabledStyle = {
  ...loadingButtonStyle,
  backgroundColor: "#A0A0A0",
  cursor: "not-allowed",
};

// Spinner inline styles with keyframes for spinning
const spinnerStyle = {
  border: "4px solid #f3f3f3",
  borderTop: "4px solid #3498db",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  animation: "spin 2s linear infinite",
};

const spinnerKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SearchParkingLocation = () => {
  const [parkingLocations, setParkingLocations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // For managing loading state
  const [fetching, setFetching] = useState(false); // New state for tracking fetching state
  const radius = 5; // Default radius in miles
  const navigate = useNavigate(); // Hook for navigation

  // Function to fetch user's current location and parking locations
  const fetchParkingLocations = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setFetching(true); // Set fetching state to true

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await axios.get(
            `http://localhost:8080/api/parkinglocation/nearby`,
            {
              params: {
                latitude,
                longitude,
                radius,
              },
            }
          );
          setParkingLocations(response.data);
          setError("");
        } catch (err) {
          console.error(err);
          setError("Error fetching parking locations.");
        } finally {
          setFetching(false); // Set fetching state to false once fetching is complete
        }
      },
      (err) => {
        setError(`Error fetching location: ${err.message}`);
        setFetching(false); // Set fetching state to false in case of error
      }
    );
  };

  // Fetch parking locations on component load
  useEffect(() => {
    fetchParkingLocations();
  }, []); // Run only once when the component is loaded

  return (
    <DashboardLayout>
      <Container sx={{ width: "800px !important" }}>
        <h3 style={{ marginBottom: "30px" }}>Nearby Parking Locations</h3>

        {/* Inject the keyframes animation into the document */}
        <style>{spinnerKeyframes}</style>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Loading Spinner and Message */}
        {fetching && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div style={spinnerStyle}></div>
            <span style={{ marginLeft: "10px" }}>
              Fetching nearby parking locations...
            </span>
          </div>
        )}

        {/* Display the parking locations only if fetching is complete */}
        {!fetching && parkingLocations.length === 0 && (
          <p>No parking locations found in your area.</p>
        )}

        {parkingLocations.length > 0 && (
          <div>
            {parkingLocations.map((location, index) => (
              <div
                key={index}
                style={cardStyle}
                onClick={() => navigate(`/parking-location/${location.id}`)}
              >
                {/* Parking Location Image */}
                <img
                  src={`http://localhost:8080/${location.parkingLocationImage}`} // Placeholder image URL (you can replace this with actual images)
                  alt="Parking Location"
                  style={imageStyle}
                />

                {/* Location Details */}
                <div style={detailsStyle}>
                  <h4>
                    {location.street}, {location.city}
                  </h4>
                  <p>
                    {location.state}, {location.postalcode}
                  </p>
                </div>

                {/* Button Container */}
                <div style={buttonContainerStyle}>
                  <button
                    style={
                      loading ? loadingButtonDisabledStyle : loadingButtonStyle
                    }
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click navigation
                      setLoading(true);
                      // Simulate an async action (e.g., fetching more data) and navigate
                      setTimeout(() => {
                        navigate(`/parking-location/${location.id}`);
                        setLoading(false);
                      }, 500); // Simulate loading time
                    }}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "View Parking Spots"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default SearchParkingLocation;
