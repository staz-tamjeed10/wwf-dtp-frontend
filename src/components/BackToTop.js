import { useEffect, useState } from "react";
import { Fab } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function BackToTop({ setActiveSection }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (setActiveSection) setActiveSection("Home");
  };

  return visible ? (
    <Fab
      onClick={scrollToTop}
      size="small"
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1500,
        backgroundColor: "#007932",
        color: "white",
        "&:hover": {
          backgroundColor: "#005f26",
        },
      }}
    >
      <KeyboardArrowUpIcon />
    </Fab>
  ) : null;
}
