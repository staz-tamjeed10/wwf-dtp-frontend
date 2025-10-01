import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  // Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Avatar,
  Fade,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person,
  Schedule,
  Business,
  VerifiedUser,
  LocationOn,
  Pets,
  // Info,
  Style,
  Email as EmailIcon,
  Phone as PhoneIcon,
  // Lock as LockIcon,
  // LockOpen as LockOpenIcon,
  // ContactMail as ContactMailIcon,
  // Work as WorkIcon,
  // School as SchoolIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Navbar from "../components/Navbar";

const businessTypeOptions = [
  { value: "Manufacturer", label: "Manufacturer" },
  { value: "Supplier", label: "Supplier" },
  { value: "Retailer", label: "Retailer" },
  { value: "Wholesaler", label: "Wholesaler" },
];

const operationTypeOptions = [
  { value: "Raw", label: "Raw" },
  { value: "Raw to Wet", label: "Raw to Wet" },
  { value: "Wet to Finish", label: "Wet to Finish" },
  { value: "Raw to Finish", label: "Raw to Finish" },
];

const cityOptions = [
  { value: "Lahore", label: "Lahore" },
  { value: "Islamabad", label: "Islamabad" },
  { value: "Karachi", label: "Karachi" },
  { value: "Sialkot", label: "Sialkot" },
  { value: "Multan", label: "Multan" },
];

const ProfileContainer = styled(Box)(({ theme }) => ({
  background: "#f8f9fa",
  minHeight: "100vh",
  py: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    py: theme.spacing(2),
  },
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  overflow: "hidden",
  maxWidth: 1200,
  margin: "0 auto",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
  },
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
  color: "white",
  padding: theme.spacing(4),
  textAlign: "center",
}));

const ProfileContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: "0 auto",
  border: `4px solid ${theme.palette.primary.main}`,
  [theme.breakpoints.down("sm")]: {
    width: 80,
    height: 80,
  },
}));

const ProfileFieldContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: 8,
  backgroundColor: theme.palette.background.paper,
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ProfileFieldLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
}));

const ProfileFieldValue = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "1rem",
  color: theme.palette.text.primary,
}));

