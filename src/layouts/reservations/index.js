import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";

const Reservations = () => {
  const renteeId = 1;
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchReservations();
  }, [renteeId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography color="error">
        Error fetching reservations: {error}
      </Typography>
    );
  }

  return (
    <Grid container style={{ padding: "20px", marginTop: "20px" }}>
      <Grid item xs={2.5}>
        {/* This can be for a sidebar if needed */}
      </Grid>
      <Grid item xs={9.5}>
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
                <CardContent>
                  <Typography variant="h6" component="div">
                    Status: {reservation.status}
                  </Typography>
                  <Typography color="text.secondary">
                    Start Time: {reservation.startTime}
                  </Typography>
                  <Typography color="text.secondary">
                    End Time: {reservation.endTime}
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default Reservations;
