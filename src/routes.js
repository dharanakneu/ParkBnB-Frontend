import ProfilePage_rentee from "layouts/profile/data/ProfilePage_rentee";
import ProfilePage_renter from "layouts/profile/data/ProfilePage_renter";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import ParkingLocation from "layouts/parking-location";
import PostParkingLocation from "layouts/parking-location/post_parking_location";
import Reservations from "layouts/reservations";
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import RenteeDashboard from "layouts/dashboard/rentee-dashboard";
import RenterDashboard from "layouts/dashboard/renter-dashboard";
import SearchParkingLocation from "layouts/search-parking";
import Logout from "layouts/logout";

// @mui icons
import Icon from "@mui/material/Icon";

const renterRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <RenterDashboard />,
  },
  {
    type: "collapse",
    name: "Post Parking Location",
    key: "post-parking-location",
    icon: <Icon fontSize="small">add_location</Icon>,
    route: "/post-parking-location",
    component: <PostParkingLocation />,
  },
  {
    type: "collapse",
    name: "My Reservations",
    key: "my-reservations",
    icon: <Icon fontSize="small">book</Icon>,
    route: "/my-reservations",
    component: <Reservations />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile-renter",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile-renter",
    component: <ProfilePage_renter />,
    title: "Profile",
    titleTypographyProps: { align: "center" },
  },
  {
    route: "/sign-up",
    component: <SignUp />,
  },
  {
    route: "/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Logout",
    key: "logout",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/logout",
    component: <Logout />,
  },
  // renter-specific routes here
];

const renteeRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <RenteeDashboard />,
  },
  {
    type: "collapse",
    name: "Search Parking Location",
    key: "search-parking-location",
    icon: <Icon fontSize="small">add_location</Icon>,
    route: "/search-parking-location",
    component: <SearchParkingLocation />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile-rentee",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile-rentee",
    component: <ProfilePage_rentee />,
    title: "Profile",
    titleTypographyProps: { align: "center" },
  },
  {
    route: "/parking-location/:id",
    component: <ParkingLocation />,
  },
  {
    route: "/paymentMethod",
    component: <PaymentMethod />,
  },
  {
    route: "/sign-up",
    component: <SignUp />,
  },
  {
    route: "/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Logout",
    key: "logout",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/logout",
    component: <Logout />,
  },
  // rentee-specific routes here
];

export { renterRoutes, renteeRoutes };
