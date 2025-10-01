import { Box, Typography, Container } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: "#222", color: "#fff", py: 4, mt: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          align="center"
          sx={{
            fontSize: {
              xs: "0.70rem", // 👈 Smaller font on mobile
              sm: "0.85rem", // 👈 Slightly larger on tablets and up
            },
            whiteSpace: "nowrap", // 👈 Keeps text on one line
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          © {new Date().getFullYear()} Digital Traceability Platform. All rights
          reserved.
        </Typography>
      </Container>
    </Box>
  );
}
