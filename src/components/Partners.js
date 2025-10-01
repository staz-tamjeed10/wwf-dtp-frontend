import { Box, Typography, Container, Grid } from "@mui/material";
import FadeInOnScroll from "./FadeInOnScroll";

const implementedBy = [
  {
    name: "Information Technology University",
    logo: "/assets/partners/implemented_logo.png",
    link: "https://itu.edu.pk/",
  },
  {
    name: "World Wide Fund for Nature",
    logo: "/assets/partners/implemented_logo1.png",
    link: "https://wwfpak.org/",
  },
  {
    name: "Leather Field (Pvt) Limited",
    logo: "/assets/partners/implemented_logo2.png",
    link: "https://leatherfield.com/",
  },
  {
    name: "Punjab Agriculture & Meat Company",
    logo: "/assets/partners/implemented_logo3.png",
    link: "https://pamco.gop.pk/",
  },
  {
    name: "Pakistan Council Of Scientific & Industrial Research",
    logo: "/assets/partners/implemented_logo4.png",
    link: "https://pcsir-khi.gov.pk/",
  },
];

const fundedBy = [
  {
    name: "Sustainable Manufacturing & Environmental Pollution",
    logo: "/assets/partners/funded_logo.png",
    link: "https://smepprogramme.org/",
  },
  {
    name: "UK International Development",
    logo: "/assets/partners/funded_logo2.png",
    link: "https://www.gov.uk/government/organisations/foreign-commonwealth-development-office",
  },
];

export default function Partners() {
  return (
    <FadeInOnScroll>
      <Box sx={{ py: 4, backgroundColor: "#fafafa" }}>
        <Container maxWidth="lg">
          {/* Outside Heading */}
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            Our Team
          </Typography>

          {/* White Box Container */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 4,
              p: { xs: 3, md: 5 },
              mt: 4,
              boxShadow: "0px 0px 10px rgba(0,0,0,0.05)",
            }}
          >
            {/* Implemented By */}
            <Typography
              variant="h6"
              fontWeight="medium"
              textAlign="center"
              gutterBottom
            >
              Implemented By
            </Typography>
            <Grid
              container
              spacing={4}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 2 }}
            >
              {implementedBy.map((partner, idx) => (
                <Grid item xs={6} sm={4} md={2} key={idx}>
                  <a
                    href={partner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Box
                      component="img"
                      src={partner.logo}
                      alt={partner.name}
                      sx={{
                        width: "100%",
                        maxWidth: "180px",
                        display: "block",
                        margin: "0 auto",
                        filter: "grayscale(100%)",
                        "&:hover": {
                          filter: "grayscale(0%)",
                        },
                      }}
                    />
                  </a>
                </Grid>
              ))}
            </Grid>

            {/* Funded By */}
            <Typography
              variant="h6"
              fontWeight="medium"
              textAlign="center"
              gutterBottom
              sx={{ mt: 6 }}
            >
              Funded By
            </Typography>
            <Grid
              container
              spacing={4}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 2 }}
            >
              {fundedBy.map((partner, idx) => (
                <Grid item xs={6} sm={4} md={2} key={idx}>
                  <a
                    href={partner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Box
                      component="img"
                      src={partner.logo}
                      alt={partner.name}
                      sx={{
                        width: "100%",
                        maxWidth: "200px",
                        display: "block",
                        margin: "0 auto",
                        filter: "grayscale(100%)",
                        "&:hover": {
                          filter: "grayscale(0%)",
                        },
                      }}
                    />
                  </a>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </FadeInOnScroll>
  );
}
