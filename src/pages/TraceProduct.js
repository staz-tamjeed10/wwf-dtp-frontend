import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  WaterDrop as WaterDropIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  LocalShipping as LocalShippingIcon,
  Public as PublicIcon,
  Verified as VerifiedIcon,
  QrCodeScanner as QrCodeScannerIcon,
} from "@mui/icons-material";

const TraceProduct = ({ result }) => {
  console.log("Result: ", result);
  const [expandedSections, setExpandedSections] = useState({
    productInfo: false,
    certifications: false,
    environmentalImpact: false,
    valueChain: false,
    careInstructions: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Process product types correctly
  const getProductTypes = () => {
    if (
      result?.garment?.product_types &&
      Array.isArray(result.garment.product_types)
    ) {
      return result.garment.product_types.join(", ");
    }
    if (
      result?.data?.product_types &&
      Array.isArray(result.data.product_types)
    ) {
      return result.data.product_types.join(", ");
    }
    return "Leather Product";
  };

  console.log("check::", result);

  // Mock data structure
  const productData = {
    productName: getProductTypes(),
    brand: result?.garment?.brand || result?.data?.brand || "Unknown Brand",
    materialType: result?.data?.product_types,
    tanningType: result?.data?.tannage_type,
    finish: "Pigmented",
    color: "#000000 (Black)",
    lining: "Cotton",
    hardware: "Nickel-free zippers, Recycled metal buckles",
    stitching: "Polyester thread, high-density, reinforced",
    size: "50x60 cm",
    weight: "1.2 kg",
    sizing: "Unisex",
    certifications: [
      { name: "Leather Working Group (LWG)", rating: "Gold-rated tannery" },
      {
        name: "ISO 14001",
        description: "Environmental Management System compliance",
      },
      {
        name: "REACH Compliance",
        description: "Chemical safety for EU markets",
      },
      { name: "SA8000 / Fair Trade", description: "Ethical labor practices" },
    ],
    environmentalImpact: {
      carbonFootprint: "15 kg CO₂e",
      waterUsage: "200 liters",
      chemicalUsage: "Low (Chrome-Free tanning)",
      recycledContent: "20% (recycled metal hardware)",
      circularityScore: "70/100",
    },
    valueChain: [
      {
        stage: "Raw Material Source",
        actor: "Slaughterhouse/PAMCO, Lahore",
        details: `${
          result?.data?.hide_source || "Cow"
        } Hide, Ethically sourced`,
      },
      {
        stage: "Tanning",
        actor:
          result?.data?.user.profile.full_name ||
          "Leather Field Tannery, Sialkot",
        details: result?.data?.tannage_type
          ? `${result.data.tannage_type} Tanning`
          : "Chrome-Free, Vegetable Tanning",
      },
      {
        stage: "Manufacturing",
        actor: result?.data?.tannery_name || "Leather Field Tannery, Sialkot",
        details: "Assembled in Sialkot, Pakistan",
      },
      {
        stage: "Brand/Labeling",
        actor: result?.garment?.brand || result?.data?.brand || "Unknown Brand",
        details: "Final Product",
      },
    ],
    careInstructions: [
      "Cleaning: Use a damp cloth with pH-neutral soap; avoid machine washing",
      "Conditioning: Apply natural leather conditioner every 6 months",
      "Storage: Store in a cool, dry place in a dust bag",
    ],
    origin: {
      sourcing: "Pakistan",
      tanning: "Pakistan",
      manufacturing: "Pakistan",
      transportMiles: "5000 miles",
    },
  };

  const renderCertificationBadge = (cert) => {
    return (
      <Chip
        icon={<VerifiedIcon />}
        label={cert.name}
        variant="outlined"
        sx={{
          m: 0.5,
          borderColor: "success.main",
          color: "success.dark",
        }}
      />
    );
  };

  const renderImpactMetric = (icon, label, value) => {
    return (
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Avatar
          sx={{
            bgcolor: "primary.light",
            width: 32,
            height: 32,
            mr: 1.5,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body1" fontWeight="500">
            {value}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Product Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          mb: 3,
          p: 2,
          backgroundColor: "#f9f9f9",
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: 120 },
            height: 120,
            backgroundColor: "#eee",
            borderRadius: 1,
            mb: { xs: 2, sm: 0 },
            mr: { xs: 0, sm: 3 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Product Image
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {productData.productName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {productData.brand}
          </Typography>
          <Chip
            label="Authentic Product"
            color="success"
            icon={<VerifiedIcon />}
            sx={{
              fontWeight: "bold",
              px: 1,
              py: 0.5,
            }}
          />
        </Box>
      </Box>

      {/* Product Information Section */}
      <Card sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            backgroundColor: "#f5f5f5",
            cursor: "pointer",
          }}
          onClick={() => toggleSection("productInfo")}
        >
          <Typography variant="h6" fontWeight="bold">
            Product Information
          </Typography>
          <IconButton size="small">
            {expandedSections.productInfo ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </IconButton>
        </Box>
        <Collapse in={expandedSections.productInfo}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Material Type
                </Typography>
                <Typography variant="body1">
                  {productData.materialType}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tanning Type
                </Typography>
                <Typography variant="body1">
                  {productData.tanningType}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Product Types
                </Typography>
                <Typography variant="body1">
                  {productData.productName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Finish
                </Typography>
                <Typography variant="body1">{productData.finish}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Color
                </Typography>
                <Typography variant="body1">{productData.color}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Lining
                </Typography>
                <Typography variant="body1">{productData.lining}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Hardware
                </Typography>
                <Typography variant="body1">{productData.hardware}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Stitching
                </Typography>
                <Typography variant="body1">{productData.stitching}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Size
                </Typography>
                <Typography variant="body1">{productData.size}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Weight
                </Typography>
                <Typography variant="body1">{productData.weight}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Sizing
                </Typography>
                <Typography variant="body1">{productData.sizing}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </Card>

      {/* Certifications Section */}
      <Card sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            backgroundColor: "#f5f5f5",
            cursor: "pointer",
          }}
          onClick={() => toggleSection("certifications")}
        >
          <Typography variant="h6" fontWeight="bold">
            Certifications & Standards
          </Typography>
          <IconButton size="small">
            {expandedSections.certifications ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </IconButton>
        </Box>
        <Collapse in={expandedSections.certifications}>
          <CardContent>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {productData.certifications.map((cert, index) =>
                renderCertificationBadge(cert)
              )}
            </Box>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {productData.certifications.map((cert, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ borderBottom: "none", py: 1 }}>
                        <Typography fontWeight="bold">{cert.name}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none", py: 1 }}>
                        {cert.rating || cert.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Collapse>
      </Card>

      {/* Environmental Impact Section */}
      <Card sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            backgroundColor: "#f5f5f5",
            cursor: "pointer",
          }}
          onClick={() => toggleSection("environmentalImpact")}
        >
          <Typography variant="h6" fontWeight="bold">
            Environmental Impact
          </Typography>
          <IconButton size="small">
            {expandedSections.environmentalImpact ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </IconButton>
        </Box>
        <Collapse in={expandedSections.environmentalImpact}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                {renderImpactMetric(
                  <PublicIcon fontSize="small" />,
                  "Carbon Footprint",
                  productData.environmentalImpact.carbonFootprint
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderImpactMetric(
                  <WaterDropIcon fontSize="small" />,
                  "Water Usage",
                  productData.environmentalImpact.waterUsage
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderImpactMetric(
                  <SettingsIcon fontSize="small" />,
                  "Chemical Usage",
                  productData.environmentalImpact.chemicalUsage
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderImpactMetric(
                  <WaterDropIcon fontSize="small" />,
                  "Recycled Content",
                  productData.environmentalImpact.recycledContent
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderImpactMetric(
                  <PublicIcon fontSize="small" />,
                  "Circularity Score",
                  productData.environmentalImpact.circularityScore
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </Card>

      {/* Value Chain Section */}
      <Card sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            backgroundColor: "#f5f5f5",
            cursor: "pointer",
          }}
          onClick={() => toggleSection("valueChain")}
        >
          <Typography variant="h6" fontWeight="bold">
            Value Chain Mapping
          </Typography>
          <IconButton size="small">
            {expandedSections.valueChain ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </IconButton>
        </Box>
        <Collapse in={expandedSections.valueChain}>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Stage</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Actor/Entity
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productData.valueChain.map((stage, index) => (
                    <TableRow key={index}>
                      <TableCell>{stage.stage}</TableCell>
                      <TableCell>{stage.actor}</TableCell>
                      <TableCell>{stage.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{ mt: 2, p: 2, backgroundColor: "#f9f9f9", borderRadius: 1 }}
            >
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Country of Origin & Manufacturing
              </Typography>
              <Typography variant="body2">
                <strong>Sourcing:</strong> {productData.origin.sourcing} •
                <strong> Tanning:</strong> {productData.origin.tanning} •
                <strong> Manufacturing:</strong>{" "}
                {productData.origin.manufacturing}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Transport Miles:</strong>{" "}
                {productData.origin.transportMiles}
              </Typography>
            </Box>
          </CardContent>
        </Collapse>
      </Card>

      {/* Care Instructions Section */}
      <Card sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            backgroundColor: "#f5f5f5",
            cursor: "pointer",
          }}
          onClick={() => toggleSection("careInstructions")}
        >
          <Typography variant="h6" fontWeight="bold">
            Care & Maintenance
          </Typography>
          <IconButton size="small">
            {expandedSections.careInstructions ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </IconButton>
        </Box>
        <Collapse in={expandedSections.careInstructions}>
          <CardContent>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {productData.careInstructions.map((instruction, index) => (
                <li key={index} style={{ marginBottom: 8 }}>
                  <Typography variant="body1">{instruction}</Typography>
                </li>
              ))}
            </ul>
          </CardContent>
        </Collapse>
      </Card>

      {/* Transaction History */}
      {result.transactions && result.transactions.length > 0 && (
        <Card>
          <Box sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
            <Typography variant="h6" fontWeight="bold">
              Transaction History
            </Typography>
          </Box>
          <CardContent>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Performed By
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.transactions.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              mr: 1,
                              bgcolor:
                                log.action === "arrived"
                                  ? "success.light"
                                  : log.action === "dispatched"
                                  ? "info.light"
                                  : "primary.light",
                            }}
                          >
                            {log.action === "arrived" ? (
                              <HomeIcon fontSize="small" />
                            ) : log.action === "dispatched" ? (
                              <LocalShippingIcon fontSize="small" />
                            ) : (
                              <QrCodeScannerIcon fontSize="small" />
                            )}
                          </Avatar>
                          {log.action.charAt(0).toUpperCase() +
                            log.action.slice(1)}
                        </Box>
                      </TableCell>
                      <TableCell>{log.user.username}</TableCell>
                      <TableCell>
                        {log.actor_type.charAt(0).toUpperCase() +
                          log.actor_type.slice(1)}
                      </TableCell>
                      <TableCell>{log.location || "N/A"}</TableCell>
                      <TableCell>{formatDate(log.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default TraceProduct;
