/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Divider,
  Box,
} from "@mui/material";
import generateReceiptPDF from "./generateReceipt"; // Import the receipt generation function

const Receipt = ({ open, paymentData, onClose }) => {
  if (!paymentData) return null;

  // Handle the download of the receipt
  const handleDownload = () => {
    generateReceiptPDF(paymentData);
  };

  // eslint-disable-next-line prettier/prettier, react/prop-types
  const { renteeDetails, amount, parkingDetails, spotDetails, date, startTime, endTime } =
  paymentData;
  console.log(paymentData);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle align="center">PARKING RECEIPT</DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center", paddingBottom: 2 }}>
          {/* Car Icon */}
          <Box sx={{ mb: 2 }}>
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              style={{ margin: "0 auto" }}
            >
              <path
                fill="currentColor"
                d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"
              />
            </svg>
          </Box>
          <Typography variant="h2" fontWeight="bold" sx={{ mb: 1 }}>
            <strong>Park BnB</strong>
          </Typography>

          {/* Parking Location Details */}
          {renteeDetails && (
            <Box sx={{ textAlign: "left", mb: 2 }}>
              <Typography variant="body2">
                Name - {renteeDetails.firstName + " " + renteeDetails.lastName}
              </Typography>
              <Typography variant="body2">
                Email - {renteeDetails.email}
              </Typography>
              <Typography variant="body2">
                Number - {renteeDetails.phone}
              </Typography>
            </Box>
          )}
          <Divider sx={{ my: 2 }} />

          {/* Parking Location Details */}
          {parkingDetails && (
            <Box sx={{ textAlign: "left", mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Parking Location:
              </Typography>
              <Typography variant="body2">
                {parkingDetails.street}, {parkingDetails.city},{" "}
                {parkingDetails.state}, {parkingDetails.country},{" "}
                {parkingDetails.zipCode}
              </Typography>
            </Box>
          )}

          {/* Parking Spot Details */}
          {spotDetails && (
            <Box sx={{ textAlign: "left", mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Parking Spot:
              </Typography>
              <Typography variant="body2">
                Spot Number: {spotDetails.spotNumber} <br />
                Spot Type: {spotDetails.spotType}
              </Typography>
            </Box>
          )}

          {/* Time and Date */}
          <Box sx={{ textAlign: "left", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Parking Time:
            </Typography>
            <Typography variant="body2">
              Date: {date} <br />
              Start Time: {startTime} <br />
              End Time: {endTime}
            </Typography>
          </Box>

          {/* Payment Details */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              Total Paid: ${amount.toFixed(2)}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Thank You Message */}
          <Box sx={{ textAlign: "center", paddingTop: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              THANK YOU AND DRIVE SAFELY!
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDownload} color="primary">
          Download
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Define PropTypes for validation
Receipt.propTypes = {
  open: PropTypes.bool.isRequired,
  paymentData: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    parkingDetails: PropTypes.shape({
      street: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      zipCode: PropTypes.string,
    }),
    spotDetails: PropTypes.shape({
      spotNumber: PropTypes.string.isRequired,
      spotType: PropTypes.string.isRequired,
    }),
    date: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Receipt;
