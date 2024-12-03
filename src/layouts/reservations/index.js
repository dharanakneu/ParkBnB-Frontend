import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  CircularProgress,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";

const Reservations = () => {
  const renteeId = sessionStorage.getItem("userId");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/reservations/rentee/${renteeId}`
      );
      setReservations(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [renteeId]);

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
                        From: {new Date(reservation.startTime).toLocaleString()}
                        , To: {new Date(reservation.endTime).toLocaleString()}
                      </Typography>
                      <CardActions
                        style={{ justifyContent: "flex-end", display: "flex" }}
                      >
                        <Button size="small">Navigate</Button>
                        <Button size="small">Leave a Review</Button>
                      </CardActions>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </ListItem>
          ))}
        </List>
      </Grid>
    </DashboardLayout>
  );
};

export default Reservations;
