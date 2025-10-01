import React from "react";
import { Card, CardContent, Box, styled } from "@mui/material";

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 500,
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  overflow: "visible",
  position: "relative",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "6px",
    background: "linear-gradient(90deg, #FF6B6B 0%, #4ECDC4 100%)",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
  },
}));

const AuthCard = ({ children, sx }) => {
  return (
    <Box display="flex" justifyContent="center" sx={{ px: 2, ...sx }}>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>{children}</CardContent>
      </StyledCard>
    </Box>
  );
};

export default AuthCard;
