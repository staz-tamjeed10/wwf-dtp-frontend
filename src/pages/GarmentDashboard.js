import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Chip,
  Tooltip,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
  CheckCircle,
  ArrowDownward,
  ArrowUpward,
  QrCodeScanner,
  Print as PrintIcon,
  Search as SearchIcon,
  Print,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";

const GarmentDashboard = ({
  isHomePage = false,
  sectionRefs = {},
  activeNav,
  setActiveSection,
  userRole,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [action, setAction] = useState("arrived");
  const [formData, setFormData] = useState({
    search_id: "",
    num_pieces: 1,
    product_types: [],
    brand: "",
    other_product_type: "",
    g_date: new Date().toISOString().slice(0, 16),
    tag_ids: [],
  });
  const [stampCodes, setStampCodes] = useState([]);
  const [stampValidation, setStampValidation] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionLoading, setTransactionLoading] = useState(true);
  const [transactionError, setTransactionError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  const PRODUCT_TYPE_CHOICES = [
    { value: "Jacket", label: "Jacket" },
    { value: "Gloves", label: "Gloves" },
    { value: "Skirt", label: "Skirt" },
    { value: "Pant", label: "Pant" },
    { value: "Shoes", label: "Shoes" },
    { value: "Wallet", label: "Wallet" },
    { value: "Bag", label: "Bag" },
    { value: "Belt", label: "Belt" },
    { value: "Other", label: "Other" },
  ];

  const styles = {
    container: {
      background: "#f8f9fa",
      minHeight: "100vh",
      py: isMobile ? 2 : 4,
      mt: isMobile ? 8 : 13,
    },
    profileCard: {
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      mb: 4,
    },
    profileHeader: {
      background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
      color: "white",
      py: 4,
      px: 4,
      textAlign: "center",
    },
    profileContent: {
      p: 4,
    },
    detailItem: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      p: 2,
      borderRadius: "8px",
      backgroundColor: "rgba(52, 152, 219, 0.05)",
      mb: 2,
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(52, 152, 219, 0.1)",
        transform: "translateY(-2px)",
      },
    },
    detailIcon: {
      color: "#3498db",
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
    actionButton: {
      flex: 1,
      fontWeight: 600,
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
    productTypeCheckbox: {
      "& .MuiCheckbox-root": {
        color: theme.palette.primary.main,
      },
      "& .Mui-checked": {
        color: theme.palette.primary.main,
      },
    },
    stampInputContainer: {
      display: "flex",
      alignItems: "center",
      gap: 1,
      // mb: 2,
    },
    validStamp: {
      borderColor: "#28a745",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#28a745 !important",
      },
    },
    invalidStamp: {
      borderColor: "#dc3545",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#dc3545 !important",
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
        setActiveSection?.("Garment Dashboard");
      }
      try {
        const response = await fetchWithAuth(
          "https://ret.bijlicity.com/api/garment/dashboard/"
        );
        if (response.ok) {
          const data = await response.json();
          if (isMounted) setProfileData(data);
        } else {
          setError("Failed to fetch garment dashboard");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductTypeChange = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;

    setFormData((prev) => {
      let newTypes = [...prev.product_types];
      if (checked) {
        newTypes.push(value);
      } else {
        newTypes = newTypes.filter((type) => type !== value);
      }
      return {
        ...prev,
        product_types: newTypes,
      };
    });
  };

  const handleNumPiecesChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setFormData((prev) => ({
      ...prev,
      num_pieces: value,
    }));

    // Initialize stamp codes array
    const newStampCodes = Array(value).fill("");
    setStampCodes(newStampCodes);
    setStampValidation({});
  };

  const handleStampCodeChange = (index, value) => {
    const newStampCodes = [...stampCodes];
    newStampCodes[index] = value;
    setStampCodes(newStampCodes);

    // Validate stamp code
    if (value) {
      fetchWithAuth(
        `https://ret.bijlicity.com/api/garment/validate-stamp/?code=${value}`
      )
        .then((response) => response.json())
        .then((data) => {
          setStampValidation((prev) => ({
            ...prev,
            [index]: {
              valid: data.valid,
              message: data.formatted || data.error,
            },
          }));
        });
    } else {
      setStampValidation((prev) => {
        const newValidation = { ...prev };
        delete newValidation[index];
        return newValidation;
      });
    }
  };

  const handlePrintQR = (garmentId) => {
    try {
      setLoading(true);
      setError(null);

      // Directly open PDF URL in new tab
      const printWindow = window.open(
        `https://ret.bijlicity.com/api/garment/print-qr/${garmentId}/`,
        "_blank"
      );

      // Focus the window if opened
      if (printWindow) {
        printWindow.focus();
      } else {
        throw new Error(
          "Popup was blocked. Please allow popups for this site."
        );
      }
    } catch (err) {
      setError(err.message);
      console.error("Print error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setOpenSnackbar(false);

    try {
      let endpoint, payload;

      if (action === "arrived") {
        endpoint = "https://ret.bijlicity.com/api/garment/transaction/";
        payload = {
          action: "arrived",
          search_id: formData.search_id,
        };
      } else {
        // For dispatch, include all stamp codes
        endpoint = "https://ret.bijlicity.com/api/garment/transaction/";
        payload = {
          action: "dispatched",
          num_pieces: formData.num_pieces,
          product_types: formData.product_types,
          brand: formData.brand,
          other_product_type: formData.other_product_type,
          g_date: formData.g_date,
          tag_ids: stampCodes.filter((code) => code),
        };

        // Validate all stamp codes
        const invalidStamps = stampCodes.some(
          (code, index) => code && !stampValidation[index]?.valid
        );
        if (invalidStamps) {
          throw new Error("One or more stamp codes are invalid");
        }
      }

      const response = await fetchWithAuth(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.success || data.message);
        if (data.garment_id) {
          // Redirect to print QR page or show success
          navigate(`/garment/print-qr/${data.garment_id}`);
          // Call print function after a short delay
          setTimeout(() => {
            handlePrintQR(data.garment_id);
          }, 1000);
        }
        // Reset form for arrival but keep fields for dispatch
        if (action === "arrived") {
          setFormData((prev) => ({
            ...prev,
            search_id: "",
          }));
        }
      } else {
        setError(data.error || "Operation failed");
      }
    } catch (err) {
      setError(err.message || "Operation failed");
    } finally {
      setOpenSnackbar(true);
    }
  };

  const fetchTransactions = useCallback(
    async (page, pageSize) => {
      setTransactionLoading(true);
      try {
        const endpoint = getTransactionsEndpoint(userRole);
        const response = await fetchWithAuth(
          `${endpoint}?page=${page}&page_size=${pageSize}&search=${searchTerm}`
        );
        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          // The backend should already return only garment transactions
          // No need for additional filtering
          setTransactions(data.transactions || data);
          setPagination((prev) => ({
            ...prev,
            total: data.total || data.transactions?.length || 0,
            totalPages:
              data.total_pages ||
              Math.ceil(
                (data.total || data.transactions?.length || 0) / pageSize
              ),
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
    [searchTerm, userRole]
  );

  useEffect(() => {
    fetchTransactions(pagination.page, pagination.pageSize);
  }, [fetchTransactions, pagination.page, pagination.pageSize]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Add this function to format dates
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

  if (loading && !profileData) {
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
                  onClick={() => setAction("arrived")}
                >
                  Process Arrival
                </Button>
                <Button
                  className={action === "dispatched" ? "active" : "inactive"}
                  sx={styles.tabButton}
                  startIcon={<ArrowUpward />}
                  onClick={() => setAction("dispatched")}
                >
                  Process Dispatch
                </Button>
              </Box>

              {/* Arrival Form */}
              {action === "arrived" && (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, md: 12 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Tannery Stamp Code"
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
                    <Grid item size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Number of Pieces"
                        name="num_pieces"
                        type="number"
                        value={formData.num_pieces}
                        onChange={handleNumPiecesChange}
                        required
                        inputProps={{ min: 1 }}
                        sx={styles.formInput}
                      />
                    </Grid>

                    {Array.from({ length: formData.num_pieces }).map(
                      (_, index) => (
                        <Grid item size={{ xs: 12, md: 6 }} key={index}>
                          <Box sx={styles.stampInputContainer}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              label={`Stamp Code #${index + 1}`}
                              value={stampCodes[index] || ""}
                              onChange={(e) =>
                                handleStampCodeChange(index, e.target.value)
                              }
                              required
                              sx={[
                                styles.formInput,
                                stampValidation[index]?.valid === true &&
                                  styles.validStamp,
                                stampValidation[index]?.valid === false &&
                                  styles.invalidStamp,
                              ]}
                              InputProps={{
                                endAdornment: (
                                  <Box sx={{ ml: 1 }}>
                                    {stampValidation[index] && (
                                      <Chip
                                        label={stampValidation[index].message}
                                        color={
                                          stampValidation[index].valid
                                            ? "success"
                                            : "error"
                                        }
                                        size="small"
                                      />
                                    )}
                                  </Box>
                                ),
                              }}
                            />
                          </Box>
                        </Grid>
                      )
                    )}
                    <Grid item size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Brand Name"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                        sx={styles.formInput}
                      />
                    </Grid>

                    <Grid item size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Processing Date & Time"
                        name="g_date"
                        type="datetime-local"
                        value={formData.g_date}
                        onChange={handleChange}
                        required
                        sx={styles.formInput}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        Product Types
                      </Typography>
                      <FormGroup row sx={styles.productTypeCheckbox}>
                        {PRODUCT_TYPE_CHOICES.map((type) => (
                          <FormControlLabel
                            key={type.value}
                            control={
                              <Checkbox
                                checked={formData.product_types.includes(
                                  type.value
                                )}
                                onChange={handleProductTypeChange}
                                value={type.value}
                              />
                            }
                            label={type.label}
                          />
                        ))}
                      </FormGroup>
                    </Grid>

                    {formData.product_types.includes("Other") && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Specify Custom Product Type"
                          name="other_product_type"
                          value={formData.other_product_type}
                          onChange={handleChange}
                          required
                          sx={styles.formInput}
                        />
                      </Grid>
                    )}
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
                        mt: 2,
                      }}
                      disabled={loading || userRole === "visitor"}
                    >
                      {loading ? (
                        "Processing..."
                      ) : (
                        <>
                          <Print sx={{ mr: 1 }} />
                          Generate Product QR
                        </>
                      )}
                    </Button>
                  </Grid>
                </form>
              )}
            </Paper>
            <Paper sx={{ mt: 4, p: 3 }}>
              <Typography variant="h5" sx={styles.sectionTitle}>
                My Recent Transactions
              </Typography>

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
                />
              </Box>

              {transactionLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : transactionError ? (
                <Alert severity="error">{transactionError}</Alert>
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
                            Tannery Stamp Code
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Arrival Date
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Dispatch Date
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Garment ID
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Product Types
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Print QR
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
                              {txn.tannery_stamp_code || "-"}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {formatDate(txn.arrival_date)}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {formatDate(txn.dispatch_date)}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {txn.garment_id || "-"}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {txn.new_tag?.product_types || "-"}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {txn.garment_id && (
                                <Tooltip title="Print QR Code">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handlePrintQR(txn.garment_id)
                                    }
                                    disabled={loading}
                                    sx={{
                                      color: "primary.main",
                                      "&:hover": {
                                        backgroundColor: "primary.light",
                                        color: "white",
                                      },
                                    }}
                                  >
                                    <PrintIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
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
                    }}
                  >
                    <Button
                      disabled={pagination.page === 1}
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page - 1,
                        }))
                      }
                    >
                      Previous
                    </Button>
                    <Typography>
                      Page {pagination.page} of {pagination.totalPages}
                    </Typography>
                    <Button
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          page: pagination.page + 1,
                        })
                      }
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
            sx={{
              width: "100%",
              boxShadow: theme.shadows[4],
              "& .MuiAlert-icon": {
                fontSize: "1.5rem",
              },
            }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default GarmentDashboard;
