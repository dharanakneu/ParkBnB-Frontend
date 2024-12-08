import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
  Rating,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const ParkingLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [locationDetails, setLocationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkedSpots, setLinkedSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/parkinglocation/${id}`)
      .then((response) => {
        console.log("Parking location data:", response.data);
        setLocationDetails(response.data);
      })
      .catch((error) =>
        console.error("Error fetching parking location data:", error)
      );

    axios
      .get(`http://localhost:8080/api/parkinglocation/${id}/available-spots`)
      .then((response) => {
        console.log("Available spots data:", response.data);
        setLinkedSpots(response.data);
      })
      .catch((error) =>
        console.error(
          "Error fetching linked available parking spots data:",
          error
        )
      );

    axios
      .get(`http://localhost:8080/api/parkinglocation/${id}/reviews`)
      .then((response) => {
        console.log("Reviews data:", response.data);
        setReviews(response.data);
      })
      .catch((error) => console.error("Error fetching reviews data:", error))
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <CircularProgress />
      </DashboardLayout>
    ); // Show loading state
  }

  if (!locationDetails) {
    return (
      <DashboardLayout>
        <Grid container justifyContent="center" style={{ paddingTop: "64px" }}>
          <Grid item>
            <Typography>No details found for this parking location.</Typography>
          </Grid>
        </Grid>
      </DashboardLayout>
    );
  }

  // Construct the full image URL
  const imageUrl = `http://localhost:8080/${locationDetails.parkingLocationImage}`;

  const handleBookSpot = () => {
    if (selectedSpot) {
      navigate("/PaymentMethod", { state: { selectedSpot } });
    } else {
      alert("Please select a parking spot before booking.");
    }
  };

  return (
    <DashboardLayout>
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
            <Grid container spacing={6} style={{ marginBottom: "20px" }}>
              <Grid item xs={12} md={6}>
                {locationDetails.parkingLocationImage ? ( // Check if the image URL exists
                  <img
                    src={imageUrl} // Use the constructed image URL
                    alt="Parking Location"
                    style={{ width: "100%", height: "auto" }} // Responsive image
                  />
                ) : (
                  <Typography variant="body1">No image available.</Typography> // Fallback message
                )}
              </Grid>
              <Grid item xs={12} md={6}>
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
              </Grid>
            </Grid>

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

            {/* Reviews Section */}
            <Typography
              variant="h6"
              style={{ marginTop: "40px", marginBottom: "10px" }}
            >
              Reviews:
            </Typography>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Card
                  variant="outlined"
                  key={review.id}
                  elevation={0}
                  sx={{
                    border: "1px solid #e0e0e0",
                    marginBottom: "10px",
                    boxShadow: "none",
                  }}
                >
                  <CardContent>
                    <Typography
                      gutterBottom
                      sx={{
                        color: "text.secondary",
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {review.renteeName}
                      <Rating
                        name="read-only"
                        value={review.rating}
                        readOnly
                        style={{ marginLeft: "10px" }}
                      />
                    </Typography>
                    <Typography sx={{ color: "text.primary", fontSize: 15 }}>
                      {review.comment}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No reviews available.</Typography>
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
                onClick={handleBookSpot}
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
    </DashboardLayout>
  );
};

export default ParkingLocation;
