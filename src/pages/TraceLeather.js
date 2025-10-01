import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  useMediaQuery,
  useTheme,
  CardContent,
  Grid,
  Chip,
  Alert,
  Avatar,
  Snackbar,
  Collapse,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Factory as FactoryIcon,
  Store as StoreIcon,
  Checkroom as CheckroomIcon,
  LocalShipping as LocalShippingIcon,
  Home as HomeIcon,
  QrCodeScanner as QrCodeScannerIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

const statusIcons = {
  "In Slaughterhouse": <HomeIcon sx={{ color: "#FF6B35" }} />,
  "With Trader": <StoreIcon sx={{ color: "#00A8E8" }} />,
  "At Tannery": <FactoryIcon sx={{ color: "#FFD166" }} />,
  "At Garment Facility": <CheckroomIcon sx={{ color: "#06D6A0" }} />,
  "Dispatched to Garment": <LocalShippingIcon sx={{ color: "#118AB2" }} />,
  "Dispatched from Garment": <LocalShippingIcon sx={{ color: "#7209B7" }} />,
  "This item is currently dispatched to": (
    <LocalShippingIcon sx={{ color: "#F15BB5" }} />
  ),
};

const statusColors = {
  "In Slaughterhouse": {
    bgcolor: "#FF6B35",
    color: "white",
    border: "2px solid #FF8C61",
  },
  "With Trader": {
    bgcolor: "#00A8E8",
    color: "white",
    border: "2px solid #4CC9F0",
  },
  "At Tannery": {
    bgcolor: "#FFD166",
    color: "#5A2912",
    border: "2px solid #FFE8A3",
  },
  "At Garment Facility": {
    bgcolor: "#06D6A0",
    color: "white",
    border: "2px solid #4DE3B5",
  },
  "Dispatched to Garment": {
    bgcolor: "#118AB2",
    color: "white",
    border: "2px solid #4DA8DA",
  },
  "Dispatched from Garment": {
    bgcolor: "#7209B7",
    color: "white",
    border: "2px solid #9D4EDD",
  },
  "This item is currently dispatched to": {
    bgcolor: "#F15BB5",
    color: "white",
    border: "2px solid #F48FB1",
  },
};

const getStatusStyle = (status) => {
  return (
    statusColors[status] || {
      bgcolor: "#6C757D",
      color: "white",
      border: "2px solid #ADB5BD",
    }
  );
};