const ProfileField = ({
  label,
  value,
  editable,
  onChange,
  fieldKey,
  icon,
  options,
  type = "text",
}) => {
  if (editable) {
    if (options) {
      return (
        <FormControl fullWidth margin="normal">
          <InputLabel>{label}</InputLabel>
          <Select
            label={label}
            value={value || ""}
            onChange={(e) => onChange(fieldKey, e.target.value)}
            startAdornment={
              <InputAdornment position="start">{icon}</InputAdornment>
            }
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        fullWidth
        label={label}
        value={value || ""}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        type={type}
        variant="outlined"
        margin="normal"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{icon}</InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
    );
  }

  return (
    <ProfileFieldContainer>
      <ProfileFieldLabel>
        {icon}
        {label}
      </ProfileFieldLabel>
      <ProfileFieldValue>{value || "Not provided"}</ProfileFieldValue>
    </ProfileFieldContainer>
  );
};

const Profile = ({
  isHomePage = false,
  userRole,
  activeNav,
  setActiveSection,
  isSuperuser = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [profile, setProfile] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const isVisitor = userRole === "visitor";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "https://ret.bijlicity.com/api/auth/profile/",
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfile(data);
        setEditableData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        if (err.message.includes("401")) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleFieldChange = (fieldKey, value) => {
    setEditableData((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      // Properly format array fields
      const formatArrayField = (field) => {
        if (!field) return [];
        if (Array.isArray(field)) {
          if (field.length > 0 && field[0].length === 1) {
            const reconstructed = field.join("");
            return reconstructed
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item);
          }
          return field;
        }
        if (typeof field === "string") {
          return field
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
        }
        return [];
      };

      const payload = {
        user: {
          username: editableData.user?.username,
          first_name: editableData.user?.first_name || "",
          last_name: editableData.user?.last_name || "",
        },
        full_name: editableData.full_name || "",
        contact_person: editableData.contact_person || "",
        contact_no: editableData.contact_no || "",
        brand: editableData.brand || "",
        business_type: editableData.business_type || "",
        operation_type: editableData.operation_type || "",
        city: editableData.city || "",
        location: editableData.location || "",
        animal_types: formatArrayField(editableData.animal_types),
        leather_types: formatArrayField(editableData.leather_types),
        certifications: formatArrayField(editableData.certifications),
      };

      const response = await fetch(
        "https://ret.bijlicity.com/api/auth/profile/update/",
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response:", responseText);
        throw new Error("Server returned invalid JSON");
      }

      if (!response.ok) {
        console.error("Backend error response:", responseData);
        throw new Error(
          responseData.message ||
            responseData.error ||
            "Failed to update profile"
        );
      }

      setProfile(responseData);
      setEditableData(responseData);
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Full error:", err);
      setError(err.message || "An error occurred while updating profile");
    }
  };

  const handleCancel = () => {
    setEditableData(profile);
    setIsEditing(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  const formatArrayData = (data) => {
    if (!data) return [];

    if (
      Array.isArray(data) &&
      data.some((item) => typeof item === "string" && item.length === 1)
    ) {
      const combinedString = data.join("");
      return combinedString
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    if (Array.isArray(data)) {
      return data.filter((item) => item && item.trim().length > 0);
    }

    if (typeof data === "string") {
      return data
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    return [];
  };

  const renderChips = (items) => {
    const formattedItems = formatArrayData(items);

    if (formattedItems.length === 0) {
      return (
        <Typography variant="body2" color="textSecondary">
          Not provided
        </Typography>
      );
    }

    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
        {formattedItems.map((item, index) => (
          <Chip
            key={index}
            label={item}
            size="small"
            sx={{
              backgroundColor: "#e0e0e0",
              borderRadius: "16px",
              padding: "0 8px",
              margin: "2px",
              fontSize: "0.8125rem",
            }}
          />
        ))}
      </Box>
    );
  };

  const renderEditButton = () => {
    if (isVisitor) {
      return (
        <Typography color="textSecondary" variant="body2">
          Profile editing is disabled for visitor accounts.
        </Typography>
      );
    }

    return (
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => setIsEditing(!isEditing)}
          sx={{ textTransform: "none" }}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
        {isEditing && (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ textTransform: "none" }}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
          </>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Fade in={loading} style={{ transitionDelay: "200ms" }}>
          <CircularProgress size={60} thickness={4} sx={{ color: "#3498db" }} />
        </Fade>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography variant="h6">No profile data available</Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar
        isHomePage={isHomePage}
        userRole={userRole}
        activeNav={activeNav}
        setActiveSection={setActiveSection}
        isSuperuser={isSuperuser}
      />
      <ProfileContainer sx={{ p: isMobile ? 2 : 4, mt: isMobile ? 8 : 13 }}>
        <ProfileCard>
          <ProfileHeader>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: 700, letterSpacing: "0.5px" }}
            >
              My Profile
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              {profile.business_type || "Professional Profile"}
              {isVisitor && " (Visitor Account)"}
            </Typography>
          </ProfileHeader>

          <ProfileContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
              flexDirection={isMobile ? "column" : "row"}
              gap={2}
            >
              <Box display="flex" alignItems="center" gap={3}>
                <ProfileAvatar>
                  {profile.user?.username?.charAt(0).toUpperCase() || (
                    <Person />
                  )}
                </ProfileAvatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {profile.user?.username}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {profile.role}
                    {isVisitor && " - View Only Access"}
                  </Typography>
                </Box>
              </Box>
              {renderEditButton()}
            </Box>

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{ mb: 3 }}
            >
              <Tab
                label="Personal Info"
                icon={<Person />}
                iconPosition="start"
              />
              <Tab
                label="Business Info"
                icon={<Business />}
                iconPosition="start"
              />
              <Tab
                label="Materials & Certifications"
                icon={<Style />}
                iconPosition="start"
              />
            </Tabs>

            {tabValue === 0 && (
              <Card sx={{ mb: 3 }}>
                <CardHeader
                  title="Personal Information"
                  avatar={<Person color="primary" />}
                  titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <ProfileField
                        label="Username"
                        value={editableData.user?.username}
                        editable={isEditing && !isVisitor}
                        onChange={handleFieldChange}
                        fieldKey="user.username"
                        icon={<Person fontSize="small" />}
                      />
                      <ProfileField
                        label="Full Name"
                        value={editableData.full_name}
                        editable={isEditing && !isVisitor}
                        onChange={handleFieldChange}
                        fieldKey="full_name"
                        icon={<Person fontSize="small" />}
                      />
                      <ProfileField
                        label="Contact Person"
                        value={editableData.contact_person}
                        editable={isEditing && !isVisitor}
                        onChange={handleFieldChange}
                        fieldKey="contact_person"
                        icon={<Person fontSize="small" />}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ProfileField
                        label="Email"
                        value={profile.user?.email}
                        editable={false}
                        icon={<EmailIcon fontSize="small" />}
                      />
                      <ProfileField
                        label="Contact Number"
                        value={editableData.contact_no}
                        editable={isEditing && !isVisitor}
                        onChange={handleFieldChange}
                        fieldKey="contact_no"
                        icon={<PhoneIcon fontSize="small" />}
                      />
                      <ProfileField
                        label="Brand"
                        value={editableData.brand}
                        editable={isEditing && !isVisitor}
                        onChange={handleFieldChange}
                        fieldKey="brand"
                        icon={<Business fontSize="small" />}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {tabValue === 1 && (
              <Card sx={{ mb: 3 }}>
                <CardHeader
                  title="Business Information"
                  avatar={<Business color="primary" />}
                  titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <ProfileField
                        label="Business Type"
                        value={editableData.business_type}
                        editable={isEditing && !isVisitor}
                        onChange={handleFieldChange}
                        fieldKey="business_type"
                        icon={<Business fontSize="small" />}
                        options={businessTypeOptions}
                      />
                      <ProfileField
                        label="Operation Type"
                        value={editableData.operation_type}
                        editable={isEditing && !isVisitor}
                        onChange={handleFieldChange}
                        fieldKey="operation_type"
                        icon={<Business fontSize="small" />}
                        options={operationTypeOptions}
                      />
                      <ProfileField
                        label="City"
                        value={editableData.city}
                        editable={isEditing && !isVisitor}
                        onChange={handleFieldChange}
                        fieldKey="city"
                        icon={<LocationOn fontSize="small" />}
                        options={cityOptions}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ProfileField
                        label="Registered Since"
                        value={profile.registered_since}
                        editable={false}
                        icon={<Schedule fontSize="small" />}
                      />
                      <ProfileField
                        label="Address"
                        value={editableData.location}
                        editable={isEditing && !isVisitor}
                        onChange={handleFieldChange}
                        fieldKey="location"
                        icon={<LocationOn fontSize="small" />}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {tabValue === 2 && (
              <Card sx={{ mb: 3 }}>
                <CardHeader
                  title="Materials & Certifications"
                  avatar={<Style color="primary" />}
                  titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <ProfileFieldContainer>
                        <ProfileFieldLabel>
                          <Pets fontSize="small" />
                          Animal Types
                        </ProfileFieldLabel>
                        {isEditing && !isVisitor ? (
                          <TextField
                            fullWidth
                            value={
                              Array.isArray(editableData.animal_types)
                                ? editableData.animal_types.join(", ")
                                : editableData.animal_types || ""
                            }
                            onChange={(e) =>
                              handleFieldChange("animal_types", e.target.value)
                            }
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          renderChips(profile.animal_types)
                        )}
                      </ProfileFieldContainer>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ProfileFieldContainer>
                        <ProfileFieldLabel>
                          <Style fontSize="small" />
                          Leather Types
                        </ProfileFieldLabel>
                        {isEditing && !isVisitor ? (
                          <TextField
                            fullWidth
                            value={formatArrayData(
                              editableData.leather_types
                            ).join(", ")}
                            onChange={(e) =>
                              handleFieldChange("leather_types", e.target.value)
                            }
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          renderChips(profile.leather_types)
                        )}
                      </ProfileFieldContainer>
                    </Grid>
                    <Grid item xs={12}>
                      <ProfileFieldContainer>
                        <ProfileFieldLabel>
                          <VerifiedUser fontSize="small" />
                          Certifications
                        </ProfileFieldLabel>
                        {isEditing && !isVisitor ? (
                          <TextField
                            fullWidth
                            value={formatArrayData(
                              editableData.certifications
                            ).join(", ")}
                            onChange={(e) =>
                              handleFieldChange(
                                "certifications",
                                e.target.value
                              )
                            }
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          renderChips(profile.certifications)
                        )}
                      </ProfileFieldContainer>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </ProfileContent>
        </ProfileCard>

        <Snackbar
          open={!!error}
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

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
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
      </ProfileContainer>
    </>
  );
};

export default Profile;
