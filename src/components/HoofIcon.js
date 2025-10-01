// components/HoofIcon.js
import React from "react";
import { SvgIcon } from "@mui/material";

const HoofIcon = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12,2C13.66,2 15,3.34 15,5C15,5.95 14.6,6.79 14,7.38V8H10V7.38C9.4,6.79 9,5.95 9,5C9,3.34 10.34,2 12,2M10,9H14V10H10V9M10,11H14V16H10V11M16,16C16,16.55 15.55,17 15,17H9C8.45,17 8,16.55 8,16V15H16V16Z" />
    </SvgIcon>
  );
};

export default HoofIcon;
