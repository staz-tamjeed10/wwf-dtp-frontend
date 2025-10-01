import React from "react";
import { SvgIcon } from "@mui/material";

const MuttonIcon = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {/* Goat/Sheep head silhouette with horns */}
      <path
        fill="currentColor"
        d="M12,2C9.24,2 7,4.24 7,7c0,1.57 0.8,2.95 2,3.74V15h6v-4.26c1.2-0.79 2-2.17 2-3.74C17,4.24 14.76,2 12,2M12,4.5c1.38,0 2.5,1.12 2.5,2.5c0,0.94-0.54,1.76-1.33,2.17V14h-2.34V9.17C9.04,8.76 8.5,7.94 8.5,7C8.5,5.62 9.62,4.5 11,4.5H12M10.5,7A1.5,1.5 0 0,0 12,5.5A1.5,1.5 0 0,0 10.5,7A1.5,1.5 0 0,0 12,8.5A1.5,1.5 0 0,0 10.5,7Z"
      />
      {/* Horns */}
      <path fill="currentColor" d="M8,4L7,3L6,4V5H8V4Z" />
      <path fill="currentColor" d="M18,4L17,3L16,4V5H18V4Z" />
    </SvgIcon>
  );
};

export default MuttonIcon;
