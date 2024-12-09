import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  FormControl,
  RadioGroup,
  Radio,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const PostParkingLocation = () => {
  const [locationDetails, setLocationDetails] = useState({
    street: "",
    city: "Boston",
    state: "MA",
    country: "USA",
    postalcode: "",
    renterId: sessionStorage.getItem("userId") || null,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageName, setImageName] = useState("");
  const [spots, setSpots] = useState([
    {
      id: Date.now(),
      isAvailable: true,
      pricePerHour: 0,
      spotNumber: "",
      spotType: "",
    },
  ]); // Initial spot
  const [openDialog, setOpenDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocationDetails({ ...locationDetails, [name]: value });
  };

  const handleSpotChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newSpots = [...spots];
    if (name === "pricePerHour") {
      newSpots[index][name] = parseFloat(value);
    } else {
      newSpots[index][name] = type === "checkbox" ? checked : value;
    }
    setSpots(newSpots);
  };

  const addSpot = () => {
    setSpots([
      ...spots,
      {
        id: Date.now(),
        isAvailable: true,
        pricePerHour: 0,
        spotNumber: "",
        spotType: "",
      },
    ]);
  };

  const removeSpot = (index) => {
    const newSpots = spots.filter((_, i) => i !== index);
    setSpots(newSpots);
  };

  // Convert file to base64 string
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Convert the file to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result.split(",")[1]); // Extract the base64 string
    };
    reader.readAsDataURL(file);
    setImageName(file ? file.name : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!imageBase64) {
      setOpenErrorDialog(true);
      return;
    }

    const postData = {
      uploadImage: imageBase64,
      street: locationDetails.street,
      city: locationDetails.city,
      state: locationDetails.state,
      country: locationDetails.country,
      postalcode: locationDetails.postalcode,
      renterId: locationDetails.renterId,
      parkingSpots: spots,
    };

    // Send the data as JSON
    axios
      .post("http://localhost:8080/api/parkinglocation", postData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setOpenDialog(true);
        resetForm();
      })
      .catch((error) => {
        console.error("Error posting parking location:", error);
      });
  };

  const resetForm = () => {
    setLocationDetails({
      street: "",
      city: "Boston",
      state: "MA",
      country: "USA",
      postalcode: "",
      renterId: sessionStorage.getItem("userId") || null,
    });
    setImageFile(null);
    setImageBase64(null);
    setImageName("");
    setSpots([
      {
        id: Date.now(),
        isAvailable: true,
        pricePerHour: "",
        spotNumber: "",
        spotType: "",
      },
    ]);
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false);
  };

  return (
    <DashboardLayout>
      <Grid item xs={12} sm={8} md={6}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Post a Parking Location
            </Typography>
            <div
              style={{
                height: "200px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src="images/parking-banner.jpg"
                alt="Image not available"
                style={{
                  width: "100%",
                  height: "auto",
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            </div>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Street"
                name="street"
                value={locationDetails.street}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="City"
                name="city"
                value={locationDetails.city}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                disabled
              />
              <TextField
                label="State"
                name="state"
                value={locationDetails.state}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                disabled
              />
              <TextField
                label="Country"
                name="country"
                value={locationDetails.country}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                disabled
              />
              <TextField
                label="Postal Code"
                name="postalcode"
                value={locationDetails.postalcode}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                style={{ marginTop: "20px", color: "white" }}
              >
                Upload Image
                <input
                  type="file"
                  accept=".jpg"
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
              {imageName && (
                <Typography variant="body2" style={{ marginTop: "10px" }}>
                  {imageName} uploaded
                </Typography>
              )}
              <Typography
                variant="h6"
                gutterBottom
                style={{ marginBottom: "32px", marginTop: "24px" }}
              >
                Parking Spots
              </Typography>
              {spots.map((spot, index) => (
                <Grid
                  container
                  spacing={2}
                  key={spot.id}
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <Grid item xs={6}>
                    <TextField
                      label="Spot Number"
                      name="spotNumber"
                      value={spot.spotNumber}
                      onChange={(e) => handleSpotChange(index, e)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Price per Hour ($)"
                      name="pricePerHour"
                      type="number"
                      value={spot.pricePerHour}
                      onChange={(e) => handleSpotChange(index, e)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        name="spotType"
                        value={spot.spotType}
                        onChange={(e) => handleSpotChange(index, e)}
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
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={spot.isAvailable}
                          onChange={(e) => handleSpotChange(index, e)}
                          name="isAvailable"
                        />
                      }
                      label="Available"
                    />
                  </Grid>
                  <Grid container item xs={4} justifyContent="flex-end">
                    <IconButton
                      color="error"
                      onClick={() => removeSpot(index)}
                      disabled={spots.length <= 1}
                      style={{ marginTop: "16px" }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="contained"
                onClick={addSpot}
                style={{ marginTop: "16px", color: "white" }}
              >
                Add Another Spot
              </Button>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{
                    marginLeft: "10px",
                    color: "white",
                  }}
                >
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Typography>
            Your parking location has been successfully posted!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>Please upload an image before submitting.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default PostParkingLocation;
