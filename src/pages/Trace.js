import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  Card,
  Typography,
  useTheme,
} from "@mui/material";
import { QrCodeScanner as QrCodeScannerIcon } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import TraceLeather from "./TraceLeather";
import TraceProduct from "./TraceProduct";
import { useSearchParams } from "react-router-dom";

const Trace = ({
  isHomePage = false,
  userRole,
  activeNav,
  setActiveSection,
}) => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [result, setResult] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a valid ID");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Use the trace endpoint that handles both leather tags and garment codes
      const response = await fetch("https://ret.bijlicity.com/api/trace/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search_id: searchTerm.trim().toUpperCase() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Request failed with status ${response.status}`
        );
      }

      const result = await response.json();
      console.log("result::", result);
      setResult(result);
    } catch (err) {
      console.error("Search Error:", err);
      setError(err.message || "Failed to process results");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (initialSearch) {
      handleSearch();
    }
  }, [initialSearch, handleSearch]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const renderTraceView = () => {
    if (!result) return null;

    if (result.type === "garment" || searchTerm.trim().length === 12) {
      return <TraceProduct result={result} />;
    }
    return <TraceLeather result={result} />;
  };

  return (
    <>
      <Navbar
        isHomePage={isHomePage}
        userRole={userRole}
        activeNav={activeNav}
        setActiveSection={setActiveSection}
      />
      <Box
        sx={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)",
          minHeight: "100vh",
          p: isMobile ? 2 : 4,
          mt: isMobile ? 8 : 13,
        }}
      >
        <Card
          sx={{
            maxWidth: 1200,
            mx: "auto",
            borderRadius: 2,
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.info.dark} 0%, ${theme.palette.warning.main} 100%)`,
              color: "white",
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              TRACE MY LEATHER
            </Typography>
            <Typography variant="subtitle1">
              Search by Leather Tag ID, Tannery Stamp Code, or Garment Product
              ID
            </Typography>
          </Box>

          {/* Search Section */}
          <Box sx={{ p: 3, borderBottom: "1px solid #eee" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Enter ID to trace"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="8-digit Tag ID, Tannery Stamp, or 12-digit Garment ID"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white",
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <QrCodeScannerIcon />
                  )
                }
                sx={{
                  height: "56px",
                  borderRadius: "8px",
                  backgroundColor: theme.palette.warning.main,
                  color: "white",
                  "&:hover": {
                    backgroundColor: theme.palette.info.dark,
                  },
                  px: 3,
                  py: 1.5,
                  minWidth: isMobile ? "100px" : "180px",
                }}
              >
                {loading ? "Searching..." : "Trace"}
              </Button>
            </Box>
          </Box>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress
                size={60}
                thickness={4}
                sx={{ color: theme.palette.primary.main }}
              />
            </Box>
          )}

          {renderTraceView()}

          {!loading && !result && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
                textAlign: "center",
              }}
            >
              <QrCodeScannerIcon
                sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                Trace Your Product
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter a leather tag ID (8 digits), tannery stamp code, or
                garment product ID (12 digits) above to view the complete
                traceability information.
              </Typography>
            </Box>
          )}
        </Card>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default Trace;
