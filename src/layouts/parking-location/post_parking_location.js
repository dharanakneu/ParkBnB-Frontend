import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const PostParkingLocation = () => {
  const [locationDetails, setLocationDetails] = useState({
    street: "",
    city: "Boston",
    state: "MA",
    country: "USA",
    postalcode: "",
    renterId: sessionStorage.getItem("userId"),
  });
  const [imageFile, setImageFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocationDetails({ ...locationDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    if (!imageFile) {
      console.error("No image file selected");
      return;
    }

    const formData = new FormData();
    formData.append("uploadImage", imageFile);
    formData.append("street", locationDetails.street);
    formData.append("city", locationDetails.city);
    formData.append("state", locationDetails.state);
    formData.append("country", locationDetails.country);
    formData.append("postalcode", locationDetails.postalcode);
    formData.append("renterId", locationDetails.renterId);

    axios
      .post("http://localhost:8080/api/parkinglocation", formData)
      .then((response) => {
        console.log("Parking location posted:", response.data);
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
      renterId: 2,
    });
    setImageFile(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
                value="Boston"
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                disabled
              />
              <TextField
                label="State"
                name="state"
                value="MA"
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                disabled
              />
              <TextField
                label="Country"
                name="country"
                value="USA"
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
                <VisuallyHiddenInput
                  type="file"
                  accept=".jpg"
                  onChange={handleFileChange}
                  required
                />
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
    </DashboardLayout>
  );
};

export default PostParkingLocation;
