import React, { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "../utils/api";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import {
  CheckCircle,
  ArrowDownward,
  ArrowUpward,
  Grid3x3,
  QrCodeScanner,
  DirectionsCar,
  Inventory,
  Search as SearchIcon,
  Factory,
  Download as DownloadIcon,
  CalendarToday,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";

const TanneryDashboard = ({
  isHomePage = false,
  sectionRefs = {},
  activeNav,
  setActiveSection,
  userRole,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [action, setAction] = useState("arrived"); // Default to arrived
  const [formData, setFormData] = useState({
    search_id: "",
    tannery_stamp_code: "",
    hide_source: "",
    vehicle_number: "",
    processed_lot_number: "",
    dispatch_to: "",
    article: "",
    tannage_type: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionLoading, setTransactionLoading] = useState(true);
  const [transactionError, setTransactionError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  // New state for CSV export
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [exportLoading, setExportLoading] = useState(false);

  const styles = {
    container: {
      background: "#f8f9fa",
      minHeight: "100vh",
      py: isMobile ? 2 : 4,
      mt: isMobile ? 8 : 13,
    },
    sectionTitle: {
      color: "#2c3e50",
      fontWeight: 600,
      mb: 3,
      position: "relative",
      "&:after": {
        content: '""',
        display: "block",
        width: "60px",
        height: "3px",
        background:
          "linear-gradient(90deg, #3498db 0%, rgba(52, 152, 219, 0) 100%)",
        mt: 1,
        borderRadius: "2px",
      },
    },
    transactionCard: {
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      p: 4,
    },
    exportCard: {
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      p: 3,
      mb: 2,
    },
    actionButton: {
      flex: 1,
      fontWeight: 600,
      width: "100%",
      py: 1.5,
      borderRadius: "8px",
      "&.arrive": {
        backgroundColor: "#27ae60",
        "&:hover": {
          backgroundColor: "#219653",
        },
      },
      "&.dispatch": {
        backgroundColor: "#3498db",
        "&:hover": {
          backgroundColor: "#2980b9",
        },
      },
    },
    exportButton: {
      backgroundColor: "#27ae60",
      "&:hover": {
        backgroundColor: "#219653",
      },
      minWidth: isMobile ? "100%" : 140,
      height: 40,
    },
    formInput: {
      "& .MuiInputLabel-root": { color: "#2c3e50" },
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#bdc3c7" },
        "&:hover fieldset": { borderColor: "#3498db" },
      },
    },
    tabButton: {
      flex: 1,
      fontWeight: 600,
      py: 1.5,
      borderRadius: "8px",
      "&.active": {
        backgroundColor: "#3498db",
        color: "white",
        "&:hover": {
          backgroundColor: "#2980b9",
        },
      },
      "&.inactive": {
        backgroundColor: "white",
        color: "#2c3e50",
        border: "1px solid #bdc3c7",
        "&:hover": {
          backgroundColor: "#f8f9fa",
        },
      },
    },
  };

  const getTransactionsEndpoint = (userRole) => {
    switch (userRole) {
      case "trader":
        return "https://ret.bijlicity.com/api/transactions/trader/";
      case "tannery":
        return "https://ret.bijlicity.com/api/transactions/tannery/";
      case "garment":
        return "https://ret.bijlicity.com/api/transactions/garment/";
      default:
        return "https://ret.bijlicity.com/api/transactions/history/";
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (setActiveSection) {
        setActiveSection("Tannery Dashboard");
      }
      try {
        const response = await fetchWithAuth(
          "https://ret.bijlicity.com/api/tannery/dashboard/"
        );
        if (response.ok) {
          const data = await response.json();
          if (isMounted) setProfileData(data);
        } else {
          setError("Failed to fetch tannery dashboard");
        }
      } catch (error) {
        if (isMounted) setError("Failed to fetch profile data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [setActiveSection]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setOpenSnackbar(false);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        action,
        search_id: formData.search_id,
        tannery_stamp_code: formData.tannery_stamp_code,
        hide_source: formData.hide_source,
        vehicle_number: formData.vehicle_number,
        processed_lot_number: formData.processed_lot_number,
        dispatch_to: formData.dispatch_to,
        article: formData.article || "",
        tannage_type: formData.tannage_type || "",
      };

      const response = await fetchWithAuth(
        "https://ret.bijlicity.com/api/tannery/dashboard/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Operation failed with status " + response.status
        );
      }

      const data = await response.json();
      setSuccess(data.message || "Operation completed successfully");

      // Refresh transactions after successful operation
      fetchTransactions();

      setFormData({
        search_id: "",
        tannery_stamp_code: "",
        hide_source: "",
        vehicle_number: "",
        processed_lot_number: "",
        dispatch_to: "",
        article: "",
        tannage_type: "",
      });
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const fetchTransactions = useCallback(
  async (page = pagination.page, pageSize = pagination.pageSize) => {
    setTransactionLoading(true);
    try {
      const endpoint = getTransactionsEndpoint(userRole);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      // Add action filter - this is the key fix
      if (action) {
        params.append('action', action);
      }

      // Add search term if provided
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetchWithAuth(
        `${endpoint}?${params.toString()}`
      );
      
      const data = await response.json();
      
      if (response.ok) {
        setTransactions(data.transactions || []);
        setPagination((prev) => ({
          ...prev,
          total: data.total || 0,
          totalPages: data.total_pages || 0,
          page: data.page || 1,
        }));
      } else {
        setTransactionError(data.error || "Failed to load transactions");
      }
    } catch (err) {
      setTransactionError(err.message || "Failed to load transactions");
    } finally {
      setTransactionLoading(false);
    }
  },
  [searchTerm, userRole, action, pagination.page, pagination.pageSize]
);

// Fetch transactions when action, searchTerm, or pagination changes
useEffect(() => {
  fetchTransactions(pagination.page, pagination.pageSize);
}, [action, searchTerm, pagination.page, pagination.pageSize, fetchTransactions]);

// Handle search term changes with debounce
useEffect(() => {
  const timer = setTimeout(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchTransactions(1, pagination.pageSize);
  }, 500);

  return () => clearTimeout(timer);
}, [searchTerm, pagination.pageSize, fetchTransactions]);

  // New function to handle CSV export
  const handleExportCSV = async () => {
    if (!exportStartDate || !exportEndDate) {
      setError("Please select both start and end dates");
      setOpenSnackbar(true);
      return;
    }

    setExportLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(
        `https://ret.bijlicity.com/api/tannery/export-transactions/?start_date=${exportStartDate}&end_date=${exportEndDate}`
      );

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tannery_operations_${exportStartDate}_to_${exportEndDate}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setSuccess("CSV exported successfully!");
      setOpenSnackbar(true);
    } catch (err) {
      setError(err.message || "Failed to export CSV");
      setOpenSnackbar(true);
    } finally {
      setExportLoading(false);
    }
  };

  const handleActionChange = (newAction) => {
    setAction(newAction);
    // Reset to first page when changing action
    setPagination((prev) => ({ ...prev, page: 1 }));
    // Clear search term when changing action
    setSearchTerm("");
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchTransactions(newPage, pagination.pageSize);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box sx={styles.container}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "#3498db" }} />
        </Box>
      </Box>
    );
  }

  if (error && !profileData) {
    return (
      <Box sx={styles.container}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Navbar
        sectionRefs={sectionRefs}
        activeNav={activeNav}
        setActiveSection={setActiveSection}
        isHomePage={isHomePage}
        userRole={userRole}
      />
      <Container maxWidth="lg" sx={styles.container}>
        {profileData && (
          <>
            {/* Transaction Card */}
            <Paper sx={styles.transactionCard}>
              <Typography variant="h5" sx={styles.sectionTitle}>
                Leather Processing
              </Typography>

              {/* Action Tabs */}
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <Button
                  className={action === "arrived" ? "active" : "inactive"}
                  sx={styles.tabButton}
                  startIcon={<ArrowDownward />}
                  onClick={() => handleActionChange("arrived")}
                >
                  Process Arrival
                </Button>
                <Button
                  className={action === "dispatched" ? "active" : "inactive"}
                  sx={styles.tabButton}
                  startIcon={<ArrowUpward />}
                  onClick={() => handleActionChange("dispatched")}
                >
                  Process Dispatch
                </Button>
              </Box>

              {/* Arrival Form */}
              {action === "arrived" && (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Hide/Skin Tag ID"
                        name="search_id"
                        value={formData.search_id}
                        onChange={handleChange}
                        required
                        sx={styles.formInput}
                        InputProps={{
                          endAdornment: <QrCodeScanner color="action" />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required sx={styles.formInput}>
                        <InputLabel>Hide/Skin Type</InputLabel>
                        <Select
                          name="hide_source"
                          value={formData.hide_source}
                          onChange={handleChange}
                          label="Hide/Skin Type"
                        >
                          <MenuItem value="Buffalo">Buffalo</MenuItem>
                          <MenuItem value="Cow">Cow</MenuItem>
                          <MenuItem value="Sheep">Sheep</MenuItem>
                          <MenuItem value="Goat">Goat</MenuItem>
                          <MenuItem value="Camel">Camel</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Vehicle Number"
                        name="vehicle_number"
                        value={formData.vehicle_number}
                        onChange={handleChange}
                        sx={styles.formInput}
                        InputProps={{
                          endAdornment: <DirectionsCar color="action" />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Assign Unique Tannery Code"
                        name="tannery_stamp_code"
                        value={formData.tannery_stamp_code}
                        onChange={handleChange}
                        required
                        sx={styles.formInput}
                        InputProps={{
                          endAdornment: <Grid3x3 color="action" />,
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      size="large"
                      startIcon={<CheckCircle />}
                      sx={{
                        ...styles.actionButton,
                        className: "arrive",
                        width: "100%",
                        mt: 3,
                      }}
                      disabled={loading || userRole === "visitor"}
                    >
                      {loading ? "Processing..." : "Mark Arrived"}
                    </Button>
                  </Grid>
                </form>
              )}

              {/* Dispatch Form */}
              {action === "dispatched" && (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Unique Tannery Code"
                        name="tannery_stamp_code"
                        value={formData.tannery_stamp_code}
                        onChange={handleChange}
                        required
                        sx={styles.formInput}
                        InputProps={{
                          endAdornment: <Grid3x3 color="action" />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth sx={styles.formInput}>
                        <InputLabel>Tannage Type</InputLabel>
                        <Select
                          name="tannage_type"
                          value={formData.tannage_type || ""}
                          onChange={handleChange}
                          label="Tannage Type"
                        >
                          <MenuItem value="Chrome">Chrome</MenuItem>
                          <MenuItem value="Chrome-free">Chrome-free</MenuItem>
                          <MenuItem value="Vegetable">Vegetable</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Article"
                        name="article"
                        value={formData.article || ""}
                        onChange={handleChange}
                        sx={styles.formInput}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Processed Lot Number"
                        name="processed_lot_number"
                        value={formData.processed_lot_number}
                        onChange={handleChange}
                        required
                        sx={styles.formInput}
                        InputProps={{
                          endAdornment: <Inventory color="action" />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Dispatch To"
                        name="dispatch_to"
                        value={formData.dispatch_to}
                        onChange={handleChange}
                        required
                        sx={styles.formInput}
                        InputProps={{
                          endAdornment: <Factory color="action" />,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      size="large"
                      startIcon={<CheckCircle />}
                      sx={{
                        ...styles.actionButton,
                        className: "dispatch",
                        width: "100%",
                        mt: 3,
                      }}
                      disabled={loading || userRole === "visitor"}
                    >
                      {loading ? "Processing..." : "Mark Dispatched"}
                    </Button>
                  </Grid>
                </form>
              )}
            </Paper>

            {/* My Recent Transactions with CSV Export */}
            <Paper sx={{ mt: 4, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                  flexDirection: isMobile ? "column" : "row",
                  gap: 2,
                }}
              >
                <Typography variant="h5" sx={styles.sectionTitle}>
                  My Recent Transactions -{" "}
                  {action === "arrived" ? "Arrivals" : "Dispatches"}
                  {transactions.length > 0 && ` (${pagination.total} total)`}
                </Typography>

                {/* CSV Export Section */}
                <Paper sx={styles.exportCard}>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "1rem", mb: 2, color: "#2c3e50" }}
                  >
                    Export Transactions
                  </Typography>

                  <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                    <TextField
                      fullWidth={isMobile}
                      label="Start Date"
                      type="date"
                      value={exportStartDate}
                      onChange={(e) => setExportStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={styles.formInput}
                      InputProps={{
                        startAdornment: (
                          <CalendarToday color="action" sx={{ mr: 1 }} />
                        ),
                      }}
                      size="small"
                    />

                    <TextField
                      fullWidth={isMobile}
                      label="End Date"
                      type="date"
                      value={exportEndDate}
                      onChange={(e) => setExportEndDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={styles.formInput}
                      InputProps={{
                        startAdornment: (
                          <CalendarToday color="action" sx={{ mr: 1 }} />
                        ),
                      }}
                      size="small"
                    />

                    <Button
                      variant="contained"
                      startIcon={
                        exportLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <DownloadIcon />
                        )
                      }
                      onClick={handleExportCSV}
                      disabled={
                        !exportStartDate || !exportEndDate || exportLoading
                      }
                      sx={styles.exportButton}
                      size="small"
                    >
                      {exportLoading ? "Exporting..." : "Download CSV"}
                    </Button>
                  </Stack>
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Search transactions"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by tag ID, stamp code, etc."
                  InputProps={{
                    endAdornment: <SearchIcon color="action" />,
                  }}
                  size="small"
                />
              </Box>

              {transactionLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : transactionError ? (
                <Alert severity="error">{transactionError}</Alert>
              ) : transactions.length === 0 ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <Typography color="textSecondary">
                    No {action === "arrived" ? "arrival" : "dispatch"}{" "}
                    transactions found.
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{ overflowX: "auto" }}>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: "#f5f5f5" }}>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Status
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Slaughterhouse Tag ID
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Unique Tannery Code
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {action === "arrived"
                              ? "Arrival Date"
                              : "Dispatch Date"}
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Vehicle
                          </th>
                          {action === "dispatched" && (
                            <>
                              <th
                                style={{
                                  padding: "12px",
                                  textAlign: "left",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                Lot No.
                              </th>
                              <th
                                style={{
                                  padding: "12px",
                                  textAlign: "left",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                Sent To
                              </th>
                              <th
                                style={{
                                  padding: "12px",
                                  textAlign: "left",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                Article
                              </th>
                              <th
                                style={{
                                  padding: "12px",
                                  textAlign: "left",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                Tannage Type
                              </th>
                            </>
                          )}
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Hide Type
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((txn) => (
                          <tr
                            key={txn.id}
                            style={{ borderBottom: "1px solid #eee" }}
                          >
                            <td style={{ padding: "12px" }}>
                              {txn.action === "arrived" ? (
                                <Box display="flex" alignItems="center" gap={1}>
                                  <ArrowDownward
                                    color="primary"
                                    fontSize="small"
                                  />
                                  <Typography>Arrived</Typography>
                                </Box>
                              ) : (
                                <Box display="flex" alignItems="center" gap={1}>
                                  <ArrowUpward
                                    color="secondary"
                                    fontSize="small"
                                  />
                                  <Typography>Dispatched</Typography>
                                </Box>
                              )}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {txn.tag_id || "-"}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {txn.tannery_stamp_code || "-"}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {action === "arrived"
                                ? formatDate(txn.arrival_date)
                                : formatDate(txn.dispatch_date)}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {txn.vehicle_number || "-"}
                            </td>
                            {action === "dispatched" && (
                              <>
                                <td style={{ padding: "12px" }}>
                                  {txn.processed_lot_number || "-"}
                                </td>
                                <td style={{ padding: "12px" }}>
                                  {txn.dispatch_to || "-"}
                                </td>
                                <td style={{ padding: "12px" }}>
                                  {txn.article || "-"}
                                </td>
                                <td style={{ padding: "12px" }}>
                                  {txn.tannage_type || "-"}
                                </td>
                              </>
                            )}
                            <td style={{ padding: "12px" }}>
                              {txn.hide_source || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                      alignItems: "center",
                    }}
                  >
                    <Button
                      disabled={pagination.page === 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <Typography>
                      Page {pagination.page} of {pagination.totalPages} (Total:{" "}
                      {pagination.total})
                    </Typography>
                    <Button
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      Next
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
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
            severity={error ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default TanneryDashboard;
