import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Print, ArrowBack } from "@mui/icons-material";
import { fetchWithAuth } from "../utils/api";
import Navbar from "../components/Navbar";

const GarmentPrintQR = ({ userRole }) => {
  const { garmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  const handlePrint = () => {
    window.open(
      `https://ret.bijlicity.com/api/garment/print-qr/${garmentId}/`,
      "_blank"
    );
  };

  useEffect(() => {
    const fetchGarment = async () => {
      try {
        const response = await fetchWithAuth(
          `https://ret.bijlicity.com/api/garment/products/${garmentId}/`
        );
        if (!response.ok) {
          throw new Error("Garment not found");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchGarment();
  }, [garmentId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#3498db" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
      >
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBack />}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Navbar userRole={userRole} />
      <Container maxWidth="md" sx={{ py: 4, mt: 10 }}>
        <Box
          sx={{
            textAlign: "center",
            p: 4,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="h4" gutterBottom>
            Garment QR Code
          </Typography>
          <Typography variant="body1" paragraph>
            QR code for garment ID: <strong>{garmentId}</strong>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Print />}
            onClick={handlePrint}
            sx={{ mt: 3 }}
          >
            Print QR Code
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default GarmentPrintQR;
