import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
} from "@mui/material";

const features = [
  {
    title: "List Your Parking Space",
    subtitle: "Rent out your space with ease",
    description:
      "Easily list your available parking space on Park BnB. Provide key details, including location, availability, and price, to make it easy for renters to find and book.",
  },
  {
    title: "Search for Available Parking",
    subtitle: "Find parking spots nearby",
    description:
      "Browse available parking spaces based on your location preferences. Use filters to narrow down your options and find the perfect space for your needs.",
  },
  {
    title: "Secure Payments",
    subtitle: "Safe and easy transactions",
    description:
      "Pay for parking or collect rent securely through our integrated payment system. Our platform ensures that all transactions are safe and straightforward.",
    note: "* Available for both renters and space owners",
  },
  {
    title: "Manage Your Listings",
    subtitle: "Update your parking space details anytime",
    description:
      "Easily manage your parking space listings. Update availability, price, or other details whenever you need to. You're in control of your space.",
  },
  {
    title: "Location-Based Recommendations",
    subtitle: "Find the best options for you",
    description:
      "Our platform suggests parking spaces based on your location and preferences. Whether you're looking to rent a spot or list your own, we make it easier to connect.",
  },
];
const Features = () => {
  return (
    <Container sx={{ py: 8 }} id="features">
      <Typography variant="h4" align="center" gutterBottom>
        Our Features
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                p: 2,
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {feature.subtitle}
                </Typography>
                <Typography variant="body2" mt={1}>
                  {feature.description}
                </Typography>
                {feature.note && (
                  <Box mt={1}>
                    <Typography variant="caption" color="textSecondary">
                      {feature.note}
                    </Typography>
                  </Box>
                )}
              </CardContent>
              {/* <Button variant="contained" color="primary" sx={{ mt: "auto" }}>
                Try it for Free
              </Button> */}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Features;
