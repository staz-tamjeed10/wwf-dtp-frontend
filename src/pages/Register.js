import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  Grid,
  StepLabel,
  Button,
  Alert,
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Divider,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  LocationCity as CityIcon,
  Place as PlaceIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  Verified as VerifiedIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import AuthCard from "../components/AuthCard";
import Navbar from "../components/Navbar";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const steps = [
  "Account Details",
  "Business Info",
  "Materials & Certifications",
  "Confirmation",
];

const Register = ({
  isHomePage = false,
  userRole,
  activeNav,
  setActiveSection,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    contact_person: "",
    registered_since: null,
    contact_no: "",
    role: "",
    brand: "",
    custom_brand: "",
    business_type: "",
    operation_type: "",
    leather_types: [],
    animal_types: [],
    city: "",
    custom_city: "",
    location: "",
    certifications: [],
    custom_certification: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [leatherDialogOpen, setLeatherDialogOpen] = useState(false);
  const [animalDialogOpen, setAnimalDialogOpen] = useState(false);
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Options data
  const roles = [
    { value: "slaughterhouse", label: "Slaughterhouse" },
    { value: "trader", label: "Trader" },
    { value: "tannery", label: "Tannery" },
    { value: "garment", label: "Garment" },
    { value: "visitor", label: "Visitor" },
  ];

  const brandOptions = {
    slaughterhouse: ["PAMCO"],
    trader: ["ABC_Trader"],
    tannery: ["LeatherField_Tannery"],
    garment: ["LeatherField_Garment"],
  };

  const operationTypes = [
    { value: "Raw", label: "Raw" },
    { value: "Raw to Wet", label: "Raw to Wet" },
    { value: "Wet to Finish", label: "Wet to Finish" },
    { value: "Raw to Finish", label: "Raw to Finish" },
  ];

  const cities = [
    { value: "Lahore", label: "Lahore" },
    { value: "Islamabad", label: "Islamabad" },
    { value: "Karachi", label: "Karachi" },
    { value: "Sialkot", label: "Sialkot" },
    { value: "Multan", label: "Multan" },
    { value: "Other", label: "Other" },
  ];

  const leatherTypes = [
    "Full grain",
    "Lining",
    "Patent",
    "Printed",
    "PU coated",
    "Skins",
    "Sole",
    "Split",
    "Suede",
    "Top Grain Split",
    "Wool-on",
    "Flesh/Drop Splits",
  ];

  const animalTypes = ["Cow", "Buffalo", "Sheep", "Goat", "Camel"];

  const certifications = [
    "ISO 14001",
    "ISO 9001",
    "ISO 50001",
    "LWG",
    "OEKO-TEX",
    "ZDHC",
    "CSCB",
    "SLF",
    "IVN Naturleader",
    "Other",
  ];

  const validateCurrentStep = () => {
    const newErrors = {};
    let isValid = true;

    if (activeStep === 0) {
      // Validate Account Details step
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
        isValid = false;
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
        isValid = false;
      }

      if (!formData.full_name.trim()) {
        newErrors.full_name = "Full name is required";
        isValid = false;
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
        isValid = false;
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
        isValid = false;
      } else if (formData.password.length < 4) {
        newErrors.password = "Password must be at least 4 characters";
        isValid = false;
      } else if (/^\d+$/.test(formData.password)) {
        newErrors.password = "Password cannot be entirely numeric";
        isValid = false;
      } else if (
        formData.password
          .toLowerCase()
          .includes(formData.username.toLowerCase())
      ) {
        newErrors.password = "Password cannot be too similar to your username";
        isValid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
        isValid = false;
      }
    } else if (activeStep === 1) {
      // Validate Business Info step
      if (!formData.contact_person.trim()) {
        newErrors.contact_person = "Contact person is required";
        isValid = false;
      }
      if (!formData.registered_since) {
        newErrors.registered_since = "Company registration date is required";
        isValid = false;
      } else if (new Date(formData.registered_since) > new Date()) {
        newErrors.registered_since =
          "Registration date cannot be in the future";
        isValid = false;
      }
      if (!formData.contact_no.trim()) {
        newErrors.contact_no = "Contact number is required";
        isValid = false;
      } else if (!/^\d+$/.test(formData.contact_no)) {
        newErrors.contact_no = "Contact number must contain only digits";
        isValid = false;
      }

      if (!formData.role) {
        newErrors.role = "Role is required";
        isValid = false;
      }

      if (
        ["slaughterhouse", "trader", "tannery", "garment"].includes(
          formData.role
        ) &&
        !formData.brand
      ) {
        newErrors.brand = "Brand is required for this role";
        isValid = false;
      }

      if (formData.brand === "Other" && !formData.custom_brand.trim()) {
        newErrors.custom_brand = "Brand name is required";
        isValid = false;
      }

      if (!formData.city) {
        newErrors.city = "City is required";
        isValid = false;
      } else if (formData.city === "Other" && !formData.custom_city.trim()) {
        newErrors.custom_city = "City name is required";
        isValid = false;
      }

      if (!formData.terms) {
        newErrors.terms = "You must accept the terms";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field changes
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Handle special cases
    if (name === "role") {
      setFormData((prev) => ({
        ...prev,
        brand: "",
        custom_brand: "",
      }));
    } else if (name === "brand" && value !== "Other") {
      setFormData((prev) => ({
        ...prev,
        custom_brand: "",
      }));
    } else if (name === "city" && value !== "Other") {
      setFormData((prev) => ({
        ...prev,
        custom_city: "",
      }));
    }
  };

  const handleToggleItem = (type, item) => {
    setFormData((prev) => {
      const currentItems = [...prev[type]];
      const index = currentItems.indexOf(item);

      if (index > -1) {
        currentItems.splice(index, 1);
      } else {
        currentItems.push(item);
      }

      return {
        ...prev,
        [type]: currentItems,
      };
    });
  };

  const handleToggleAll = (type, items) => {
    setFormData((prev) => {
      if (prev[type].length === items.length) {
        return { ...prev, [type]: [] };
      } else {
        return { ...prev, [type]: [...items] };
      }
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formattedRegisteredSince = formData.registered_since
        ? new Date(formData.registered_since).toISOString().split("T")[0]
        : null;

      const submissionData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        full_name: formData.full_name,
        contact_person: formData.contact_person,
        registered_since: formattedRegisteredSince,
        contact_no: formData.contact_no,
        role: formData.role,
        business_type: formData.business_type,
        operation_type: formData.operation_type,
        leather_types: formData.leather_types.join(", "),
        animal_types: formData.animal_types.join(", "),
        city: formData.city === "Other" ? formData.custom_city : formData.city,
        location: formData.location,
        brand:
          formData.brand === "Other" ? formData.custom_brand : formData.brand,
        certifications: formData.certifications.includes("Other")
          ? [
              ...formData.certifications.filter((c) => c !== "Other"),
              formData.custom_certification,
            ].join(", ")
          : formData.certifications.join(", "),
        terms: formData.terms,
      };

      const response = await fetch("https://ret.bijlicity.com/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        let backendErrors = {};

        if (data.email) {
          backendErrors.email = data.email[0];
        }

        if (data.password) {
          backendErrors.password = data.password.join(" ");
        }

        if (data.errors) {
          Object.keys(data.errors).forEach((key) => {
            if (!backendErrors[key]) {
              backendErrors[key] = data.errors[key][0];
            }
          });
        }

        setErrors(backendErrors);

        // Go back to the step with the first error
        const errorFields = Object.keys(backendErrors);
        const step0Fields = [
          "username",
          "full_name",
          "email",
          "password",
          "confirmPassword",
        ];
        const step1Fields = [
          "contact_person",
          "registered_since",
          "contact_no",
          "role",
          "brand",
          "custom_brand",
          "city",
          "custom_city",
          "terms",
        ];

        if (errorFields.some((field) => step0Fields.includes(field))) {
          setActiveStep(0);
        } else if (errorFields.some((field) => step1Fields.includes(field))) {
          setActiveStep(1);
        }

        return;
      }

      setSuccess(
        "Registration successful! Please check your email to verify your account."
      );
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setErrors({ ...errors, non_field_errors: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar
        isHomePage={isHomePage}
        userRole={userRole}
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
          p: isMobile ? 2 : 3, // Responsive padding
          mt: isMobile ? 7 : 13, // Consistent margin top
          width: "100%", // Use 100% instead of vw to prevent horizontal scroll
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
                Create Your Account
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Join us today and get started
              </Typography>
            </Box>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {errors.non_field_errors && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.non_field_errors}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                icon={<CheckCircleIcon fontSize="inherit" />}
                sx={{ mb: 3 }}
              >
                {success}
              </Alert>
            )}

            <Box>
              {activeStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TextField
                    fullWidth
                    label="Username *"
                    name="username"
                    variant="outlined"
                    margin="normal"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Full Name *"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    error={!!errors.full_name}
                    helperText={errors.full_name}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Email *"
                    name="email"
                    type="email"
                    variant="outlined"
                    margin="normal"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(0, 0, 0, 0.6)",
                      display: "block",
                      mt: -1,
                      mb: 2,
                    }}
                  >
                    Please be aware that the email address provided during
                    registration is permanent and cannot be modified.
                  </Typography>

                  <TextField
                    fullWidth
                    label="Password *"
                    name="password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Confirm Password *"
                    name="confirmPassword"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TextField
                    fullWidth
                    label="Contact Person *"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    error={!!errors.contact_person}
                    helperText={errors.contact_person}
                    sx={{ mb: 2 }}
                  />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Company Registration Date *"
                      value={formData.registered_since}
                      onChange={(newValue) => {
                        setFormData((prev) => ({
                          ...prev,
                          registered_since: newValue,
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          margin="normal"
                          error={!!errors.registered_since}
                          helperText={errors.registered_since}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <TextField
                    fullWidth
                    label="Contact Number *"
                    name="contact_no"
                    variant="outlined"
                    margin="normal"
                    value={formData.contact_no}
                    onChange={handleChange}
                    error={!!errors.contact_no}
                    helperText={errors.contact_no}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <FormControl fullWidth margin="normal" error={!!errors.role}>
                    <InputLabel>Role *</InputLabel>
                    <Select
                      label="Role *"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <BusinessIcon color="action" />
                        </InputAdornment>
                      }
                    >
                      {roles.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.role && (
                      <Typography variant="caption" color="error">
                        {errors.role}
                      </Typography>
                    )}
                  </FormControl>

                  {["slaughterhouse", "trader", "tannery", "garment"].includes(
                    formData.role
                  ) && (
                    <>
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.brand}
                      >
                        <InputLabel>Brand *</InputLabel>
                        <Select
                          label="Brand *"
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          startAdornment={
                            <InputAdornment position="start">
                              <BusinessIcon color="action" />
                            </InputAdornment>
                          }
                        >
                          {brandOptions[formData.role]?.map((brand) => (
                            <MenuItem key={brand} value={brand}>
                              {brand}
                            </MenuItem>
                          ))}
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                        {errors.brand && (
                          <Typography variant="caption" color="error">
                            {errors.brand}
                          </Typography>
                        )}
                      </FormControl>

                      {formData.brand === "Other" && (
                        <TextField
                          fullWidth
                          label="Brand Name *"
                          name="custom_brand"
                          variant="outlined"
                          margin="normal"
                          value={formData.custom_brand}
                          onChange={handleChange}
                          error={!!errors.custom_brand}
                          helperText={errors.custom_brand}
                          sx={{ mb: 2 }}
                        />
                      )}
                    </>
                  )}

                  <TextField
                    fullWidth
                    label="Business Type"
                    name="business_type"
                    variant="outlined"
                    margin="normal"
                    value={formData.business_type}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(0, 0, 0, 0.6)",
                      display: "block",
                      mt: -1,
                      mb: 2,
                    }}
                  >
                    The business type cannot be classified as an exporter
                  </Typography>

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Operation Type</InputLabel>
                    <Select
                      label="Operation Type"
                      name="operation_type"
                      value={formData.operation_type}
                      onChange={handleChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <BusinessIcon color="action" />
                        </InputAdornment>
                      }
                    >
                      {operationTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal" error={!!errors.city}>
                    <InputLabel>City *</InputLabel>
                    <Select
                      label="City *"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <CityIcon color="action" />
                        </InputAdornment>
                      }
                    >
                      {cities.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.city && (
                      <Typography variant="caption" color="error">
                        {errors.city}
                      </Typography>
                    )}
                  </FormControl>

                  {formData.city === "Other" && (
                    <TextField
                      fullWidth
                      label="City Name *"
                      name="custom_city"
                      variant="outlined"
                      margin="normal"
                      value={formData.custom_city}
                      onChange={handleChange}
                      error={!!errors.custom_city}
                      helperText={errors.custom_city}
                      sx={{ mb: 2 }}
                    />
                  )}

                  <TextField
                    fullWidth
                    label="Address"
                    name="location"
                    variant="outlined"
                    margin="normal"
                    value={formData.location}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PlaceIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.terms}
                        onChange={handleChange}
                        name="terms"
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the{" "}
                        <Link
                          to="/terms"
                          style={{ color: "#4f46e5", textDecoration: "none" }}
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          style={{ color: "#4f46e5", textDecoration: "none" }}
                        >
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                    sx={{ mb: 2 }}
                  />
                  {errors.terms && (
                    <Typography color="error" variant="caption">
                      {errors.terms}
                    </Typography>
                  )}
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box mb={4}>
                    <Typography variant="h6" gutterBottom>
                      Leather Types
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => setLeatherDialogOpen(true)}
                      startIcon={<CategoryIcon />}
                      endIcon={
                        formData.leather_types.length > 0 ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )
                      }
                      sx={{
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      {formData.leather_types.length > 0
                        ? `${formData.leather_types.length} selected`
                        : "Select Leather Types"}
                    </Button>
                    {formData.leather_types.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 3,
                        }}
                      >
                        {formData.leather_types.map((type) => (
                          <Chip
                            key={type}
                            label={type}
                            color="primary"
                            onDelete={() =>
                              handleToggleItem("leather_types", type)
                            }
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box mb={4}>
                    <Typography variant="h6" gutterBottom>
                      Animal Types
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => setAnimalDialogOpen(true)}
                      startIcon={<CategoryIcon />}
                      endIcon={
                        formData.animal_types.length > 0 ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )
                      }
                      sx={{
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      {formData.animal_types.length > 0
                        ? `${formData.animal_types.length} selected`
                        : "Select Animal Types"}
                    </Button>
                    {formData.animal_types.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 3,
                        }}
                      >
                        {formData.animal_types.map((type) => (
                          <Chip
                            key={type}
                            label={type}
                            color="primary"
                            onDelete={() =>
                              handleToggleItem("animal_types", type)
                            }
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Certifications
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => setCertDialogOpen(true)}
                      startIcon={<VerifiedIcon />}
                      endIcon={
                        formData.certifications.length > 0 ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )
                      }
                      sx={{
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      {formData.certifications.length > 0
                        ? `${formData.certifications.length} selected`
                        : "Select Certifications"}
                    </Button>
                    {formData.certifications.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 3,
                        }}
                      >
                        {formData.certifications.map((cert) => (
                          <Chip
                            key={cert}
                            label={cert}
                            color="primary"
                            onDelete={() =>
                              handleToggleItem("certifications", cert)
                            }
                          />
                        ))}
                      </Box>
                    )}
                    {formData.certifications.includes("Other") && (
                      <TextField
                        fullWidth
                        label="Custom Certification"
                        name="custom_certification"
                        value={formData.custom_certification}
                        onChange={handleChange}
                        sx={{ mt: 2 }}
                      />
                    )}
                  </Box>
                </motion.div>
              )}

              {activeStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      p: 3,
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      mb: 3,
                    }}
                  >
                    {/* Personal Information Section */}
                    <Typography variant="h6" gutterBottom>
                      Personal Information
                    </Typography>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: "#4f46e5", mr: 2 }}>
                        {formData.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>
                          {formData.full_name || "Not provided"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {formData.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold" }}
                        >
                          Contact Person:
                        </Typography>
                        <Typography>
                          {formData.contact_person || "Not provided"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold" }}
                        >
                          Contact Number:
                        </Typography>
                        <Typography>
                          {formData.contact_no || "Not provided"}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Business Information Section */}
                    <Typography variant="h6" gutterBottom>
                      Business Information
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                    >
                      <Chip
                        label={formData.role}
                        color="primary"
                        variant="outlined"
                      />
                      {formData.brand && (
                        <Chip
                          label={`Brand: ${
                            formData.brand === "Other"
                              ? formData.custom_brand
                              : formData.brand
                          }`}
                          variant="outlined"
                        />
                      )}
                      {formData.business_type && (
                        <Chip
                          label={`Business: ${formData.business_type}`}
                          variant="outlined"
                        />
                      )}
                      {formData.registered_since && (
                        <Chip
                          label={`Registered Since: ${formData.registered_since}`}
                          variant="outlined"
                        />
                      )}
                      {formData.operation_type && (
                        <Chip
                          label={`Operation: ${formData.operation_type}`}
                          variant="outlined"
                        />
                      )}
                      <Chip
                        label={`City: ${
                          formData.city === "Other"
                            ? formData.custom_city
                            : formData.city
                        }`}
                        variant="outlined"
                      />
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Address:</Typography>
                        <Typography>
                          {formData.location || "Not provided"}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Materials & Certifications Section */}
                    <Typography variant="h6" gutterBottom>
                      Materials & Certifications
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        {formData.leather_types.length > 0 ? (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">
                              Leather Types:
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {formData.leather_types.map((type) => (
                                <Chip key={type} label={type} size="small" />
                              ))}
                            </Box>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No leather types selected
                          </Typography>
                        )}
                      </Grid>

                      <Grid item xs={12} md={6}>
                        {formData.animal_types.length > 0 ? (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">
                              Animal Types:
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {formData.animal_types.map((type) => (
                                <Chip key={type} label={type} size="small" />
                              ))}
                            </Box>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No animal types selected
                          </Typography>
                        )}
                      </Grid>

                      <Grid item xs={12}>
                        {formData.certifications.length > 0 ? (
                          <Box>
                            <Typography variant="subtitle2">
                              Certifications:
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {formData.certifications.map((cert) => (
                                <Chip
                                  key={cert}
                                  label={
                                    cert === "Other"
                                      ? formData.custom_certification
                                      : cert
                                  }
                                  size="small"
                                />
                              ))}
                            </Box>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No certifications selected
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Box>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 3 }}
                  >
                    Please review your information before submitting. You'll
                    receive a verification email after submission.
                  </Typography>
                </motion.div>
              )}
            </Box>

            <Box display="flex" justifyContent="space-between" mt={4}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0 || isLoading}
                startIcon={<ArrowBackIcon />}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  sx={{
                    px: 4,
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
                  {isLoading ? "Submitting..." : "Complete Registration"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  sx={{
                    px: 4,
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
                  Next
                </Button>
              )}
            </Box>

            <Box textAlign="center" mt={4}>
              <Typography variant="body2" color="textSecondary">
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#4f46e5",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </AuthCard>
        </motion.div>

        {/* Multi-select Dialogs */}
        <MultiSelectDialog
          open={leatherDialogOpen}
          onClose={() => setLeatherDialogOpen(false)}
          title="Select Leather Types"
          items={leatherTypes}
          selectedItems={formData.leather_types}
          onToggleItem={(item) => handleToggleItem("leather_types", item)}
          onToggleAll={() => handleToggleAll("leather_types", leatherTypes)}
        />

        <MultiSelectDialog
          open={animalDialogOpen}
          onClose={() => setAnimalDialogOpen(false)}
          title="Select Animal Types"
          items={animalTypes}
          selectedItems={formData.animal_types}
          onToggleItem={(item) => handleToggleItem("animal_types", item)}
          onToggleAll={() => handleToggleAll("animal_types", animalTypes)}
        />

        <MultiSelectDialog
          open={certDialogOpen}
          onClose={() => setCertDialogOpen(false)}
          title="Select Certifications"
          items={certifications}
          selectedItems={formData.certifications}
          onToggleItem={(item) => handleToggleItem("certifications", item)}
          onToggleAll={() => handleToggleAll("certifications", certifications)}
        />
      </Container>
    </>
  );
};

// Reusable MultiSelectDialog component
const MultiSelectDialog = ({
  open,
  onClose,
  title,
  items,
  selectedItems,
  onToggleItem,
  onToggleAll,
}) => {
  const allSelected = items.length === selectedItems.length;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Button onClick={onToggleAll} variant="outlined" sx={{ mb: 2 }}>
          {allSelected ? "✖ Deselect All" : "✔ Select All"}
        </Button>
        <List>
          {items.map((item) => (
            <ListItem key={item}>
              <ListItemText primary={item} />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={selectedItems.includes(item)}
                  onChange={() => onToggleItem(item)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Register;
