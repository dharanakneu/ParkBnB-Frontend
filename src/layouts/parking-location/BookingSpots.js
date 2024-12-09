/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Grid,
} from "@mui/material";

const BookingSpots = ({
  open,
  onClose,
  spotId,
  spotNumber,
  locationId,
  pricePerHour,
  renteeId,
}) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeSlots] = useState(generateTimeSlots());

  // Generate time slots (e.g., "08:00", "09:00")
  function generateTimeSlots() {
    const slots = [];
    for (let hour = 8; hour <= 19; hour++) {
      slots.push(`${hour}:00`);
    }
    return slots;
  }

  // Validate that end time is greater than start time
  const isValidTimeRange = () => {
    if (!startTime || !endTime) return false;
    return timeSlots.indexOf(endTime) > timeSlots.indexOf(startTime);
  };

  // Handle confirmation and redirect to payment
  const handleConfirmBooking = () => {
    if (selectedDate && startTime && endTime && isValidTimeRange()) {
      navigate("/paymentMethod", {
        state: {
          date: selectedDate,
          startTime,
          endTime,
          pricePerHour,
          locationId,
          spotId,
        },
      });
    } else {
      alert("Please fill all fields and ensure end time is after start time.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h5" component="div" align="center">
          Book Parking Spot
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Parking Spot Number: <strong>{spotNumber}</strong>
            </Typography>
            <Typography variant="subtitle1">
              Price/Hour: <strong>${pricePerHour}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Select Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography>Select Start Time</Typography>
            <Select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              fullWidth
              style={{
                fontSize: "1.2rem", // Larger font size
                padding: "10px", // Add padding
              }}
            >
              <MenuItem value="" disabled>
                Select Start Time
              </MenuItem>
              {timeSlots.map((slot, index) => (
                <MenuItem key={index} value={slot}>
                  {slot}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Typography>Select End Time</Typography>
            <Select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              fullWidth
              style={{
                fontSize: "1.2rem", // Larger font size
                padding: "10px", // Add padding
              }}
            >
              <MenuItem value="" disabled>
                Select End Time
              </MenuItem>
              {timeSlots.map((slot, index) => (
                <MenuItem key={index} value={slot}>
                  {slot}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          {!isValidTimeRange() && startTime && endTime && (
            <Grid item xs={12}>
              <Typography color="error">
                End time must be after the start time.
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#8BC34A", // Light green color
            color: "#FFFFFF", // White text color
          }}
          onClick={handleConfirmBooking}
        >
          Confirm Booking
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingSpots;
