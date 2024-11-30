import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Box,
  Divider,
} from "@mui/material";

function EditDeleteParkingLocation() {
  const [locations, setLocations] = useState([]);
  const [spots, setSpots] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [isEditingLocation, setIsEditingLocation] = useState(false); // For editing location
  const [editLocationData, setEditLocationData] = useState({}); // Location data to edit
  const [isEditingSpot, setIsEditingSpot] = useState(false); // For editing spot
  const [editSpotData, setEditSpotData] = useState({}); // Spot data to edit

  const renterId = sessionStorage.getItem("userId"); // Fetch renterId from session storage

  // Fetch parking locations for the logged-in renter
  const fetchParkingLocations = async () => {
    if (!renterId) return; // Ensure renterId is present
    try {
      const response = await axios.get(
        `http://localhost:8080/api/parkinglocation/renter/${renterId}`
      );
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching parking locations:", error);
    }
  };

  // Fetch parking spots for a specific location
  const fetchParkingSpots = async (locationId) => {
    if (!locationId) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/api/parkingspot/location/${locationId}`
      );
      setSpots(response.data);
      setSelectedLocation(locationId);
    } catch (error) {
      console.error("Error fetching parking spots:", error);
    }
  };

  // Delete a parking location
  const deleteParkingLocation = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/parkinglocation/${id}`);
      fetchParkingLocations(); // Refresh locations after deletion
    } catch (error) {
      console.error("Error deleting parking location:", error);
    }
  };

  // Delete a parking spot
  const deleteParkingSpot = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/parkingspot/${id}`);
      fetchParkingSpots(selectedLocation); // Refresh spots for the selected location
    } catch (error) {
      console.error("Error deleting parking spot:", error);
    }
  };

  // Edit and update a parking location
  const editParkingLocation = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/parkinglocation/${editLocationData.id}`,
        editLocationData
      );
      fetchParkingLocations(); // Refresh locations after update
      setIsEditingLocation(false); // Close the edit form
    } catch (error) {
      console.error("Error editing parking location:", error);
    }
  };

  // Edit and update a parking spot
  const editParkingSpot = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/parkingspot/${editSpotData.id}`,
        editSpotData
      );
      fetchParkingSpots(selectedLocation); // Refresh spots after update
      setIsEditingSpot(false); // Close the edit form
    } catch (error) {
      console.error("Error editing parking spot:", error);
    }
  };

  // Fetch parking locations on component load
  useEffect(() => {
    fetchParkingLocations();
  }, []);

  return (
    <Container sx={{ mt: 4, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
          Your Parking Locations
        </Typography>
        {renterId ? (
          <List>
            {locations.map((location) => (
              <Box key={location.id}>
                <ListItem
                  sx={{
                    justifyContent: "center", // Center the list items
                  }}
                >
                  <ListItemText
                    primary={`${location.street}, ${location.city}`}
                    secondary={`${location.state},${location.postalcode}`}
                  />
                  <Button
                    variant="contained"
                    color="black"
                    onClick={() => fetchParkingSpots(location.id)}
                    sx={{ mr: 2 }}
                  >
                    View Spots
                  </Button>
                  <Button
                    variant="contained"
                    color="black"
                    onClick={() => deleteParkingLocation(location.id)}
                    sx={{ mr: 2 }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="black"
                    onClick={() => {
                      setIsEditingLocation(true);
                      setEditLocationData(location);
                    }}
                  >
                    Edit
                  </Button>
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        ) : (
          <Typography>Please log in to view your parking locations.</Typography>
        )}

        {/* Edit Parking Location Form */}
        {isEditingLocation && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Edit Parking Location</Typography>
            <TextField
              fullWidth
              label="Street"
              value={editLocationData.street || ""}
              onChange={(e) =>
                setEditLocationData({
                  ...editLocationData,
                  street: e.target.value,
                })
              }
              sx={{ my: 2 }}
            />
            <Button
              variant="contained"
              onClick={editParkingLocation}
              color="success"
            >
              Save
            </Button>
          </Box>
        )}

        {/* Parking Spots Section */}
        {selectedLocation && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5">Parking Spots</Typography>
            <List>
              {spots.map((spot) => (
                <Box key={spot.id}>
                  <ListItem>
                    <ListItemText primary={`Price: $${spot.pricePerHour}`} />
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => deleteParkingSpot(spot.id)}
                      sx={{ mr: 2 }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setIsEditingSpot(true);
                        setEditSpotData(spot);
                      }}
                    >
                      Edit
                    </Button>
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          </Box>
        )}

        {/* Edit Parking Spot Form */}
        {isEditingSpot && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Edit Parking Spot</Typography>
            <TextField
              fullWidth
              label="Price per Hour"
              type="number"
              value={editSpotData.pricePerHour || ""}
              onChange={(e) =>
                setEditSpotData({
                  ...editSpotData,
                  pricePerHour: e.target.value,
                })
              }
              sx={{ my: 2 }}
            />
            <Button
              variant="contained"
              onClick={editParkingSpot}
              color="success"
            >
              Save
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default EditDeleteParkingLocation;
