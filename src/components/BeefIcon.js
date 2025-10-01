import React from "react";
import { SvgIcon } from "@mui/material";

const BeefIcon = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {/* Cow head silhouette */}
      <path
        fill="currentColor"
        d="M12,2C8.14,2 5,5.14 5,9c0,2.38 1.19,4.47 3,5.74V17h8v-2.26c1.81-1.27 3-3.36 3-5.74C19,5.14 15.86,2 12,2M12,4.5c1.93,0 3.5,1.57 3.5,3.5c0,1.58-1.06,2.91-2.5,3.32V16h-2V11.32c-1.44-0.41-2.5-1.74-2.5-3.32C8.5,6.07 10.07,4.5 12,4.5M12,6A1.5,1.5 0 0,0 10.5,7.5A1.5,1.5 0 0,0 12,9A1.5,1.5 0 0,0 13.5,7.5A1.5,1.5 0 0,0 12,6Z"
      />
    </SvgIcon>
  );
};

export default BeefIcon;
