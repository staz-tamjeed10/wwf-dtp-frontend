import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  FormControl,
  InputLabel,
  Box,
  // Chip,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import {
  Print as PrintIcon,
  ContentCopy as CopyIcon,
  FileDownload as DownloadIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  // Pets,
  CalendarToday,
  FilterAlt,
  Search as SearchIcon,
  Receipt,
  Numbers,
  Person,
  CheckCircle,
} from "@mui/icons-material";
import { format } from "date-fns";
import { fetchWithAuth } from "../utils/api";
import Navbar from "../components/Navbar";
// import BeefIcon from "/assets/beef.png";
// import MuttonIcon from "/assets/goat.png";

const SlaughterhouseDashboard = ({
  isHomePage = false,
  sectionRefs = {},
  activeNav,
  setActiveSection,
  userRole,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [filterType, setFilterType] = useState("all");
  const [usernameQuery, setUsernameQuery] = useState("");
  const [batchNoQuery, setBatchNoQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [selectedConfirmation, setSelectedConfirmation] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const styles = {
    container: {
      background: "#f8f9fa",
      minHeight: "100vh",
      py: isMobile ? 2 : 4,
      mt: isMobile ? 8 : 13,
    },
    header: {
      background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
      color: "white",
      py: 3,
      px: 4,
      borderRadius: "12px",
      mb: 3,
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
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
    filterCard: {
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      p: 3,
      mb: 3,
    },
    tableCard: {
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
    },
    tableHeader: {
      backgroundColor: "#2c3e50",
      "& th": {
        color: "white",
        fontWeight: 600,
      },
    },
    formInput: {
      "& .MuiInputLabel-root": { color: "#2c3e50" },
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#bdc3c7" },
        "&:hover fieldset": { borderColor: "#3498db" },
      },
    },
    primaryButton: {
      backgroundColor: "#3498db",
      "&:hover": {
        backgroundColor: "#2980b9",
      },
    },
    successButton: {
      backgroundColor: "#27ae60",
      "&:hover": {
        backgroundColor: "#219653",
      },
    },
    filterButton: {
      minWidth: isMobile ? "100%" : 120,
      height: 56, // Match text field height
    },
  };

  const getAnimalType = (productCode, batchNo) => {
    // Check both product code and batch number for animal type
    if (productCode === "B" || batchNo?.startsWith("B")) return "Beef";
    if (productCode === "M" || batchNo?.startsWith("M")) return "Mutton";
    return "Unknown";
  };

  const fetchData = useCallback(async () => {
    if (setActiveSection) {
      setActiveSection("Slaughterhouse Dashboard");
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        date: selectedDate,
        filter_type: filterType,
        username: usernameQuery,
        batch_no: batchNoQuery,
      }).toString();

      const response = await fetchWithAuth(
        `https://ret.bijlicity.com/api/traceability/leather-tags/?${params}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.detail || "Failed to fetch data"
        );
      }

      const result = await response.json();

      // Filter out entries with batch numbers starting with BR, MR, or M2
      const filteredData = (result.data || []).filter((tag) => {
        const batchNo = (tag.batch_no || "").toString().toUpperCase();
        return (
          !batchNo.startsWith("BR") &&
          !batchNo.startsWith("MR") &&
          !batchNo.startsWith("M2")
        );
      });

      setData(filteredData);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, filterType, usernameQuery, batchNoQuery, setActiveSection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGenerateTags = async () => {
    if (!selectedConfirmation) return;

    setGenerating(true);
    setError(null);
    try {
      const response = await fetchWithAuth(
        `https://ret.bijlicity.com/api/traceability/tag-generations/generate-tags/${selectedConfirmation}/`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg =
          errorData.error ||
          errorData.details ||
          errorData.message ||
          "Failed to generate tags";
        throw new Error(errorMsg);
      }

      const result = await response.json();
      setSuccess(result.message || "Tags generated successfully!");
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
      setOpenGenerateDialog(false);
    }
  };

  const handlePrintTags = (confirmationId) => {
    try {
      setLoading(true);
      setError(null);

      // Directly open PDF URL in new tab
      const printWindow = window.open(
        `https://ret.bijlicity.com/api/traceability/tag-generations/${confirmationId}/print-tags/`,
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

  const handleExportCSV = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    try {
      const response = await fetchWithAuth(
        `https://ret.bijlicity.com/api/traceability/export-tags/?start_date=${startDate}&end_date=${endDate}`
      );

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tags_${startDate}_to_${endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTagIdChange = (confirmationId, tagId) => {
    setSelectedTagIds((prev) => ({
      ...prev,
      [confirmationId]: tagId,
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => setSuccess("Copied to clipboard!"))
      .catch(() => setError("Failed to copy to clipboard"));
  };

  return (
    <>
      <Navbar
        sectionRefs={sectionRefs}
        activeNav={activeNav}
        setActiveSection={setActiveSection}
        isHomePage={isHomePage}
        userRole={userRole}
      />
      <Container maxWidth="xl" sx={styles.container}>
        {/* Header */}
        <Box sx={styles.header}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Hides Tags
            </Typography>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchData}
              disabled={loading}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                },
                minWidth: isMobile ? "100px" : "60px",
                textTransform: "capitalize",
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Paper sx={styles.filterCard}>
          <Typography variant="h6" sx={styles.sectionTitle}>
            Filters
          </Typography>

          {/* First Row - Main Filters */}
          <Stack direction={isMobile ? "column" : "row"} spacing={2} mb={2}>
            <TextField
              fullWidth={isMobile}
              label="Select Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={styles.formInput}
              InputProps={{
                startAdornment: <CalendarToday color="action" sx={{ mr: 1 }} />,
              }}
            />

            <FormControl fullWidth={isMobile} sx={styles.formInput}>
              <InputLabel>Animal Type</InputLabel>
              <Select
                value={filterType}
                label="Animal Type"
                onChange={(e) => setFilterType(e.target.value)}
                startAdornment={<FilterAlt color="action" sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="M">Mutton</MenuItem>
                <MenuItem value="B">Beef</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth={isMobile}
              label="Search by Username"
              value={usernameQuery}
              onChange={(e) => setUsernameQuery(e.target.value)}
              sx={styles.formInput}
              InputProps={{
                startAdornment: <Person color="action" sx={{ mr: 1 }} />,
              }}
            />

            <TextField
              fullWidth={isMobile}
              label="Search by Batch No"
              value={batchNoQuery}
              onChange={(e) => setBatchNoQuery(e.target.value)}
              sx={styles.formInput}
              InputProps={{
                startAdornment: <Numbers color="action" sx={{ mr: 1 }} />,
              }}
            />

            <Button
              variant="contained"
              onClick={fetchData}
              disabled={loading}
              sx={{
                ...styles.primaryButton,
                ...styles.filterButton,
              }}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Stack>

          {/* Second Row - Export Filters */}
          <Stack direction={isMobile ? "column" : "row"} spacing={2}>
            <TextField
              fullWidth={isMobile}
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={styles.formInput}
              InputProps={{
                startAdornment: <CalendarToday color="action" sx={{ mr: 1 }} />,
              }}
            />

            <TextField
              fullWidth={isMobile}
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={styles.formInput}
              InputProps={{
                startAdornment: <CalendarToday color="action" sx={{ mr: 1 }} />,
              }}
            />

            <Button
              fullWidth={isMobile}
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExportCSV}
              disabled={!startDate || !endDate || loading}
              sx={{
                ...styles.successButton,
                ...styles.filterButton,
              }}
            >
              Download CSV
            </Button>
          </Stack>
        </Paper>

        {/* Table */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress
              size={60}
              thickness={4}
              sx={{ color: "#3498db" }}
            />
          </Box>
        ) : (
          <Paper sx={styles.tableCard}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="hides tags table">
                <TableHead sx={styles.tableHeader}>
                  <TableRow>
                    <TableCell>Confirmation ID</TableCell>
                    <TableCell>Batch Number</TableCell>
                    <TableCell>No. of Animals</TableCell>
                    <TableCell>Animal Type</TableCell>
                    <TableCell>Total Prints</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Confirmed At</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Hide IDs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.length > 0 ? (
                    data.map((tag) => {
                      const animalType = getAnimalType(
                        tag.product_code,
                        tag.batch_no
                      );
                      return (
                        <TableRow key={tag.s_no} hover>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Receipt color="primary" />
                              {tag.s_no}
                            </Box>
                          </TableCell>
                          <TableCell>{tag.batch_no}</TableCell>
                          <TableCell>{tag.total_animals}</TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                  animalType === "Beef"
                                    ? (theme) => theme.palette.primary.main
                                    : (theme) => theme.palette.secondary.main,
                                color: "white",
                                borderRadius: "16px",
                                padding: "4px 12px",
                                height: "32px",
                                minWidth: "60px",
                              }}
                            >
                              <img
                                src={
                                  animalType === "Beef"
                                    ? "/assets/beef.png"
                                    : "/assets/goat.png"
                                }
                                alt={animalType}
                                style={{
                                  width: 45,
                                  height: 30,
                                  objectFit: "contain",
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>{tag.total_prints}</TableCell>
                          <TableCell>{tag.owner_name}</TableCell>
                          <TableCell>{tag.datetime}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                disabled={
                                  tag.tags_generated ||
                                  generating ||
                                  userRole === "visitor"
                                }
                                onClick={() => {
                                  setSelectedConfirmation(tag.s_no);
                                  setOpenGenerateDialog(true);
                                }}
                                startIcon={<CheckCircle />}
                              >
                                Generate
                              </Button>
                              <Tooltip title="Print Tags">
                                <IconButton
                                  color="primary"
                                  disabled={!tag.tags_generated || loading}
                                  onClick={() => handlePrintTags(tag.s_no)}
                                >
                                  <PrintIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {tag.tags_generated &&
                            tag.tag_ids &&
                            tag.tag_ids.length > 0 ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Select
                                  value={
                                    selectedTagIds[tag.s_no] || tag.tag_ids[0]
                                  }
                                  size="small"
                                  sx={{ minWidth: 120 }}
                                  onChange={(e) =>
                                    handleTagIdChange(tag.s_no, e.target.value)
                                  }
                                >
                                  {tag.tag_ids.map((tid) => (
                                    <MenuItem key={tid} value={tid}>
                                      {tid}
                                    </MenuItem>
                                  ))}
                                </Select>
                                <Tooltip title="Copy">
                                  <IconButton
                                    onClick={() =>
                                      copyToClipboard(
                                        selectedTagIds[tag.s_no] ||
                                          tag.tag_ids[0]
                                      )
                                    }
                                    size="small"
                                  >
                                    <CopyIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                Not available
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Generate Tags Dialog */}
        <Dialog
          open={openGenerateDialog}
          onClose={() => setOpenGenerateDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <DialogTitle
            sx={{ backgroundColor: "#f8f9fa", borderBottom: "1px solid #eee" }}
          >
            Generate Tags
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <DialogContentText>
              Are you sure you want to generate tags for confirmation ID:{" "}
              <strong>{selectedConfirmation}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: "1px solid #eee" }}>
            <Button
              onClick={() => setOpenGenerateDialog(false)}
              sx={{ color: "#2c3e50" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateTags}
              color="primary"
              variant="contained"
              disabled={generating}
              startIcon={
                generating ? <CircularProgress size={20} /> : <AddIcon />
              }
              sx={styles.primaryButton}
            >
              {generating ? "Generating..." : "Generate"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbars for notifications */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setError(null)}
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

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSuccess(null)}
            severity="success"
            sx={{
              width: "100%",
              boxShadow: theme.shadows[4],
              "& .MuiAlert-icon": {
                fontSize: "1.5rem",
              },
            }}
          >
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default SlaughterhouseDashboard;
