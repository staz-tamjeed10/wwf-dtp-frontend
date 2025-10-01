// components/Hero.js
import {
  Box,
  Typography,
  Button,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const backgroundImages = [
  "/assets/leather_pieces.jpeg",
  "/assets/leather_1.jpeg",
  "/assets/leather_2.jpeg",
  "/assets/leather_3.jpeg",
  "/assets/leather_4.jpeg",
];

export default function Hero() {
  const [bgIndex, setBgIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleTraceNow = () => {
    navigate("/trace");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      {/* 🔁 Dynamic Background Image with fade transition */}
      {backgroundImages.map((src, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: index === bgIndex ? 0.7 : 0,
            zIndex: 1,
            transition: "opacity 1.2s ease-in-out",
          }}
        />
      ))}

      {/* Foreground Content */}
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "white",
          height: "100%",
        }}
      >
        <Box sx={{ maxWidth: isMobile ? "100%" : "50%" }}>
          <Typography
            variant={isMobile ? "h4" : "h2"}
            fontWeight="bold"
            gutterBottom
          >
            Welcome to the Digital Traceability Platform
          </Typography>

          <Typography variant={isMobile ? "body1" : "h6"} mb={4}>
            We are dedicated to ensuring sustainable and ethical practices in
            the leather industry. Join us in our mission to make a difference.
          </Typography>

          <Button
            variant="contained"
            size={isMobile ? "medium" : "large"}
            color="primary"
            onClick={handleTraceNow}
            sx={{
              ml: 2,
              backgroundColor: "#162850",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            Trace Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
