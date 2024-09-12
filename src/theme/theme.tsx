import { PaletteMode } from "@mui/material";
import { grey, red, blue, green } from "@mui/material/colors";

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#19747E",
            contrastText: grey[900],
          },
          secondary: {
            main: blue[500],
            contrastText: "#fff",
          },
          error: {
            main: red[700],
            contrastText: "#fff",
          },
          warning: {
            main: "#FFA726",
            contrastText: "#000",
          },
          info: {
            main: blue[700],
            contrastText: "#fff",
          },
          success: {
            main: green[500],
            contrastText: "#fff",
          },
          divider: grey[200],
          background: {
            default: "#FFFFFF",
            paper: grey[50],
          },
          text: {
            primary: grey[900],
            secondary: grey[500],
          },
          border: {
            light: grey[300],
            dark: grey[400],
          },
        }
      : {
          primary: {
            main: grey[900],
            contrastText: "#fff",
          },
          secondary: {
            main: blue[300],
            contrastText: "#000",
          },
          error: {
            main: red[500],
            contrastText: "#fff",
          },
          warning: {
            main: "#FFB74D",
            contrastText: "#000",
          },
          info: {
            main: blue[200],
            contrastText: "#000",
          },
          success: {
            main: green[400],
            contrastText: "#fff",
          },
          divider: grey[800],
          background: {
            default: grey[800],
            paper: grey[900],
          },
          text: {
            primary: "#FFFFFF",
            secondary: "#FFFFFF",
          },
          border: {
            light: "#FFFFFF",
            dark: "#FFFFFF",
          },
        }),
  },
});

export default getDesignTokens;
