import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    fontFamily: `'Montserrat', sans-serif`,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
  palette: {
    primary: {
      light: "#577d99",
      main: "#29516b",
      dark: "#002940",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ffe554",
      main: "#f4b318",
      dark: "#bc8400",
      contrastText: "#fff",
    },
    openTitle: "#29516b",
    successful: "#6bbc45",
    inProgress: "#42c6cc",
    protectedTitle: "#f4b318",
    type: "light",
  },
});

export default theme;
