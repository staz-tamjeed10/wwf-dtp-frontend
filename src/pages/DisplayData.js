import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Button,
} from "@mui/material";
import {
  Home as HomeIcon,
  Factory as FactoryIcon,
  Store as StoreIcon,
  Checkroom as CheckroomIcon,
  LocalShipping as LocalShippingIcon,
  QrCodeScanner as QrCodeScannerIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { fetchWithAuth } from "../utils/api";

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

const DataDisplay = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch data if we have a valid ID
    if (!id || id === "undefined") return;

    const fetchData = async () => {
      try {
        console.log("Fetching data for ID:", id);

        const response = await fetchWithAuth(
          `https://ret.bijlicity.com/api/display-data/${id}/`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("API Error:", errorData);
          throw new Error(errorData.error || "No results found");
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (!result) {
          throw new Error("Empty response from server");
        }

        setData(result);
      } catch (err) {
        console.error("DataDisplay Error:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Early return for invalid IDs
  if (!id || id === "undefined") {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Invalid product ID</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/trace")}
          sx={{ mt: 2 }}
        >
          Back to Trace
        </Button>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/trace")}
          sx={{ mt: 2 }}
        >
          Back to Trace
        </Button>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">No data available</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/trace")}
          sx={{ mt: 2 }}
        >
          Back to Trace
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/trace")}
        sx={{ mb: 2 }}
      >
        Back to Trace
      </Button>

      {/* Tag Details */}
      {data.tag && (
        <>
          <Typography variant="h4" gutterBottom>
            Trace Details for {data.tag.new_tag}
          </Typography>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">
                    <strong>Tag ID:</strong> {data.tag.new_tag}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Batch No:</strong> {data.tag.batch_no}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Owner:</strong> {data.tag.owner_name}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Animal Type:</strong>{" "}
                    {data.tag.hide_source || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">
                    <strong>Status:</strong>
                    <Chip
                      label={data.tag.current_status}
                      color={statusColors[data.tag.current_status] || "default"}
                      icon={statusIcons[data.tag.current_status]}
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Created:</strong> {formatDate(data.tag.datetime)}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Tannery Stamp:</strong>{" "}
                    {data.tag.tannery_stamp_code || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Associated Garment */}
          {data.garment && (
            <Box mt={3}>
              <Typography variant="h5" gutterBottom>
                Associated Garment Product
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1">
                        <strong>Garment ID:</strong> {data.garment.garment_id}
                      </Typography>
                      <Typography variant="subtitle1">
                        <strong>Product Types:</strong>{" "}
                        {data.garment.product_types}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1">
                        <strong>Brand:</strong> {data.garment.brand || "N/A"}
                      </Typography>
                      <Typography variant="subtitle1">
                        <strong>Created:</strong>{" "}
                        {formatDate(data.garment.time_stamp)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </>
      )}

      {/* Garment Details */}
      {data.garment_id && (
        <>
          <Typography variant="h4" gutterBottom>
            Garment Product: {data.garment_id}
          </Typography>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">
                    <strong>Product Types:</strong> {data.product_types}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Brand:</strong> {data.brand || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">
                    <strong>Number of Pieces:</strong> {data.num_pieces}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Created:</strong> {formatDate(data.time_stamp)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Associated Tags */}
          {data.tags && data.tags.length > 0 && (
            <Box mt={3}>
              <Typography variant="h5" gutterBottom>
                Associated Leather Tags
              </Typography>
              <Grid container spacing={2}>
                {data.tags.map((tag) => (
                  <Grid item xs={12} sm={6} md={4} key={tag.new_tag}>
                    <Card
                      variant="outlined"
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate(`/display-data/${tag.new_tag}`)}
                    >
                      <CardContent>
                        <Typography variant="subtitle1">
                          <strong>Tag ID:</strong> {tag.new_tag}
                        </Typography>
                        <Typography variant="subtitle1">
                          <strong>Status:</strong>
                          <Chip
                            label={tag.current_status}
                            color={
                              statusColors[tag.current_status] || "default"
                            }
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}

      {/* Transaction History */}
      {data.transactions && data.transactions.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Trace History
          </Typography>
          <Paper elevation={2}>
            <List>
              {data.transactions.map((txn, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        {txn.action === "arrived" ? (
                          <HomeIcon />
                        ) : txn.action === "dispatched" ? (
                          <LocalShippingIcon />
                        ) : (
                          <QrCodeScannerIcon />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${txn.actor_type} ${txn.action}`}
                      secondary={`${formatDate(txn.timestamp)} by ${
                        txn.user.username
                      }`}
                    />
                  </ListItem>
                  {index < data.transactions.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default DataDisplay;
