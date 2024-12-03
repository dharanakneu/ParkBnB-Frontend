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
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";

const Reservations = () => {
  const renteeId = sessionStorage.getItem("userId");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/reservations/rentee/${renteeId}`
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
          (error) => reject(error)
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
                                    .longitude
                                )
                              }
                            >
                              Navigate to Location
                            </Button>
                          )}
                          <Button size="small">Leave a Review</Button>
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
    </DashboardLayout>
  );
};

export default Reservations;
