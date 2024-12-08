import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  Button,
  TextField,
  IconButton,
  Box,
  Divider,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

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

  const toggleEditSpot = async (spot) => {
    if (isEditingSpot && editSpotData.id === spot.id) {
      setIsEditingSpot(false);
      setEditSpotData({});
    } else {
      setIsEditingSpot(true);

      // Fetch the latest parking spots data
      await fetchParkingSpots();

      // Now set the spot data for editing
      const updatedSpot = spots.find((s) => s.id === spot.id); // Find the recently fetched spot
      setEditSpotData({
        ...updatedSpot,
        isAvailable: updatedSpot.available ?? false, // Ensure availability field is set
      });
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
  const deleteParkingSpot = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/parkingspot/${id}`);
      // fetchParkingSpots(selectedLocation);
      setSpots((prevSpots) => prevSpots.filter((spot) => spot.id !== id));
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
      console.log("Submitting edit spot data:", editSpotData); // Log data being sent

      // Map isAvailable to available before sending the request
      const spotData = {
        ...editSpotData,
        available: editSpotData.isAvailable, // Map frontend's isAvailable to backend's available
      };

      // Send data to the backend
      await axios.put(
        `http://localhost:8080/api/parkingspot/${editSpotData.id}`,
        spotData // Send mapped data
      );

      // Fetch the updated parking spots and hide the form
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
    <DashboardLayout>
      <Container sx={{ mt: 4, mb: 2 }}>
        <Card sx={{ pt: 4, pb: 10, backgroundColor: "white", boxShadow: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
              Your Parking Locations
            </Typography>
            {renterId ? (
              <List>
                {locations.map((location) => (
                  <Box
                    key={location.id}
                    sx={{ mb: 2, p: 2, borderRadius: 2, boxShadow: 3 }}
                  >
                    <ListItem
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ mr: 32 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          <LocationOnIcon
                            fontSize="small"
                            sx={{ mr: 1, color: "#3f51b5" }}
                          />
                          {location.street}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {location.city}, {location.state},{" "}
                          {location.postalcode}
                        </Typography>
                      </Box>
                      <Box>
                        <Button
                          startIcon={
                            selectedLocation === location.id ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )
                          }
                          onClick={() => fetchParkingSpots(location.id)}
                          sx={{
                            mr: 1,
                            backgroundColor: "#e3f2fd", // Light blue
                            color: "#0d47a1", // Dark blue text
                            border: "1px solid #0d47a1", // Matching border color
                            "&:hover": {
                              backgroundColor: "#bbdefb", // Slightly darker blue on hover
                              border: "1px solid #0d47a1",
                            },
                          }}
                          variant="outlined"
                        >
                          {selectedLocation === location.id
                            ? "Hide Spots"
                            : "View Spots"}
                        </Button>
                        <IconButton
                          color="error"
                          onClick={() => deleteParkingLocation(location.id)}
                          sx={{ mr: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => toggleEditLocation(location)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            ) : (
              <Typography>
                Please log in to view your parking locations.
              </Typography>
            )}

            {/* Edit Parking Location Form */}
            {isEditingLocation && (
              <Box sx={{ mt: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">Edit Parking Location</Typography>
                  <IconButton
                    onClick={() => {
                      setIsEditingLocation(false);
                      setEditLocationData({});
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
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
                <Typography variant="h5" sx={{ mb: 1 }}>
                  Parking Spots
                </Typography>
                <List>
                  {spots.map((spot) => (
                    <Box
                      key={spot.id}
                      sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}
                    >
                      <ListItem
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box sx={{ mr: 32 }}>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Spot Number: {spot.spotNumber}, Type:{" "}
                            {spot.spotType}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Price: ${spot.pricePerHour}
                          </Typography>
                        </Box>
                        <Box>
                          <IconButton
                            color="error"
                            onClick={() => deleteParkingSpot(spot.id)}
                            sx={{ mr: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            color="primary"
                            onClick={() => toggleEditSpot(spot)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                    </Box>
                  ))}
                </List>
              </Box>
            )}

            {/* Edit Parking Spot Form */}
            {isEditingSpot && (
              <Box sx={{ mt: 4, p: 6 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">Edit Parking Spot</Typography>
                  <IconButton
                    onClick={() => {
                      setIsEditingSpot(false);
                      setEditSpotData({});
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
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
                <FormControl fullWidth>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="caption"
                      sx={{ mr: 2, fontWeight: "bold" }}
                    >
                      Spot Type:
                    </Typography>
                    <RadioGroup
                      value={editSpotData.spotType || ""}
                      onChange={(e) =>
                        setEditSpotData({
                          ...editSpotData,
                          spotType: e.target.value,
                        })
                      }
                      row
                    >
                      <FormControlLabel
                        value="2 Wheeler"
                        control={<Radio />}
                        label="2 Wheeler"
                      />
                      <FormControlLabel
                        value="4 Wheeler"
                        control={<Radio />}
                        label="4 Wheeler"
                      />
                    </RadioGroup>
                  </Box>
                </FormControl>
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
                <FormControl fullWidth>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="caption"
                      sx={{ mr: 2, fontWeight: "bold" }}
                    >
                      Availability
                    </Typography>
                    <RadioGroup
                      value={editSpotData.isAvailable ? "Yes" : "No"} // Keep using isAvailable in frontend state
                      onChange={(e) => {
                        const isAvailable = e.target.value === "Yes"; // Convert Yes/No to boolean
                        setEditSpotData((prevData) => ({
                          ...prevData,
                          isAvailable, // Set isAvailable directly
                        }));
                      }}
                      row
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </Box>
                </FormControl>
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
        </Card>
      </Container>
    </DashboardLayout>
  );
}

export default EditDeleteParkingLocation;
