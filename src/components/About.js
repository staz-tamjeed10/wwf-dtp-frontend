import { useState, useEffect } from "react";
import FadeInOnScroll from "./FadeInOnScroll";
import TrackChangesIcon from "@mui/icons-material/TrackChanges"; // For Traceability
import LoopIcon from "@mui/icons-material/Loop"; // For Circularity
import ScienceIcon from "@mui/icons-material/Science"; // For Cleaner Production
import {
  Box,
  Typography,
  Container,
  Stack,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const workPackages = [
  {
    title: "Traceability",
    desc: "Develop and implement a digital traceability toolkit to track leather hides from direct suppliers to factories, increasing transparency, meeting international standards, and fostering trust within the value chain.",
    icon: <TrackChangesIcon sx={{ fontSize: 40, color: "#007932" }} />,
  },
  {
    title: "Circularity",
    desc: "Recycle waste from leather processing, such as trimmings, fleshing, and shavings, by converting it into water-resistant surfactants. This supports sustainable practices and reduces waste.",
    icon: <LoopIcon sx={{ fontSize: 40, color: "#007932" }} />,
  },
  {
    title: "Cleaner Production",
    desc: "Reduce wastewater pollution by introducing lipase enzymes to replace harmful commercial agents and toxic organic solvents, improving environmental and worker safety.",
    icon: <ScienceIcon sx={{ fontSize: 40, color: "#007932" }} />,
  },
];

const rotatingImages = [
  "/assets/about/leather_5.jpeg",
  "/assets/about/leather_6.jpeg",
  "/assets/about/leather_7.jpeg",
  "/assets/about/leather_8.jpeg",
  "/assets/about/leather_9.jpeg",
  "/assets/about/leather_10.jpeg",
];

export default function About() {
  const [currentImage, setCurrentImage] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % rotatingImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <FadeInOnScroll>
      <Box sx={{ py: 4, backgroundColor: "#f5f5f5" }}>
        <Container maxWidth="lg">
          {/* Text + Image Row */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems="flex-start"
            justifyContent="space-between"
            sx={{ mt: 1 }}
          >
            {/* Text Section */}
            <Box flex={1}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                About Us
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                The leather sector plays a pivotal role in Pakistan's economy,
                standing as the third-largest export industry and contributing
                around 5% to the national GDP. It provides livelihoods to over a
                million people. However, this essential industry faces
                significant environmental challenges, including hazardous waste,
                chemical pollution, and the absence of traceability within the
                value chain to ensure responsible sourcing practices.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                As global markets increasingly demand sustainable and ethically
                sourced products, Pakistan's leather sector must embrace
                innovative approaches to reduce its environmental footprint and
                enhance transparency across its operations.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                Our project, a collaborative effort led by WWF-Pakistan and
                partners including Punjab Agriculture & Meat Company (PAMCO),
                Pakistan Council of Scientific & Industrial Research (PCSIR),
                Information Technology University (ITU), and Leather Field Pvt
                Ltd., is pioneering solutions to transform the leather industry.
              </Typography>
            </Box>

            {/* Updated Rotating Image Section - matches Hero.js transition */}
            <Box
              sx={{
                flex: 1,
                width: "100%",
                maxWidth: 640,
                height: 420,
                minHeight: 280,
                overflow: "hidden",
                borderRadius: 2,
                position: "relative",
              }}
            >
              {rotatingImages.map((src, index) => (
                <Box
                  key={index}
                  component="img"
                  src={src}
                  alt={`Slide ${index + 1}`}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: index === currentImage ? 1 : 0,
                    transition: "opacity 1.2s ease-in-out",
                    zIndex: index === currentImage ? 1 : 0,
                  }}
                />
              ))}
            </Box>
          </Stack>

          {/* Rest of your component remains the same */}
          {/* Midline Text */}
          <Typography
            variant="h6"
            fontWeight="medium"
            sx={{ mt: 8, mb: 4 }}
            textAlign="center"
          >
            To address these issues, WWF-Pakistan, in collaboration with
            partners, is driving innovation through these three pilot work
            packages:
          </Typography>

          {/* Work Package Cards */}
          <Grid container spacing={4} justifyContent="center">
            {workPackages.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    cursor: "default",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: 3,
                      height: "100%",
                      minHeight: 240,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      mx: "auto",
                      maxWidth: 350,
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 2,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        textAlign="center"
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                      >
                        {item.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Footer Line */}
          <Typography
            variant={isMobile ? "body2" : "body1"}
            color="text.primary"
            textAlign="center"
            sx={{ mt: 6 }}
          >
            For more information, visit:{" "}
            <Box
              component="a"
              href="https://www.wwfpak.org/our_work_/water_/smep_tanneries/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#007932",
                fontWeight: "bold",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              SMEP Tanneries | WWF
            </Box>
          </Typography>
        </Container>
      </Box>
    </FadeInOnScroll>
  );
}
