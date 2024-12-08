import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";

function RenteeDashboard() {
  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <Box textAlign="center" py={4} bgcolor="#f4f4f9">
        <Typography variant="h3" component="h1" gutterBottom color="#007FFF">
          Welcome, Rentee!
        </Typography>
        <Typography variant="body1">
          Discover the convenience of finding and booking parking spots with
          ease.
        </Typography>
      </Box>

      {/* Info Section */}
      <Grid container spacing={4} mt={2} px={4}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="#007FFF" gutterBottom>
                Search Parking
              </Typography>
              <Typography variant="body2">
                Use our app to search for parking spaces near your location and
                choose the best spot that fits your needs.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="#007FFF" gutterBottom>
                Book Instantly
              </Typography>
              <Typography variant="body2">
                Reserve parking spots in just a few clicks and enjoy a
                hassle-free parking experience.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="#007FFF" gutterBottom>
                Navigate Easily
              </Typography>
              <Typography variant="body2">
                Get turn-by-turn directions to your booked parking spot directly
                from the app.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="#007FFF" gutterBottom>
                Leave a Review
              </Typography>
              <Typography variant="body2">
                Share your experience by leaving reviews for parking spaces
                you’ve used to help others make informed decisions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Footer />
    </DashboardLayout>
  );
}

export default RenteeDashboard;
