import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  Button,
  CircularProgress,
  Modal,
  Box,
  TextField,
  Rating,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const Reservations = () => {
  const renteeId = sessionStorage.getItem("userId");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Modal state
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedReservation, setSelectedReservation] = useState(null);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/reservations/rentee/${renteeId}`,
      );
      setReservations(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setReservations([]);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [renteeId]);

  const handleOpen = (reservation) => {
    setSelectedReservation(reservation);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRating(0);
    setComment("");
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:8080/api/reviews`, {
        rating,
        comment,
        parkingLocationId: selectedReservation.parkingSpot.parkingLocation.id,
        renteeId: renteeId,
      });
      handleClose(); // Close the modal after submission
      // Optionally, refresh the reservations or show a success message
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => reject(error),
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

  const openGoogleMapsDirections = async (destinationLat, destinationLng) => {
    setLocationLoading(true);
    try {
      const origin = await getCurrentLocation();
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destinationLat},${destinationLng}&travelmode=driving`;
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setLocationLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <CircularProgress />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Typography color="error">
          Error fetching reservations: {error}
        </Typography>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Grid item xs={10}>
        <Typography variant="h5" gutterBottom>
          My Parking Reservations
        </Typography>
        {reservations.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            You have not reserved any spots yet.
          </Typography>
        ) : (
          <List style={{ marginTop: "16px" }}>
            {reservations.map((reservation) => (
              <ListItem key={reservation.id} style={{ marginBottom: "16px" }}>
                <Card
                  variant="outlined"
                  style={{ width: "100%", marginRight: "24px" }}
                >
                  <Grid container>
                    <Grid item xs={4}>
                      <CardMedia
                        sx={{ height: 140 }}
                        image={`http://localhost:8080/${reservation.parkingSpot.parkingLocation.parkingLocationImage}`}
                        title="parking location"
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          Status: {reservation.status}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Spot Number: {reservation.parkingSpot.spotNumber}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Address:{" "}
                          {reservation.parkingSpot.parkingLocation.street},{" "}
                          {reservation.parkingSpot.parkingLocation.city},{" "}
                          {reservation.parkingSpot.parkingLocation.state}{" "}
                          {reservation.parkingSpot.parkingLocation.postalcode},{" "}
                          {reservation.parkingSpot.parkingLocation.country}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          From:{" "}
                          {new Date(reservation.startTime).toLocaleString()},
                          To: {new Date(reservation.endTime).toLocaleString()}
                        </Typography>
                        <CardActions
                          style={{
                            justifyContent: "flex-end",
                            display: "flex",
                          }}
                        >
                          {locationLoading ? (
                            <CircularProgress size={24} />
                          ) : (
                            <Button
                              size="small"
                              onClick={() =>
                                openGoogleMapsDirections(
                                  reservation.parkingSpot.parkingLocation
                                    .latitude,
                                  reservation.parkingSpot.parkingLocation
                                    .longitude,
                                )
                              }
                            >
                              Navigate to Location
                            </Button>
                          )}
                          <Button
                            size="small"
                            onClick={() => handleOpen(reservation)}
                          >
                            Leave a Review
                          </Button>
                        </CardActions>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </ListItem>
            ))}
          </List>
        )}
      </Grid>

      {/* Modal for Review */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: -2 }}
          >
            <Typography variant="h6" component="h2">
              Leave a Review
            </Typography>
            <IconButton onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
          <Rating
            name="rating"
            value={rating}
            precision={0.5}
            sx={{ mt: 1 }}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <TextField
            label="Comment"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 0 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 3 }}
            style={{ color: "white" }}
          >
            Submit Review
          </Button>
        </Box>
      </Modal>
    </DashboardLayout>
  );
};

export default Reservations;
