import { Box, Typography, createTheme, ThemeProvider } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#424242",
    },
    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
    },
  },
});

const Footer = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        component="footer"
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          py: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2024 Dawid Studziżba
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

export default Footer;
