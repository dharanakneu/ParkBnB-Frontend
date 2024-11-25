import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Basic CSS for card styles and loading indicator
const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "20px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
};

const loadingButtonStyle = {
  backgroundColor: "#007BFF",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

const loadingButtonDisabledStyle = {
  ...loadingButtonStyle,
  backgroundColor: "#A0A0A0",
  cursor: "not-allowed",
};

const SearchParkingLocation = () => {
  const [parkingLocations, setParkingLocations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // For managing loading state
  const radius = 5; // Default radius in miles
  const navigate = useNavigate(); // Hook for navigation

  // Function to fetch user's current location and parking locations
  const fetchParkingLocations = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

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
        }
      },
      (err) => {
        setError(`Error fetching location: ${err.message}`);
      }
    );
  };

  // Fetch parking locations on component load
  useEffect(() => {
    fetchParkingLocations();
  }, []); // Run only once when the component is loaded

  return (
    <div style={{ margin: "20px" }}>
      <h3>Nearby Parking Locations</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {parkingLocations.length > 0 ? (
        <div>
          {parkingLocations.map((location, index) => (
            <div
              key={index}
              style={cardStyle}
              onClick={() => navigate(`/parking-location/${location.id}`)}
            >
              <h4>
                {location.street}, {location.city}
              </h4>
              <p>
                {location.state}, {location.postalcode}
              </p>
              {/* Latitude and longitude are not displayed */}
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
          ))}
        </div>
      ) : (
        <p>No parking locations found in your area.</p>
      )}
    </div>
  );
};

export default SearchParkingLocation;