const TraceLeather = ({ result }) => {
  const [error] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    productInfo: true,
    processingDetails: true,
    garmentProduct: true,
    transactionHistory: true,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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
    if (!dateString) return null;
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
    if (!hideSource) return null;
    if (["Cow", "Buffalo", "Camel"].includes(hideSource)) return "Hide";
    if (["Goat", "Sheep"].includes(hideSource)) return "Skin";
    return null;
  };

  const getStatusIcon = (status) => {
    if (statusIcons[status]) {
      return statusIcons[status];
    }
    if (status && status.includes("dispatched to")) {
      return statusIcons["This item is currently dispatched to"];
    }
    return <LocalShippingIcon sx={{ color: "#6C757D" }} />;
  };

  // Helper function to check if data exists
  const hasData = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "N/A"
    ) {
      return false;
    }

    if (Array.isArray(value) && value.length === 0) {
      return false;
    }

    if (typeof value === "object" && Object.keys(value).length === 0) {
      return false;
    }

    return true;
  };

  // Function to get shortened status text for mobile
  const getStatusText = (status) => {
    if (!isMobile) return status;

    const statusMap = {
      "In Slaughterhouse": "Slaughterhouse",
      "With Trader": "With Trader",
      "At Tannery": "At Tannery",
      "At Garment Facility": "Garment Facility",
      "Dispatched to Garment": "To Garment",
      "Dispatched from Garment": "From Garment",
      "This item is currently dispatched to": "Dispatched",
    };

    return statusMap[status] || status;
  };

  console.log("check:", result);

  return (
    <Box sx={{ p: 3 }}>
      {result && result.type === "tag" && (
        <>
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              mb: 4,
              backgroundColor: "#192752",
              color: "white",
              p: isMobile ? 2 : 3,
              borderRadius: "12px",
              gap: isMobile ? 2 : 0,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  fontSize: isMobile ? "20px" : "30px",
                  wordBreak: "break-word",
                }}
              >
                Product ID: {result.data.new_tag}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Leather Traceability Record
              </Typography>
            </Box>
            <Tooltip
              title={isMobile ? result.data.current_status : ""}
              placement="top"
            >
              <Chip
                label={getStatusText(result.data.current_status)}
                icon={getStatusIcon(result.data.current_status)}
                sx={{
                  ...styles.statusChip,
                  ...getStatusStyle(result.data.current_status),
                  height: isMobile ? "36px" : "44px",
                  fontSize: isMobile ? "0.62rem" : "0.9rem",
                  fontWeight: 700,
                  maxWidth: isMobile ? "300px" : "none",
                  "& .MuiChip-label": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: isMobile ? "nowrap" : "normal",
                    px: isMobile ? 0.5 : 2,
                  },
                  "& .MuiChip-icon": {
                    fontSize: isMobile ? "16px" : "20px",
                    marginLeft: isMobile ? "4px" : "8px",
                  },
                }}
              />
            </Tooltip>
          </Box>

          {/* Product Information Section with Toggle */}
          <Card sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                backgroundColor: "#f5f5f5",
                cursor: "pointer",
              }}
              onClick={() => toggleSection("productInfo")}
            >
              <Typography variant="h6" fontWeight="bold">
                Product Information
              </Typography>
              <IconButton size="small">
                {expandedSections.productInfo ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </Box>
            <Collapse in={expandedSections.productInfo}>
              <CardContent>
                <Grid container spacing={3}>
                  {hasData(result.data.new_tag) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Hide/Skin Tag ID
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.new_tag}
                      </Typography>
                    </Grid>
                  )}
                  {hasData(result.data.batch_no) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Supplier ID
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.batch_no}
                      </Typography>
                    </Grid>
                  )}
                  {hasData(result.data.product_code) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Slaughterhouse Code
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.product_code}
                      </Typography>
                    </Grid>
                  )}
                  {hasData(result.data.datetime) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Slaughter Date
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {formatDate(result.data.datetime)}
                      </Typography>
                    </Grid>
                  )}
                  {hasData(result.data.hide_source) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Animal Type
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.hide_source}
                      </Typography>
                    </Grid>
                  )}
                  {getHideSkinType(result.data.hide_source) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Hide/Skin Type
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {getHideSkinType(result.data.hide_source)}
                      </Typography>
                    </Grid>
                  )}
                  {hasData(result.data.origin) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Origin
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.origin}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Collapse>
          </Card>

          {/* Processing Details Section with Toggle */}
          <Card sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                backgroundColor: "#f5f5f5",
                cursor: "pointer",
              }}
              onClick={() => toggleSection("processingDetails")}
            >
              <Typography variant="h6" fontWeight="bold">
                Processing Details
              </Typography>
              <IconButton size="small">
                {expandedSections.processingDetails ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </Box>
            <Collapse in={expandedSections.processingDetails}>
              <CardContent>
                <Grid container spacing={3}>
                  {hasData(result.data.tannery_name) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Tannery
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.tannery_name}
                      </Typography>
                    </Grid>
                  )}
                  {hasData(result.data.tannery_location) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Location
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.tannery_location}
                      </Typography>
                    </Grid>
                  )}
                  {hasData(result.data.vehicle_number) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Vehicle Number
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.vehicle_number}
                      </Typography>
                    </Grid>
                  )}
                  {hasData(result.data.tannery_stamp_code) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Tannery Stamp Code
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.tannery_stamp_code}
                      </Typography>
                    </Grid>
                  )}
                  {hasData(result.data.processed_lot_number) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Processed Lot Number
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.processed_lot_number}
                      </Typography>
                    </Grid>
                  )}
                  {hasData(result.data.product_types) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Product Type
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.product_types}
                      </Typography>
                    </Grid>
                  )}
                  {hasData(result.data.brand) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Brand
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {result.data.brand}
                      </Typography>
                    </Grid>
                  )}
                  {hasData(result.data.g_date) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={styles.label}>
                        Process Date
                      </Typography>
                      <Typography variant="body1" sx={styles.value}>
                        {formatDate(result.data.g_date)}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Collapse>
          </Card>

          {/* Associated Garment Product Section with Toggle */}
          {result.garment && (
            <Card sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                }}
                onClick={() => toggleSection("garmentProduct")}
              >
                <Typography variant="h6" fontWeight="bold">
                  Associated Garment Product
                </Typography>
                <IconButton size="small">
                  {expandedSections.garmentProduct ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
              <Collapse in={expandedSections.garmentProduct}>
                <CardContent>
                  <Grid container spacing={3}>
                    {hasData(result.garment.garment_id) && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" sx={styles.label}>
                          Garment ID
                        </Typography>
                        <Typography variant="body1" sx={styles.value}>
                          {result.garment.garment_id}
                        </Typography>
                      </Grid>
                    )}
                    {hasData(result.data.product_types) && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" sx={styles.label}>
                          Product Types
                        </Typography>
                        <Typography variant="body1" sx={styles.value}>
                          {result.data.product_types}
                        </Typography>
                      </Grid>
                    )}
                    {hasData(result.garment.brand) && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" sx={styles.label}>
                          Brand
                        </Typography>
                        <Typography variant="body1" sx={styles.value}>
                          {result.garment.brand}
                        </Typography>
                      </Grid>
                    )}
                    {hasData(result.garment.time_stamp) && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" sx={styles.label}>
                          Created
                        </Typography>
                        <Typography variant="body1" sx={styles.value}>
                          {formatDate(result.garment.time_stamp)}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Collapse>
            </Card>
          )}

          {/* Transaction History Section with Toggle */}
          <Card>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                backgroundColor: "#f5f5f5",
                cursor: "pointer",
              }}
              onClick={() => toggleSection("transactionHistory")}
            >
              <Typography variant="h6" fontWeight="bold">
                Transaction History
              </Typography>
              <IconButton size="small">
                {expandedSections.transactionHistory ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </Box>
            <Collapse in={expandedSections.transactionHistory}>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          Performed By
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          Timestamp
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          Certifications
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {result.transactions && result.transactions.length > 0 ? (
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
                            <TableCell>{log.user.profile.full_name}</TableCell>
                            <TableCell>
                              {log.actor_type.charAt(0).toUpperCase() +
                                log.actor_type.slice(1)}
                            </TableCell>
                            <TableCell>{log.location || "N/A"}</TableCell>
                            <TableCell>{formatDate(log.timestamp)}</TableCell>
                            <TableCell>
                              {log.user.profile.certifications}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
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
            </Collapse>
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
    </Box>
  );
};

export default TraceLeather;
