import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";

const Hero = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h2" gutterBottom>
        Welcome to Park BnB
      </Typography>
      <Typography variant="h5" paragraph>
        Rent or list parking spaces with ease on Park BnB.
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Whether you&apos;re looking for a convenient parking space to rent or
        want to make some extra income by listing your own parking spot, Park
        BnB makes it simple and secure. Rent out your parking space directly to
        others or search for spaces near you based on location preferences.
        Enjoy the flexibility and convenience of renting parking spaces with
        Park BnB&mdash;your space, your terms.
      </Typography>
      {/* <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" sx={{ mr: 2 }}>
          List Your Space
        </Button>
        <Button variant="outlined" color="primary">
          Find Parking
        </Button>
      </Box> */}
    </Container>
  );
};

export default Hero;
