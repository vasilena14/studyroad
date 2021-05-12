import { createMuiTheme } from "@material-ui/core/styles";
import { amber } from "@material-ui/core/colors";

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
      contrastText: "#000",
    },
    openTitle: "#29516b",
    protectedTitle: "#f4b318",
    type: "light",
  },
});

export default theme;
