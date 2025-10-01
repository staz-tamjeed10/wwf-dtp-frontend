import { useState, useEffect, useRef, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Divider,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../logo.svg";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function Navbar({
  isHomePage = false,
  sectionRefs = {},
  activeNav,
  setActiveSection,
  userRole,
  isSuperuser = false,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0 });
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
  const [visitorMenuAnchor, setVisitorMenuAnchor] = useState(null);
  const [currentDashboard, setCurrentDashboard] = useState("");
  const manualNavChangeRef = useRef(false);
  const token = localStorage.getItem("token");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is superuser from props or localStorage
  const isAdmin =
    isSuperuser || localStorage.getItem("is_superuser") === "true";
  const isVisitor = userRole === "visitor";

  // Dashboard options for superuser and visitor - wrapped in useMemo
  const dashboardOptions = useMemo(
    () => [
      {
        label: "Slaughterhouse Dashboard",
        path: "/slaughterhouse-dashboard",
        key: "slaughterhouse",
        icon: <DashboardIcon />,
      },
      {
        label: "Trader Dashboard",
        path: "/trader-dashboard",
        key: "trader",
        icon: <DashboardIcon />,
      },
      {
        label: "Tannery Dashboard",
        path: "/tannery-dashboard",
        key: "tannery",
        icon: <DashboardIcon />,
      },
      {
        label: "Garment Dashboard",
        path: "/garment-dashboard",
        key: "garment",
        icon: <DashboardIcon />,
      },
    ],
    []
  );

  // Set current dashboard based on URL
  useEffect(() => {
    const currentPath = location.pathname;
    const currentOption = dashboardOptions.find(
      (option) =>
        currentPath.includes(option.key) || currentPath === option.path
    );

    if (currentOption) {
      setCurrentDashboard(currentOption.label);
      setActiveSection(currentOption.label);
    } else if (currentPath === "/dashboard") {
      setCurrentDashboard("Main Dashboard");
      setActiveSection("Home");
    }
  }, [location.pathname, dashboardOptions, setActiveSection]);

  const baseNavItems = useMemo(() => {
    const items = ["Home", "About", "Features", "News & Events", "Partners"];

    // For regular users (non-superusers and non-visitors), show their specific dashboard
    if (userRole && !isAdmin && !isVisitor) {
      if (userRole === "slaughterhouse") {
        items.push("Slaughterhouse Dashboard");
      } else if (userRole === "trader") {
        items.push("Trader Dashboard");
      } else if (userRole === "tannery") {
        items.push("Tannery Dashboard");
      } else if (userRole === "garment") {
        items.push("Garment Dashboard");
      }
    }

    return items;
  }, [userRole, isAdmin, isVisitor]);

  const [navItems, setNavItems] = useState(baseNavItems);
  const navRefs = useRef({});

  useEffect(() => {
    setNavItems(baseNavItems);
  }, [baseNavItems]);

  useEffect(() => {
    if (!isMobile && drawerOpen) {
      setDrawerOpen(false);
    }
  }, [isMobile, drawerOpen]);

  useEffect(() => {
    if (manualNavChangeRef.current || !isHomePage) {
      manualNavChangeRef.current = false;
      return;
    }

    const el = navRefs.current[activeNav];
    if (el) {
      const { offsetLeft, offsetWidth } = el;
      setHighlightStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeNav, isHomePage, navItems]);

  const handleLogoClick = () => {
    if (userRole) {
      // If user is logged in, navigate to their dashboard
      navigate(getDashboardPath(userRole, isAdmin));
    } else {
      // If user is not logged in, navigate to main dashboard
      navigate("/dashboard");
    }
    setDrawerOpen(false);
  };

  const handleNavClick = (label) => {
    if (typeof setActiveSection !== "function") {
      console.error("setActiveSection is not a function");
      return;
    }

    manualNavChangeRef.current = true;

    const dashboardPaths = {
      "Slaughterhouse Dashboard": "/slaughterhouse-dashboard",
      "Trader Dashboard": "/trader-dashboard",
      "Tannery Dashboard": "/tannery-dashboard",
      "Garment Dashboard": "/garment-dashboard",
    };

    if (dashboardPaths[label]) {
      navigate(dashboardPaths[label]);
      setActiveSection(label);
      setCurrentDashboard(label);
      const el = navRefs.current[label];
      if (el) {
        const { offsetLeft, offsetWidth } = el;
        setHighlightStyle({ left: offsetLeft, width: offsetWidth });
      }
    } else {
      if (isHomePage) {
        const ref = sectionRefs?.[label]?.current;
        if (ref) {
          const navbarOffset = isMobile ? 60 : 120;
          const top =
            ref.getBoundingClientRect().top + window.scrollY - navbarOffset;
          window.scrollTo({ top, behavior: "smooth" });
          setTimeout(() => setActiveSection(label), 400);
        }
      } else {
        navigate("/dashboard");
        setTimeout(() => {
          const ref = sectionRefs?.[label]?.current;
          if (ref) {
            const navbarOffset = isMobile ? 60 : 120;
            const top =
              ref.getBoundingClientRect().top + window.scrollY - navbarOffset;
            window.scrollTo({ top, behavior: "smooth" });
            setActiveSection(label);
          }
        }, 100);
      }
    }

    setDrawerOpen(false);
  };

  const handleTraceNow = () => {
    navigate("/trace");
    setDrawerOpen(false);
  };

  const handleAdminMenuOpen = (event) => {
    setAdminMenuAnchor(event.currentTarget);
  };

  const handleVisitorMenuOpen = (event) => {
    setVisitorMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAdminMenuAnchor(null);
    setVisitorMenuAnchor(null);
  };

  const handleDashboardSelect = (dashboardPath, label) => {
    navigate(dashboardPath);
    setActiveSection(label);
    setCurrentDashboard(label);
    handleMenuClose();
    setDrawerOpen(false);
  };

  // Get current dashboard icon based on selection
  const getDashboardIcon = () => {
    if (!currentDashboard) return <DashboardIcon />;
    return <DashboardIcon />;
  };

  // Get menu title based on user type
  const getMenuTitle = () => {
    if (isAdmin) return "Admin Dashboards";
    if (isVisitor) return "View Dashboards";
    return "Select Dashboard";
  };

  // Get menu anchor based on user type
  const getMenuAnchor = () => {
    if (isAdmin) return adminMenuAnchor;
    if (isVisitor) return visitorMenuAnchor;
    return null;
  };

  // Check if any menu is open
  const isMenuOpen = Boolean(adminMenuAnchor) || Boolean(visitorMenuAnchor);

  const getDashboardPath = (role, isAdminUser) => {
    if (!role) return "/dashboard";

    if (isAdminUser || role === "visitor") {
      return "/slaughterhouse-dashboard"; // Default dashboard for admin/visitor
    }

    const roleMap = {
      slaughterhouse: "/slaughterhouse-dashboard",
      trader: "/trader-dashboard",
      tannery: "/tannery-dashboard",
      garment: "/garment-dashboard",
    };

    return roleMap[role] || "/dashboard";
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          zIndex: 1300,
          backgroundColor: "white",
          height: isMobile ? "60px" : "120px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: isMobile ? "space-between" : "flex-end",
            minHeight: "30px !important",
            paddingX: 2,
            gap: 1,
          }}
        >
          {!isMobile && (
            <>
              {token ? (
                <>
                  <Button
                    component={Link}
                    to="/profile"
                    color="inherit"
                    startIcon={<AccountCircleIcon />}
                    size="small"
                    sx={{ textTransform: "capitalize", color: "#ee8b22" }}
                  >
                    Profile
                  </Button>
                  <Button
                    component={Link}
                    to="/settings"
                    color="inherit"
                    startIcon={<SettingsIcon />}
                    size="small"
                    sx={{ textTransform: "capitalize", color: "#ee8b22" }}
                  >
                    Settings
                  </Button>
                  <Button
                    component={Link}
                    to="/logout"
                    color="inherit"
                    startIcon={<LogoutIcon />}
                    size="small"
                    sx={{ textTransform: "capitalize", color: "#ee8b22" }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  color="inherit"
                  startIcon={<LoginIcon />}
                  size="small"
                  sx={{ textTransform: "capitalize", color: "#ee8b22" }}
                >
                  Login/Signup
                </Button>
              )}

              <Button
                color="inherit"
                startIcon={<ContactMailIcon />}
                size="small"
                sx={{ textTransform: "capitalize", color: "#ee8b22" }}
              >
                Contact Us
              </Button>
            </>
          )}
        </Toolbar>

        {(isHomePage ||
          location.pathname.includes("dashboard") ||
          location.pathname === "/profile" ||
          location.pathname === "/settings" ||
          location.pathname === "/login" ||
          location.pathname === "/register" ||
          location.pathname === "/trace") && (
          <Toolbar
            sx={{
              justifyContent: "space-between",
              minHeight: "60px !important",
              paddingX: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "60%",
                mb: isMobile ? 0 : 3,
                maxWidth: isMobile ? "75%" : "300px",
                position: "relative",
                gap: 2,
                flex: 1,
                left: -5,
                cursor: "pointer", // Add cursor pointer to indicate it's clickable
              }}
              onClick={handleLogoClick} // Add onClick handler to the entire logo container
            >
              <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{
                  height: isMobile ? 150 : 260,
                  width: isMobile ? 150 : 260,
                  flexShrink: 0,
                  // Optional: Add hover effect to indicate interactivity
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            </Box>

            {isMobile ? (
              <IconButton
                onClick={() => setDrawerOpen(!drawerOpen)}
                sx={{ color: "#162850", bottom: isMobile ? 1 : 12 }}
              >
                <MenuIcon fontSize="large" />
              </IconButton>
            ) : (
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: `${highlightStyle.left}px`,
                    width: `${highlightStyle.width}px`,
                    height: "34px",
                    backgroundColor: "#ee8b22",
                    borderBottomLeftRadius: "12px",
                    borderBottomRightRadius: "12px",
                    transition: "left 0.4s ease, width 0.4s ease",
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                />

                <Box
                  sx={{
                    height: "6px",
                    width: "100%",
                    backgroundColor: "#ee8b22",
                    borderRadius: "4px",
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    height: "24px",
                    position: "relative",
                    zIndex: 1,
                    gap: 0,
                  }}
                >
                  {navItems.map((label) => (
                    <Box
                      key={label}
                      ref={(el) => (navRefs.current[label] = el)}
                      sx={{
                        position: "relative",
                        height: "34px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingX: 1.5,
                      }}
                    >
                      {activeNav === label && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#ee8b22",
                            borderBottomLeftRadius: "12px",
                            borderBottomRightRadius: "12px",
                            zIndex: 0,
                          }}
                        />
                      )}

                      <Button
                        color="inherit"
                        onClick={() => handleNavClick(label)}
                        disableRipple
                        disableFocusRipple
                        disableElevation
                        sx={{
                          zIndex: 1,
                          height: "100%",
                          width: "100%",
                          textTransform: "capitalize",
                          fontWeight: "bold",
                          fontSize: "0.95rem",
                          lineHeight: 1.2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          backgroundColor: "transparent",
                          color: activeNav === label ? "#fff" : "#ee8b22",
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                          "&:active": {
                            backgroundColor: "transparent",
                          },
                          "&:focus": {
                            outline: "none",
                          },
                        }}
                      >
                        {label}
                      </Button>
                    </Box>
                  ))}

                  {/* Dashboard Dropdown for Admin and Visitor */}
                  {(isAdmin || isVisitor) && (
                    <Box
                      sx={{
                        position: "relative",
                        height: "34px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingX: 1.5,
                      }}
                    >
                      <Button
                        color="inherit"
                        onClick={
                          isAdmin ? handleAdminMenuOpen : handleVisitorMenuOpen
                        }
                        endIcon={<ArrowDropDownIcon />}
                        startIcon={getDashboardIcon()}
                        disableRipple
                        disableFocusRipple
                        disableElevation
                        sx={{
                          zIndex: 1,
                          height: "100%",
                          textTransform: "capitalize",
                          fontWeight: "bold",
                          fontSize: "0.95rem",
                          backgroundColor: currentDashboard
                            ? "#ee8b22"
                            : "transparent",
                          color: currentDashboard ? "#fff" : "#ee8b22",
                          "&:hover": {
                            backgroundColor: currentDashboard
                              ? "#d97d1e"
                              : "transparent",
                          },
                          minWidth: "200px",
                          borderRadius: currentDashboard ? "12px" : "inherit",
                          borderBottomLeftRadius: currentDashboard
                            ? "12px"
                            : "inherit",
                          borderBottomRightRadius: currentDashboard
                            ? "12px"
                            : "inherit",
                        }}
                      >
                        {currentDashboard || getMenuTitle()}
                      </Button>
                    </Box>
                  )}

                  {/* Visitor badge */}
                  {isVisitor && (
                    <Tooltip title="View-only access. All modification actions are disabled.">
                      <Chip
                        icon={<VisibilityIcon />}
                        label="Visitor"
                        size="small"
                        color="info"
                        sx={{ ml: 1, fontSize: "0.7rem" }}
                      />
                    </Tooltip>
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleTraceNow}
                    startIcon={<QrCodeScannerIcon />}
                    sx={{
                      ml: 2,
                      backgroundColor: "#162850",
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                  >
                    Trace Now
                  </Button>
                </Box>
              </Box>
            )}
          </Toolbar>
        )}
      </AppBar>

      {/* Dashboard Menu for Admin and Visitor */}
      <Menu
        anchorEl={getMenuAnchor()}
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: "#fff",
            color: "#162850",
            mt: 1,
            maxHeight: 300,
          },
        }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2" fontWeight="bold">
            {getMenuTitle()}
          </Typography>
          {isVisitor && (
            <Chip
              label="View Only"
              size="small"
              color="info"
              sx={{ ml: 1, fontSize: "0.6rem" }}
            />
          )}
        </MenuItem>
        <Divider />
        {dashboardOptions.map((option) => (
          <MenuItem
            key={option.path}
            onClick={() => handleDashboardSelect(option.path, option.label)}
            selected={currentDashboard === option.label}
            sx={{
              "&:hover": {
                backgroundColor: "#ee8b22",
                color: "white",
              },
              "&.Mui-selected": {
                backgroundColor: "#ee8b22",
                color: "white",
                "&:hover": {
                  backgroundColor: "#d97d1e",
                },
              },
            }}
          >
            {option.icon && <Box sx={{ mr: 1 }}>{option.icon}</Box>}
            {option.label}
            {isVisitor && (
              <VisibilityIcon sx={{ ml: 1, fontSize: "1rem", opacity: 0.7 }} />
            )}
          </MenuItem>
        ))}
        {isVisitor && (
          <>
            <Divider />
            <MenuItem disabled>
              <Typography
                variant="caption"
                sx={{ fontStyle: "italic", color: "text.secondary" }}
              >
                Visitor accounts have view-only access to all dashboards
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#111",
            color: "white",
            width: 260,
            padding: 2,
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 7 }}>
          {(isHomePage ||
            location.pathname.includes("dashboard") ||
            location.pathname === "/profile" ||
            location.pathname === "/settings" ||
            location.pathname === "/login" ||
            location.pathname === "/register" ||
            location.pathname === "/trace") && (
            <>
              {navItems.map((label) => (
                <Button
                  key={label}
                  onClick={() => handleNavClick(label)}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "capitalize",
                    fontWeight: activeNav === label ? "bold" : "normal",
                    backgroundColor:
                      activeNav === label ? "#ee8b22" : "transparent",
                    color: activeNav === label ? "white" : "inherit",
                    borderRadius: 1,
                  }}
                >
                  {label}
                </Button>
              ))}

              {/* Dashboard Options in Mobile Sidebar for Admin and Visitor */}
              {(isAdmin || isVisitor) && (
                <>
                  <Divider sx={{ backgroundColor: "grey", my: 2 }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#ee8b22", px: 1 }}
                  >
                    {getMenuTitle()}
                    {isVisitor && " (View Only)"}
                  </Typography>
                  {dashboardOptions.map((option) => (
                    <Button
                      key={option.path}
                      onClick={() =>
                        handleDashboardSelect(option.path, option.label)
                      }
                      startIcon={option.icon || <DashboardIcon />}
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "capitalize",
                        color:
                          currentDashboard === option.label
                            ? "#ee8b22"
                            : "inherit",
                        fontWeight:
                          currentDashboard === option.label ? "bold" : "normal",
                        borderRadius: 1,
                      }}
                    >
                      {option.label}
                      {isVisitor && (
                        <VisibilityIcon
                          sx={{ ml: 1, fontSize: "1rem", opacity: 0.7 }}
                        />
                      )}
                    </Button>
                  ))}
                </>
              )}

              <Divider sx={{ backgroundColor: "grey", my: 2 }} />
            </>
          )}

          {token && (
            <>
              <Button
                component={Link}
                to="/profile"
                startIcon={<AccountCircleIcon />}
                color="inherit"
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "capitalize",
                }}
              >
                Profile
              </Button>
              <Button
                component={Link}
                to="/settings"
                startIcon={<SettingsIcon />}
                color="inherit"
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "capitalize",
                }}
              >
                Settings
              </Button>
              <Divider sx={{ backgroundColor: "grey", my: 2 }} />
            </>
          )}

          {token ? (
            <Button
              component={Link}
              to="/logout"
              startIcon={<LogoutIcon />}
              color="inherit"
              sx={{
                justifyContent: "flex-start",
                textTransform: "capitalize",
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              component={Link}
              to="/login"
              startIcon={<LoginIcon />}
              color="inherit"
              sx={{
                justifyContent: "flex-start",
                textTransform: "capitalize",
              }}
            >
              Login/Signup
            </Button>
          )}

          <Button
            component={Link}
            to="/contact"
            startIcon={<ContactMailIcon />}
            color="inherit"
            sx={{
              justifyContent: "flex-start",
              textTransform: "capitalize",
            }}
          >
            Contact Us
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleTraceNow}
            startIcon={<QrCodeScannerIcon />}
            sx={{
              mt: 2,
              backgroundColor: "#162850",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            Trace Now
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
