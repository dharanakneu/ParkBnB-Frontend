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

const Receipt = ({ open, paymentData, onClose }) => {
  if (!paymentData) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
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
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            Royal Valet Parking
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Hill Park Ave, New York, NY, USA
          </Typography>
          <Typography variant="body2" color="textSecondary">
            888-888-8888
          </Typography>
          <Divider sx={{ my: 2 }} />

          {/* Time and Date */}
          <Typography variant="h4" sx={{ mb: 1 }}>
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {new Date().toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Space: {paymentData.parkingSpace || "621"}
          </Typography>
        </Box>

        {/* Payment Details */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Paid: ${paymentData.amount.toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Thank You Message */}
        <Box sx={{ textAlign: "center", paddingTop: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            THANK YOU AND DRIVE SAFELY!
          </Typography>
        </Box>

        {/* Barcode
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <svg
            viewBox="0 0 100 20"
            width="100%"
            height="50"
            style={{ margin: "0 auto" }}
          >
            <rect x="0" y="0" width="100" height="20" fill="black" />
          </svg>
        </Box> */}
      </DialogContent>
      <DialogActions>
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
    parkingSpace: PropTypes.string,
    amount: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Receipt;
