import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#DC143C",
          light: "#FCE8EC",
        },
        secondary: {
          main: "#FF0844",
        },
        error: {
          main: "#ff0000",
        },
        success: {
          main: "#42D042",
        },
        warning: {
          main: "#877D7D",
        },
      },
    },
  },
});

export default theme;
