import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { motion } from "framer-motion";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Force full page reload to clear all state
    window.location.href = "/";
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Dialog open={true} onClose={handleCancel} maxWidth="xs" fullWidth>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                bgcolor: "error.main",
                mr: 2,
                width: 40,
                height: 40,
              }}
            >
              <LogoutIcon />
            </Avatar>
            <Typography variant="h6" fontWeight={600}>
              Confirm Logout
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout from your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCancel}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 4px 6px rgba(239, 68, 68, 0.2)",
              "&:hover": {
                boxShadow: "0 6px 8px rgba(239, 68, 68, 0.3)",
              },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
};

export default Logout;
