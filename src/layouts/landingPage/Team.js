import React from "react";
import { Container, Typography, Grid, Box } from "@mui/material";
import "./Team.css"; // Ensure this file contains the relevant styles
import image1 from "/Users/patelvanshi/IdeaProjects/FrontEndRepo/src/assets/images/WhatsApp Image 2024-12-04 at 19.26.14.jpeg";
import image2 from "/Users/patelvanshi/IdeaProjects/FrontEndRepo/src/assets/images/WhatsApp Image 2024-12-05 at 00.20.39.jpeg";
import image3 from "/Users/patelvanshi/IdeaProjects/FrontEndRepo/src/assets/images/WhatsApp Image 2024-12-04 at 22.34.09.jpeg";
import image4 from "/Users/patelvanshi/IdeaProjects/FrontEndRepo/src/assets/images/Screenshot 2024-11-26 at 10.07.14 AM.png";
import image5 from "/Users/patelvanshi/IdeaProjects/FrontEndRepo/src/assets/images/IMG_1987.JPG";

const teamMembers = [
  {
    name: "Keya Goswami",
    image: image2,
    linkedin: "https://www.linkedin.com/in/keya--goswami",
    bio: "Project Manager overseeing the development of a parking management system. Skilled in coordinating teams, managing timelines, and ensuring successful project delivery.",
  },
  {
    name: "Shreya Wanisha",
    image: image1,
    linkedin: "https://www.linkedin.com/in/shreya-wanisha/",
    bio: "Tech Leader specializing in full-stack development. Passionate about building web applications and guiding technical teams. Expertise in Java, Spring Boot, React, and Node.js..",
  },
  {
    name: "Shriya Pratapwar",
    image: image3,
    linkedin: "https://www.linkedin.com/in/shriya-atul-pratapwar-018b4219a",
    bio: "Designer with a keen eye for creating intuitive and visually appealing user experiences. Specializes in designing user interfaces and ensuring seamless user interactions.",
  },
  {
    name: "Dharana Kashyap",
    image: image4,
    linkedin: "https://www.linkedin.com/in/dharanakashyap/",
    bio: "Developer specializing in Java and Spring Boot. Contributes to backend development and ensures robust application performance.",
  },
  {
    name: "Vanshi Patel",
    image: image5,
    linkedin: "https://www.linkedin.com/in/vanshi-patel-2k2/",
    bio: "Developer specializing in Java and Spring Boot. Focuses on building scalable and efficient backend systems.",
  },
  // Add other members similarly...
];

const Team = () => {
  return (
    <Container sx={{ textAlign: "center", my: 8 }} id="team">
      <Typography variant="h4" gutterBottom>
        Meet Our Team
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <div className="team-member-img-container">
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Box
                  component="img"
                  className="team-member-img"
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                />
                <div className="bioOverlay">
                  <Typography variant="body2">{member.bio}</Typography>
                </div>
              </a>
            </div>
            <Typography
              variant="h6"
              className="team-member-name"
              component="span"
              sx={{ cursor: "pointer", color: "inherit" }}
              onClick={() => window.open(member.linkedin, "_blank")}
            >
              {member.name}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Team;
