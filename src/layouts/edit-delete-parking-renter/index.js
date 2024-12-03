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
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editLocationData, setEditLocationData] = useState({});
  const [isEditingSpot, setIsEditingSpot] = useState(false);
  const [editSpotData, setEditSpotData] = useState({});
  const renterId = sessionStorage.getItem("userId");

  // Fetch parking locations for the logged-in renter
  const fetchParkingLocations = async () => {
    if (!renterId) return;
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
    if (selectedLocation === locationId) {
      // Toggle visibility by clearing state
      setSpots([]);
      setSelectedLocation(null);
      return;
    }
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

  // Toggle edit form for a location
  const toggleEditLocation = (location) => {
    if (isEditingLocation && editLocationData.id === location.id) {
      setIsEditingLocation(false);
      setEditLocationData({});
    } else {
      setIsEditingLocation(true);
      setEditLocationData(location);
    }
  };

  // Toggle edit form for a parking spot
  const toggleEditSpot = (spot) => {
    if (isEditingSpot && editSpotData.id === spot.id) {
      setIsEditingSpot(false);
      setEditSpotData({});
    } else {
      setIsEditingSpot(true);
      setEditSpotData(spot);
    }
  };

  // Delete a parking location
  const deleteParkingLocation = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/parkinglocation/${id}`);
      fetchParkingLocations();
      if (selectedLocation === id) {
        setSpots([]);
        setSelectedLocation(null);
      }
    } catch (error) {
      console.error("Error deleting parking location:", error);
    }
  };

  // Delete a parking spot
  const deleteParkingSpot = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/parkingspot/${id}`);
      fetchParkingSpots(selectedLocation);
    } catch (error) {
      console.error("Error deleting parking spot:", error);
    }
  };

  // Edit a parking location
  const editParkingLocation = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/parkinglocation/${editLocationData.id}`,
        editLocationData
      );
      fetchParkingLocations();
      setIsEditingLocation(false);
    } catch (error) {
      console.error("Error editing parking location:", error);
    }
  };

  // Edit a parking spot
  const editParkingSpot = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/parkingspot/${editSpotData.id}`,
        editSpotData
      );
      fetchParkingSpots(selectedLocation);
      setIsEditingSpot(false);
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
                <ListItem sx={{ justifyContent: "center" }}>
                  <ListItemText
                    primary={`${location.street}, ${location.city}`}
                    secondary={`${location.state}, ${location.postalcode}`}
                  />
                  <Button
                    variant="contained"
                    color="black"
                    onClick={() => fetchParkingSpots(location.id)}
                    sx={{ mr: 2 }}
                  >
                    {selectedLocation === location.id
                      ? "Hide Spots"
                      : "View Spots"}
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
                    onClick={() => toggleEditLocation(location)}
                  >
                    {isEditingLocation && editLocationData.id === location.id
                      ? "Cancel Edit"
                      : "Edit"}
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
                    <ListItemText
                      primary={`Spot Number: ${spot.spotNumber}, Type: ${spot.spotType}`}
                      secondary={`Price: $${spot.pricePerHour}`}
                    />
                    <Button
                      variant="contained"
                      color="black"
                      onClick={() => deleteParkingSpot(spot.id)}
                      sx={{ mr: 2 }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="black"
                      onClick={() => toggleEditSpot(spot)}
                    >
                      {isEditingSpot && editSpotData.id === spot.id
                        ? "Cancel Edit"
                        : "Edit"}
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
              label="Spot Number"
              value={editSpotData.spotNumber || ""}
              onChange={(e) =>
                setEditSpotData({
                  ...editSpotData,
                  spotNumber: e.target.value,
                })
              }
              sx={{ my: 2 }}
            />
            <TextField
              fullWidth
              label="Spot Type"
              value={editSpotData.spotType || ""}
              onChange={(e) =>
                setEditSpotData({
                  ...editSpotData,
                  spotType: e.target.value,
                })
              }
              sx={{ my: 2 }}
            />
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
