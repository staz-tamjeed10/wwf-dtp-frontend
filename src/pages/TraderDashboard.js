import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  Paper,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  Container,
  useMediaQuery,
} from "@mui/material";
import {
  Search as SearchIcon,
  LocalShipping as DispatchIcon,
  Home as ArriveIcon,
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";
import { fetchWithAuth } from "../utils/api";
import Navbar from "../components/Navbar";

const TraderDashboard = ({
  isHomePage = false,
  sectionRefs = {},
  activeNav,
  setActiveSection,
  userRole,
}) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [transactions, setTransactions] = useState([]);
  const [transactionLoading, setTransactionLoading] = useState(true);
  const [transactionError, setTransactionError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  const styles = {
    container: {
      background: "#f8f9fa",
      minHeight: "100vh",
      py: isMobile ? 2 : 4,
      mt: isMobile ? 8 : 13,
      width: "100%",
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
      width: "100%",
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
    if (setActiveSection) {
      setActiveSection("Trader Dashboard");
    }
    const fetchProfile = async () => {
      try {
        const response = await fetchWithAuth(
          "https://ret.bijlicity.com/api/trader/dashboard/"
        );
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to load profile");
        }
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setActiveSection]);

  const handleAction = async (action) => {
    if (!searchId.trim()) {
      setError("Please enter a valid ID");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetchWithAuth(
        "https://ret.bijlicity.com/api/trader/transaction/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            search_id: searchId.trim().toUpperCase(),
            action: action,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.success);
      } else {
        setError(data.error || "Transaction failed");
      }
    } catch (err) {
      setError(err.message || "Transaction failed");
    } finally {
      setLoading(false);
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
          setTransactions(data.transactions || data); // Handle both formats
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

  if (loading && !profile) {
    return (
      <Box sx={styles.container}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "#192752" }} />
        </Box>
      </Box>
    );
  }

  if (error && !profile) {
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
        {profile && (
          <>
            <Card sx={styles.transactionCard}>
              <Typography variant="h5" sx={styles.sectionTitle}>
                Manage Transactions
              </Typography>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Enter Hide/Skin Tag ID"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="e.g. ABC12345"
                  InputProps={{
                    endAdornment: <SearchIcon color="action" />,
                    sx: {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  className="arrive"
                  sx={styles.actionButton}
                  startIcon={<ArriveIcon />}
                  onClick={() => handleAction("arrived")}
                  disabled={loading || userRole === "visitor"}
                >
                  {loading ? "Processing..." : "Mark as Arrived"}
                </Button>

                <Button
                  variant="contained"
                  className="dispatch"
                  sx={styles.actionButton}
                  startIcon={<DispatchIcon />}
                  onClick={() => handleAction("dispatched")}
                  disabled={loading || userRole === "visitor"}
                >
                  {loading ? "Processing..." : "Mark as Dispatched"}
                </Button>
              </Box>
            </Card>
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
                            Tag ID
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
                            Action
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
                              {formatDate(txn.arrival_date)}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {formatDate(txn.dispatch_date)}
                            </td>
                            <td style={{ padding: "12px" }}>
                              {txn.dispatch_date
                                ? "Dispatched to Tannery"
                                : txn.arrival_date
                                ? "Arrived at Trader"
                                : "Unknown"}
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
                        setPagination({
                          ...pagination,
                          page: pagination.page - 1,
                        })
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

export default TraderDashboard;
