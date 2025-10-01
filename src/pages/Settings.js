import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { styled } from "@mui/material/styles";
import Navbar from "../components/Navbar";

const SettingsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 800,
  margin: "0 auto",
}));

const SettingsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  background: "linear-gradient(145deg, #f5f7fa, #ffffff)",
}));

const Settings = ({
  isHomePage = false,
  userRole,
  activeNav,
  setActiveSection,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://ret.bijlicity.com/api/auth/change-password/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            old_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.old_password?.[0] || "Failed to change password"
        );
      }

      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <>
      <Navbar
        isHomePage={isHomePage}
        userRole={userRole}
        activeNav={activeNav}
        setActiveSection={setActiveSection}
      />
      <SettingsContainer sx={{ mt: isMobile ? 6 : 12, p: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          Account Settings
        </Typography>

        <SettingsCard>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: "bold",
              mb: 3,
              display: "flex",
              alignItems: "center",
            }}
          >
            <LockIcon sx={{ mr: 1 }} /> Change Password
          </Typography>

          <form onSubmit={handlePasswordChange}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
            />

            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || userRole === "visitor"}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "Changing..." : "Change Password"}
              </Button>
            </Box>
          </form>

          <Divider sx={{ my: 4 }} />

          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            Account Actions
          </Typography>

          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                // Implement delete account functionality
              }}
              disabled={userRole === "visitor"}
            >
              Delete Account
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              disabled={userRole === "visitor"}
            >
              Logout All Devices
            </Button>
          </Box>
        </SettingsCard>

        <Snackbar
          open={!!error}
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

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            {success}
          </Alert>
        </Snackbar>
      </SettingsContainer>
    </>
  );
};

export default Settings;
