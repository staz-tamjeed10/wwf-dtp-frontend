import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  IconButton,
  InputAdornment,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  GitHub,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import AuthCard from "../components/AuthCard";
import { fetchWithAuth } from "../utils/api";
import Navbar from "../components/Navbar";

const Login = ({
  isHomePage = false,
  activeNav,
  setActiveSection,
  setUserRole,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (setActiveSection) {
      setActiveSection("");
    }
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate, setActiveSection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { email, password });

      const response = await fetch(
        "https://ret.bijlicity.com/api/auth/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();
      console.log("Login response:", response.status, data);

      if (!response.ok) {
        throw new Error(
          data.error || data.detail || "Login failed. Please try again."
        );
      }

      // Check if we got the expected response structure
      if (!data.token) {
        throw new Error("Invalid response from server: missing token");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("email", data.email);
      localStorage.setItem("username", data.username);

      // Fetch user profile to get role
      try {
        const profileResponse = await fetchWithAuth(
          "https://ret.bijlicity.com/api/auth/profile/"
        );

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log("Profile data:", profileData);

          const userRole = profileData.role?.toLowerCase() || "visitor";
          const isSuperuser =
            profileData.is_superuser || profileData.user?.is_superuser || false;

          setUserRole(userRole);
          localStorage.setItem("user_role", userRole);
          localStorage.setItem("is_superuser", isSuperuser.toString());

          // Redirect based on role and superuser status
          if (isSuperuser) {
            // Superusers go to default dashboard
            navigate("/dashboard");
          } else {
            const roleMap = {
              slaughterhouse: "/slaughterhouse-dashboard",
              trader: "/trader-dashboard",
              tannery: "/tannery-dashboard",
              garment: "/garment-dashboard",
              visitor: "/dashboard",
              admin: "/dashboard", // Regular admins (non-superuser) go to main dashboard
            };
            navigate(roleMap[userRole] || "/dashboard");
          }
        } else {
          console.warn("Failed to fetch profile, using default role");
          setUserRole("visitor");
          navigate("/dashboard");
        }
      } catch (profileError) {
        console.error("Profile fetch error:", profileError);
        setUserRole("visitor");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("email");
      localStorage.removeItem("username");
      localStorage.removeItem("user_role");
    } finally {
      setIsLoading(false);
    }
  };

  // Test with admin credentials (remove in production)
  // const fillAdminCredentials = () => {
  //   setEmail("tamjeed.dev@gmail.com");
  //   setPassword("ammunition"); // You'll need to know the actual password
  // };

  const fillVisitorCredentials = () => {
    setEmail("visitor@wwf.org");
    setPassword("user1234"); // You'll need to know the actual password
  };

  return (
    <>
      <Navbar
        isHomePage={isHomePage}
        activeNav={activeNav}
        setActiveSection={setActiveSection}
      />
      <Container
        maxWidth={false}
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          p: 0,
          mt: isMobile ? 3 : 13,
          width: "98vw",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AuthCard sx={{ mb: 4 }}>
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700, color: "#2d3748" }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Sign in to access your account
              </Typography>

              {/* Admin test button (remove in production) */}
              <Button
                variant="outlined"
                size="small"
                onClick={fillVisitorCredentials}
                sx={{ mt: 1, textTransform: "capitalize" }}
              >
                Login as Visitor for Demo
              </Button>
            </Box>

            {error && (
              <Fade in={!!error}>
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
                required
                type="email"
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
                required
              />

              <Box textAlign="right" mb={3}>
                <Link
                  to="/password-reset"
                  style={{
                    color: "#4f46e5",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  background:
                    "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
                  boxShadow: "0 4px 6px rgba(79, 70, 229, 0.2)",
                  "&:hover": {
                    boxShadow: "0 6px 8px rgba(79, 70, 229, 0.3)",
                  },
                }}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="textSecondary">
                  OR CONTINUE WITH
                </Typography>
              </Divider>

              <Box display="flex" justifyContent="center" gap={2} mb={3}>
                <IconButton
                  sx={{
                    border: "1px solid #e2e8f0",
                    "&:hover": { backgroundColor: "#f8fafc" },
                  }}
                >
                  <Google sx={{ color: "#DB4437" }} />
                </IconButton>
                <IconButton
                  sx={{
                    border: "1px solid #e2e8f0",
                    "&:hover": { backgroundColor: "#f8fafc" },
                  }}
                >
                  <Facebook sx={{ color: "#4267B2" }} />
                </IconButton>
                <IconButton
                  sx={{
                    border: "1px solid #e2e8f0",
                    "&:hover": { backgroundColor: "#f8fafc" },
                  }}
                >
                  <GitHub sx={{ color: "#333" }} />
                </IconButton>
              </Box>

              <Box textAlign="center">
                <Typography variant="body2" color="textSecondary">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{
                      color: "#4f46e5",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </AuthCard>
        </motion.div>
      </Container>
    </>
  );
};

export default Login;
