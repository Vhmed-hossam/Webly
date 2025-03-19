
// Material UI
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "transparent",
        border: "1px solid #DC143C",
        color: "#DC143C",
        textAlign: "center",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="body2" color="primary.light">
          © 2025 Webly™ bg Vhmed. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}
