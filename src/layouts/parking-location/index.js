import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const ParkingLocation = () => {
  const { id } = useParams();
  const [locationDetails, setLocationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkedSpots, setLinkedSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState("");

  useEffect(() => {
    // Fetch parking location details from API
    const fetchLocationDetails = async () => {
      try {
        const response = await fetch(`/api/parkinglocation/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLocationDetails(data);

        // Fetch linked spots based on the location ID
        const spotsResponse = await fetch(
          `/api/parkinglocation/${id}/available-spots`
        );
        if (!spotsResponse.ok) {
          throw new Error(`HTTP error! status: ${spotsResponse.status}`);
        }
        const spotsData = await spotsResponse.json();
        setLinkedSpots(spotsData); // Set linked spots data
      } catch (error) {
        console.error("Error fetching parking location details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationDetails();
  }, [id]);

  if (loading) {
    return <CircularProgress />; // Show loading state
  }

  if (!locationDetails) {
    return (
      <Grid container justifyContent="center" style={{ paddingTop: "64px" }}>
        <Grid item>
          <Typography>No details found for this parking location.</Typography>
        </Grid>
      </Grid>
    );
  }

  // Construct the full image URL
  const imageUrl = `http://localhost:8080/${locationDetails.parkingLocationImage}`;

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      style={{ padding: "20px", marginLeft: "80px" }}
    >
      <Grid item xs={12} sm={12} md={10} lg={10}>
        <Card
          variant="outlined"
          style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}
        >
          <CardContent>
            <Typography
              variant="h4"
              gutterBottom
              style={{ marginBottom: "30px" }}
            >
              Parking Location Details
            </Typography>
            {locationDetails.parkingLocationImage && ( // Check if the image URL exists
              <img
                src={imageUrl} // Use the constructed image URL
                alt="Parking Location"
                style={{ width: "100%", height: "auto", marginBottom: "20px" }} // Responsive image
              />
            )}
            <Typography variant="h6" style={{ marginBottom: "10px" }}>
              Address:
            </Typography>
            <Typography variant="body1">
              <strong>Street:</strong> {locationDetails.street}
            </Typography>
            <Typography variant="body1">
              <strong>City:</strong> {locationDetails.city}
            </Typography>
            <Typography variant="body1">
              <strong>State:</strong> {locationDetails.state}
            </Typography>
            <Typography variant="body1">
              <strong>Country:</strong> {locationDetails.country}
            </Typography>
            <Typography variant="body1">
              <strong>Postal Code:</strong> {locationDetails.postalcode}
            </Typography>

            {/* Radio buttons for linked spots */}
            <Typography variant="h6" style={{ marginTop: "40px" }}>
              Select Parking Spot:
            </Typography>
            {linkedSpots.length > 0 ? (
              <RadioGroup
                value={selectedSpot}
                onChange={(e) => setSelectedSpot(e.target.value)}
              >
                {linkedSpots.map((spot) => (
                  <FormControlLabel
                    key={spot.id}
                    value={spot.id}
                    control={<Radio />}
                    label={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <strong style={{ marginRight: "10px" }}>
                          {spot.spotNumber}
                        </strong>
                        <div style={{ marginRight: "10px" }}>
                          Type: {spot.spotType}
                        </div>
                        <div>Price/hr: ${spot.pricePerHour}</div>
                      </div>
                    }
                  />
                ))}
              </RadioGroup>
            ) : (
              <Typography>No available spots.</Typography>
            )}

            {/* Button container aligned to the right */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <Button
                variant="contained"
                style={{ backgroundColor: "#4CAF50", color: "white" }}
                disabled={!selectedSpot}
              >
                Book Spot
              </Button>
              <Button
                variant="contained"
                color="secondary"
                style={{ marginLeft: "10px", color: "white" }}
              >
                Back to List
              </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ParkingLocation;
