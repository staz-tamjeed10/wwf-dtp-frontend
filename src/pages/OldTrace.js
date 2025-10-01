import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  useMediaQuery,
  TableHead,
  TableRow,
  Link,
  Card,
  CardContent,
  Grid,
  useTheme,
  Chip,
  Avatar,
} from "@mui/material";
import {
  QrCodeScanner as QrCodeScannerIcon,
  Factory as FactoryIcon,
  Store as StoreIcon,
  Checkroom as CheckroomIcon,
  LocalShipping as LocalShippingIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { fetchWithAuth } from "../utils/api";
import Navbar from "../components/Navbar";

const statusIcons = {
  "In Slaughterhouse": <HomeIcon color="primary" />,
  "With Trader": <StoreIcon color="secondary" />,
  "At Tannery": <FactoryIcon color="warning" />,
  "At Garment Facility": <CheckroomIcon color="success" />,
  "Dispatched to Garment": <LocalShippingIcon color="info" />,
};

const statusColors = {
  "In Slaughterhouse": "primary",
  "With Trader": "secondary",
  "At Tannery": "warning",
  "At Garment Facility": "success",
  "Dispatched to Garment": "info",
};

const Trace = ({
  isHomePage = false,
  userRole,
  activeNav,
  setActiveSection,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [result, setResult] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const styles = {
    container: {
      background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)",
      minHeight: "100vh",
      padding: theme.spacing(4),
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(2),
      },
      py: isMobile ? 2 : 4,
      mt: isMobile ? 8 : 13,
    },
    passportCard: {
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
      padding: theme.spacing(4),
      maxWidth: 1200,
      margin: "0 auto",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(3),
        borderRadius: "12px",
      },
    },
    header: {
      color: "#192752",
      fontWeight: 700,
      marginBottom: theme.spacing(4),
      textAlign: "center",
      position: "relative",
      "&:after": {
        content: '""',
        display: "block",
        width: "100px",
        height: "4px",
        background: "linear-gradient(90deg, #192752 0%, #F8CE9F 100%)",
        margin: `${theme.spacing(2)} auto 0`,
        borderRadius: "2px",
      },
    },
    sectionHeader: {
      color: "#192752",
      fontWeight: 600,
      margin: `${theme.spacing(4)} 0 ${theme.spacing(2)}`,
      paddingBottom: theme.spacing(1),
      borderBottom: "2px solid #F8CE9F",
      display: "inline-block",
    },
    dataCard: {
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      marginBottom: theme.spacing(3),
      overflow: "hidden",
    },
    dataGrid: {
      padding: theme.spacing(3),
      "& > div": {
        padding: theme.spacing(1.5),
        "&:not(:last-child)": {
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        },
      },
    },
    label: {
      fontWeight: 600,
      color: "#5A2912",
      marginBottom: theme.spacing(0.5),
    },
    value: {
      color: "#192752",
      fontSize: "1.1rem",
    },
    statusChip: {
      fontWeight: 600,
      fontSize: "0.875rem",
      padding: theme.spacing(0.5, 1),
      marginLeft: theme.spacing(1),
    },
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getHideSkinType = (hideSource) => {
    if (["Cow", "Buffalo", "Camel"].includes(hideSource)) return "Hide";
    if (["Goat", "Sheep"].includes(hideSource)) return "Skin";
    return "N/A";
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a valid ID");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetchWithAuth("https://ret.bijlicity.com/api/trace/", {
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
      setResult(result);
    } catch (err) {
      console.error("Search Error:", err);
      setError(err.message || "Failed to process results");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    // Set the active section when component mounts
    if (setActiveSection) {
      setActiveSection("Trace");
    }
  }, [setActiveSection]);

  return (
    <>
      <Navbar
        isHomePage={isHomePage}
        userRole={userRole}
        activeNav={activeNav}
        setActiveSection={setActiveSection}
      />
      <Box sx={styles.container}>
        <Card sx={styles.passportCard}>
          <Typography variant="h3" sx={styles.header}>
            Digital Product Passport
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 4,
              backgroundColor: "rgba(248, 206, 159, 0.2)",
              borderRadius: "12px",
              p: 2,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Enter Tag ID or Garment ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g. ABC12345 or GARMENT123456"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "white",
                },
              }}
              InputProps={{
                endAdornment: (
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
                      borderRadius: "8px",
                      backgroundColor: "#192752",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#1a3568",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      },
                      right: -14,
                      px: 3,
                      py: 1.5,
                    }}
                  >
                    {loading ? "Searching..." : "Trace Product"}
                  </Button>
                ),
              }}
            />
          </Box>

          {loading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="300px"
            >
              <CircularProgress
                size={60}
                thickness={4}
                sx={{ color: "#192752" }}
              />
            </Box>
          )}

          {result && result.type === "tag" && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                  backgroundColor: "#192752",
                  color: "white",
                  p: 3,
                  borderRadius: "12px",
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Product ID: {result.data.new_tag}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Leather Traceability Record
                  </Typography>
                </Box>
                <Chip
                  label={result.data.current_status}
                  color={statusColors[result.data.current_status] || "default"}
                  icon={statusIcons[result.data.current_status]}
                  sx={{
                    height: "40px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    "& .MuiChip-icon": {
                      color: "inherit",
                    },
                  }}
                />
              </Box>

              <Card sx={styles.dataCard}>
                <CardContent>
                  <Typography variant="h6" sx={styles.sectionHeader}>
                    Product Information
                  </Typography>
                  <Grid container spacing={3} sx={styles.dataGrid}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Hide/Skin Tag ID
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.new_tag || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Supplier ID
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.batch_no || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Animal Type
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.product_code || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Slaughter Date
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {formatDate(result.data.datetime) || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Leather Type
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.hide_source || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Hide/Skin Type
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {getHideSkinType(result.data.hide_source)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card sx={styles.dataCard}>
                <CardContent>
                  <Typography variant="h6" sx={styles.sectionHeader}>
                    Processing Details
                  </Typography>
                  <Grid container spacing={3} sx={styles.dataGrid}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Origin
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.origin ? (
                          <Link
                            href={`https://www.google.com/maps/search/?api=1&query=${result.data.origin}`}
                            target="_blank"
                            rel="noopener"
                            sx={{
                              color: "#192752",
                              textDecoration: "underline",
                            }}
                          >
                            {result.data.origin}
                          </Link>
                        ) : (
                          "Lahore"
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Vehicle Number
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.vehicle_number || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Tannery Stamp Code
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.tannery_stamp_code || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Processed Lot Number
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.processed_lot_number || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Product Type
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.product_types || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Brand
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.brand || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Process Date
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {formatDate(result.data.g_date) || "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {result.garment && (
                <Card sx={{ ...styles.dataCard, mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={styles.sectionHeader}>
                      Associated Garment Product
                    </Typography>
                    <Grid container spacing={3} sx={styles.dataGrid}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" sx={styles.label}>
                          Garment ID
                        </Typography>
                        <Typography variant="body1" sx={styles.value}>
                          {result.garment.garment_id}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" sx={styles.label}>
                          Product Types
                        </Typography>
                        <Typography variant="body1" sx={styles.value}>
                          {result.data.product_types}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" sx={styles.label}>
                          Brand
                        </Typography>
                        <Typography variant="body1" sx={styles.value}>
                          {result.garment.brand || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" sx={styles.label}>
                          Created
                        </Typography>
                        <Typography variant="body1" sx={styles.value}>
                          {formatDate(result.garment.time_stamp)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}

              <Card sx={{ ...styles.dataCard, mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={styles.sectionHeader}>
                    Transaction History
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                          <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Performed By
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Timestamp
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Certifications
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.transactions &&
                        result.transactions.length > 0 ? (
                          result.transactions.map((log, index) => (
                            <TableRow key={index} hover>
                              <TableCell>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Avatar
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      mr: 1.5,
                                      backgroundColor:
                                        log.action === "arrived"
                                          ? "#4caf50"
                                          : log.action === "dispatched"
                                          ? "#2196f3"
                                          : "#9c27b0",
                                    }}
                                  >
                                    {log.action === "arrived" ? (
                                      <HomeIcon fontSize="small" />
                                    ) : log.action === "dispatched" ? (
                                      <LocalShippingIcon fontSize="small" />
                                    ) : (
                                      <QrCodeScannerIcon fontSize="small" />
                                    )}
                                  </Avatar>
                                  {log.action.charAt(0).toUpperCase() +
                                    log.action.slice(1)}
                                </Box>
                              </TableCell>
                              <TableCell>
                                {log.user.username}
                                {log.user.profile?.brand && (
                                  <Chip
                                    label={log.user.profile.brand}
                                    size="small"
                                    sx={{
                                      ml: 1,
                                      backgroundColor: "rgba(25, 39, 82, 0.1)",
                                      color: "#192752",
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                {log.actor_type.charAt(0).toUpperCase() +
                                  log.actor_type.slice(1)}
                              </TableCell>
                              <TableCell>{formatDate(log.timestamp)}</TableCell>
                              <TableCell>
                                {log.user.profile.certifications}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              sx={{ textAlign: "center", py: 4 }}
                            >
                              <Typography variant="body2" color="textSecondary">
                                No transaction logs available
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </>
          )}

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="error"
              sx={{
                width: "100%",
                boxShadow: theme.shadows[4],
                "& .MuiAlert-icon": {
                  fontSize: "1.5rem",
                },
              }}
            >
              {error}
            </Alert>
          </Snackbar>
        </Card>
      </Box>
    </>
  );
};

export default Trace;
