import React, { useState, useEffect } from "react";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import MDButton from "components/MDButton";
import "./index.css";
import Receipt from "./Receipt";

import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useLocation } from "react-router-dom";

// Images
import masterCardLogo from "assets/images/logos/mastercard.png";
import visaLogo from "assets/images/logos/visa.png";
// eslint-disable-next-line react/prop-types
const PaymentMethod = () => {
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isAddingCard, setIsAddingCard] = useState(false); // Track whether adding a new card
  const [paymentAmount, setPaymentAmount] = useState(10);
  const [cardType, setCardType] = useState(""); // For storing the selected card type
  const [cardHolderName, setCardholderName] = useState(""); // For storing the cardholder name
  const [renteeId] = useState(sessionStorage.getItem("userId")); // Example rentee ID
  const stripe = useStripe();
  const elements = useElements();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [paymentData, setPaymentData] = useState(null); // Store receipt data
  const location = useLocation();
  const [locationDetails, setLocationDetails] = useState(null);
  const [spotDetails, setSpotDetails] = useState(null);
  const [renteeDetails, setRenteeDetails] = useState(null);

  const { state } = location || {};
  const {
    date = "2025-01-01", // Default value for fallback
    startTime = "13:00", // Default value for fallback
    endTime = "14:00", // Default value for fallback
    pricePerHour = 15, // Default value for fallback
    locationId = null, // Default value for fallback
    spotId = null, // Default value for fallback
  } = state || {};

  useEffect(() => {
    const calculatedAmount = calculatePaymentAmount();
    setPaymentAmount(calculatedAmount);
  }, [date, startTime, endTime, pricePerHour]); // Dependencies for recalculating

  // Calculate payment amount
  const calculatePaymentAmount = () => {
    if (!date || !startTime || !endTime || !pricePerHour) return 0;

    // Combine the date with start and end times for proper parsing
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    console.log("Start Date Time: ", startDateTime);
    console.log("End Date Time: ", endDateTime);

    // Calculate the duration in milliseconds
    const duration = endDateTime - startDateTime;

    // Ensure the duration is valid
    if (duration <= 0) {
      console.error("Invalid time range. Start time must be before end time.");
      return 0;
    }

    // Convert duration to hours and calculate the amount
    const hours = Math.ceil(duration / (1000 * 60 * 60)); // Convert milliseconds to hours
    return hours * pricePerHour;
  };
  console.log("Payment Amount: ", paymentAmount);
  console.log(
    "testing  ",
    date,
    startTime,
    endTime,
    pricePerHour,
    locationId,
    spotId
  );

  useEffect(() => {
    fetchCards();

    axios
      .get(`http://localhost:8080/api/parkinglocation/${locationId}`)
      .then((response) => {
        console.log("Parking location data:", response.data);
        setLocationDetails(response.data);
      })
      .catch((error) =>
        console.error("Error fetching parking location data:", error)
      );

    axios
      .get(`http://localhost:8080/api/parkingspot/${spotId}`)
      .then((response) => {
        console.log("Parking location data:", response.data);
        setSpotDetails(response.data);
      })
      .catch((error) =>
        console.error("Error fetching parking location data:", error)
      );

    axios
      .get(`http://localhost:8080/api/rentees/${renteeId}`)
      .then((response) => {
        console.log("Rentee data", response.data);
        setRenteeDetails(response.data);
      })
      .catch((error) =>
        console.error("Error fetching parking location data:", error)
      );
  }, []);

  // Fetch saved cards from the API
  const fetchCards = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/cards/rentee/${renteeId}`
      );
      setSavedCards(response.data);
    } catch (error) {
      console.error("Error fetching saved cards", error);
    }
  };

  // Handle adding a new card
  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return; // Ensure Stripe and Elements are loaded
    }
    const cardElement = elements.getElement(CardElement);
    // Create a PaymentMethod for the card
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
    if (error) {
      console.error("Error creating PaymentMethod:", error);
      return;
    }
    console.log(paymentMethod);
    // Access card details from the PaymentMethod object
    const { card } = paymentMethod;
    const last4 = card.last4; // Last 4 digits
    const expiryDate = `${card.exp_month}/${card.exp_year}`; // Expiry date (MM/YY)
    const type = card.brand; // Card type (Visa, MasterCard, etc.)
    console.log(cardHolderName);
    try {
      const response = await axios.post("http://localhost:8080/api/cards", {
        last4,
        expiryDate,
        cardType: cardType || type, // Save the selected or auto-detected card type
        stripeCardId: paymentMethod.id,
        cardHolderName: cardHolderName,
        renteeId,
      });
      console.log("Card added:", response.data);
      fetchCards(); // Refresh the saved cards list
      setIsAddingCard(false); // Close the add card form
      setCardholderName(""); // Clear cardholder name field
      setCardType(""); // Clear card type field
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };
  // Handle selecting a card for payment
  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };
  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedCard) {
      alert("Please select a card for payment");
      return;
    }
    //console.log(selectedCard);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/payments/create",
        {
          amount: parseFloat(paymentAmount), // set static paying amount
          renteeId,
          paymentStatus: "Pending",
          stripePaymentId: selectedCard.stripeCardId,
          cardId: selectedCard.id, // Replace with actual Stripe ID
          cardholderName: selectedCard.cardHolderName,
        }
      );
      setPaymentData({
        renteeDetails: renteeDetails,
        amount: parseFloat(paymentAmount),
        parkingDetails: locationDetails,
        spotDetails: spotDetails,
        startTime: startTime,
        endTime: endTime,
        date: date,
      });
      // alert("Payment Successful!");
      setOpenReceiptDialog(true);
      console.log("Payment successful:", response.data);
    } catch (error) {
      console.log(error.response);

      // Extract the Stripe error message from the full error string
      const fullError = error.response?.data.toString(); // Ensure it's a string
      console.log(fullError);
      const messageMatch = fullError?.match(/Stripe error: (.*?);/); // Extract message between "Stripe error: " and ";"

      // Get the extracted message or use a fallback message
      const stripeErrorMessage = messageMatch
        ? messageMatch[1].trim()
        : "An unexpected error occurred.";
      console.log(messageMatch);

      // Set the formatted error message
      setErrorMessage(`Payment Failed: ${stripeErrorMessage}`);
      setErrorDialogOpen(true); // Open the error dialog
    }
  };
  return (
    <Card id="payment-method" className="cardGrid">
      {/* Error Dialog */}
      <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <DialogTitle>Error Processing Payment</DialogTitle>
        <DialogContent>
          <Typography>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <MDBox
        pt={2}
        px={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <MDTypography variant="h6" fontWeight="medium">
          Payment Method
        </MDTypography>
        <MDButton
          variant="gradient"
          color="dark"
          onClick={() => setIsAddingCard(true)} // Open the modal when clicked
        >
          <Icon sx={{ fontWeight: "bold" }}>add</Icon>
          &nbsp;add new card
        </MDButton>
      </MDBox>
      {/* Add New Card Modal */}
      <Dialog
        open={isAddingCard}
        onClose={() => setIsAddingCard(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Card</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddCard}>
            <TextField
              fullWidth
              label="Cardholder Name"
              value={cardHolderName}
              onChange={(e) => setCardholderName(e.target.value)}
              required
              className="form-field"
              style={{ marginBottom: "15px" }}
            />
            <TextField
              fullWidth
              select
              label="Card Type"
              value={cardType}
              onChange={(e) => setCardType(e.target.value)} // Set selected card type
              required
              className="form-field"
              style={{ marginBottom: "15px" }}
              InputProps={{
                style: {
                  height: "43px", // Consistent height for input area
                  padding: "14px 12px", // Adjust padding for text area within the input field
                },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: { maxHeight: 200 },
                  },
                },
              }}
            >
              <MenuItem value="">Select Card Type</MenuItem>
              <MenuItem value="Visa">Visa</MenuItem>
              <MenuItem value="MasterCard">MasterCard</MenuItem>
              <MenuItem value="Amex">Amex</MenuItem>
            </TextField>
            <Typography variant="body2" style={{ marginBottom: "10px" }}>
              Card Details:
            </Typography>
            {/* <CardElement
              className="card-element"
              options={{
                style: { base: { fontSize: "16px", color: "#424770" } },
              }}
            /> */}
            <CardElement
              className="card-element"
              options={{
                style: { base: { fontSize: "16px", color: "#424770" } },
              }} // Add the appearance object here
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!stripe}
              style={{ marginTop: "15px" }}
            >
              Add Card
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingCard(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Display Saved Cards */}
      <MDBox p={2}>
        <Grid container spacing={3}>
          {savedCards.length === 0 ? (
            <Typography className="no-saved-cards-text">
              No saved cards found. Please add a card first.
            </Typography>
          ) : (
            savedCards.map((card) => (
              <Grid item xs={12} md={4} key={card.id}>
                <MDBox
                  borderRadius="lg"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={3}
                  sx={{
                    border: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                    //border: selectedCard?.id === card.id ? "2px solid #1976d2" : "1px solid #ccc",
                    cursor: "pointer",
                    backgroundColor:
                      selectedCard?.id === card.id ? "#f0f0f0" : "transparent",
                  }}
                  onClick={() => handleCardSelect(card)}
                >
                  <MDBox
                    component="img"
                    src={
                      card.cardType === "MasterCard" ? masterCardLogo : visaLogo
                    }
                    alt={card.cardType}
                    width="10%"
                    mr={2}
                  />
                  {/* <MDTypography variant="h6" fontWeight="medium">
                    {card.cardHolderName}
                    - **** {card.last4}
                    (Expires:{" "}
                    {card.expiryDate})
                  </MDTypography> */}
                  <MDTypography
                    variant="h6"
                    fontWeight="medium"
                    style={{ textAlign: "right" }}
                  >
                    {card.cardHolderName} <br />
                    **** {card.last4} <br />
                    (Expires: {card.expiryDate})
                  </MDTypography>
                </MDBox>
              </Grid>
            ))
          )}
        </Grid>
      </MDBox>
      {/* Payment Form */}
      {selectedCard && (
        <MDBox p={2}>
          <form onSubmit={handlePayment}>
            <MDBox mb={2}>
              <div>
                {/* <label className="pay-text">Total Due :</label> */}
                {/* <label className="pay-amount">${paymentAmount}</label> */}
                {/* setPaymentAmount(10); */}
              </div>
              <MDBox p={3}>
                <Typography variant="h5" gutterBottom>
                  Order Details
                </Typography>
                {locationDetails && (
                  <MDBox mb={2}>
                    <Typography variant="body1">
                      <strong>Parking Address and Spot :</strong>
                    </Typography>
                    <Typography variant="body2">
                      {locationDetails.street}, {locationDetails.city},{" "}
                      {locationDetails.state}, {locationDetails.country},{" "}
                      {locationDetails.zipCode}
                    </Typography>
                  </MDBox>
                )}
                {spotDetails && (
                  <MDBox mb={2}>
                    <Typography variant="body2">
                      Spot Number: {spotDetails.spotNumber} <br />
                      Spot Type: {spotDetails.spotType} <br />
                      Price per Hour: ${spotDetails.pricePerHour}
                    </Typography>
                  </MDBox>
                )}
                <MDBox>
                  <Typography variant="body1">
                    <label className="pay-text">Total Due :</label>
                    <label className="pay-amount">${paymentAmount}</label>
                    {/* <strong>Total Amount:</strong> ${paymentAmount} */}
                  </Typography>
                </MDBox>
              </MDBox>
            </MDBox>
            <MDButton variant="gradient" color="info" type="submit">
              Confirm Payment
            </MDButton>
          </form>
        </MDBox>
      )}
      <Receipt
        open={openReceiptDialog}
        paymentData={paymentData}
        onClose={() => setOpenReceiptDialog(false)}
      />
    </Card>
  );
};

export default PaymentMethod;
