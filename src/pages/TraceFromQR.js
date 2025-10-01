import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TraceLeather from "./TraceLeather";
import { fetchWithAuth } from "../utils/api";
import { CircularProgress, Box, Typography, Alert } from "@mui/material";

const TraceFromQR = () => {
  const { tagId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(
          `https://ret.bijlicity.com/api/tags/${tagId}/`
        );
        if (!response.ok) {
          throw new Error("Tag not found");
        }
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tagId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!result) {
    return (
      <Box p={4}>
        <Typography variant="h6">No data found for this tag</Typography>
      </Box>
    );
  }

  // Reuse your existing TraceLeather component
  return <TraceLeather result={result} />;
};

export default TraceFromQR;
