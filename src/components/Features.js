// components/Features.js
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Replaces EcoIcon
import FadeInOnScroll from "./FadeInOnScroll";

const features = [
  {
    title: "Traceability Solutions",
    desc: "Track leather from the slaughterhouse to the industry with our advanced systems.",
    icon: <TimelineIcon fontSize="large" color="primary" />,
  },
  {
    title: "Sustainability",
    desc: "Ensuring eco-friendly practices in the leather supply chain.",
    icon: <CheckCircleIcon fontSize="large" color="primary" />,
  },
  {
    title: "Data Insights",
    desc: "Gain actionable insights with our comprehensive analytics tools.",
    icon: <SearchIcon fontSize="large" color="primary" />,
  },
];

export default function Features() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <FadeInOnScroll>
      <Box sx={{ py: 4, backgroundColor: "#1A9F8A" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="#fff"
            textAlign="center"
          >
            Key Features
          </Typography>
          <Typography variant="body1" color="#fff" textAlign="center" mb={5}>
            Our platform empowers stakeholders in the leather industry to track
            products across the supply chain, ensuring transparency,
            sustainability, and ethical practices. Let’s work together to create
            a responsible future for the leather industry.
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {features.map((feat, idx) => (
              <Grid item key={idx}>
                <Card
                  elevation={3}
                  sx={{
                    width: isMobile ? "200px" : "300px",
                    height: "100%",
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 4 }}>
                    <Box mb={2}>{feat.icon}</Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ wordWrap: "break-word" }}
                    >
                      {feat.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ wordWrap: "break-word" }}
                    >
                      {feat.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </FadeInOnScroll>
  );
}
