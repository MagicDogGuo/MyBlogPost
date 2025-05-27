import { createTheme, alpha } from '@mui/material/styles';

// New Palette based on the image
const PALETTE = {
  darkBlueGray: '#2B2D42',
  mediumBlueGray: '#8D99AE',
  lightBlueGray: '#EDF2F4',
  brightRed: 'rgb(246, 77, 97)',
  darkRed: 'rgb(246, 77, 97)',
  white: '#FFFFFF',
  black: '#000000',
};

export { PALETTE }; // Export PALETTE

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: PALETTE.brightRed,    //rgb(246, 77, 97)
      contrastText: PALETTE.white,
    },
    secondary: {
      main: PALETTE.darkRed,       // Now rgb(246, 77, 97)
      contrastText: PALETTE.white,
    },
    error: {
      main: PALETTE.darkRed,       // Now rgb(246, 77, 97)
      contrastText: PALETTE.white,
    },
    warning: {
      main: PALETTE.mediumBlueGray, // Using mediumBlueGray as no orange/yellow
      contrastText: PALETTE.darkBlueGray, 
    },
    info: {
      main: PALETTE.mediumBlueGray,
      contrastText: PALETTE.white,
    },
    success: {
      main: PALETTE.darkBlueGray, // Using a distinct color from the palette
      contrastText: PALETTE.white,
    },
    background: {
      default: PALETTE.lightBlueGray, // #EDF2F4 as main background
      paper: PALETTE.white,          // For cards, dialogs, etc.
    },
    text: {
      primary: PALETTE.darkBlueGray,   // #2B2D42
      secondary: PALETTE.mediumBlueGray, // #8D99AE
    },
    // Custom colors, remapped from originals
    accent: { // Was accentPink
      main: PALETTE.brightRed,
      contrastText: PALETTE.white,
    },
    subtleBackground: { // Was lightGreenishGray and taupe
      main: PALETTE.lightBlueGray,
      contrastText: PALETTE.darkBlueGray,
    },
    neutralAlternate: { // Was lightGreenishGray and taupe
        main: PALETTE.mediumBlueGray,
        contrastText: PALETTE.white,
    },
    button_donate: { // Retaining and remapping this key
        main: PALETTE.brightRed, 
        contrastText: PALETTE.white, 
        dark: alpha(PALETTE.brightRed, 0.7), // Added dark variant for hover states etc.
    }
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: PALETTE.white, // Or PALETTE.darkBlueGray for a dark app bar
          color: PALETTE.darkBlueGray,      // Text color on app bar
          boxShadow: `0px 2px 4px -1px ${alpha(PALETTE.darkBlueGray, 0.1)}`,
          borderBottom: `1px solid ${alpha(PALETTE.mediumBlueGray, 0.3)}`
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '16px',
        },
        containedPrimary: {
          // Uses palette.primary.main (PALETTE.brightRed) and palette.primary.contrastText (PALETTE.white)
          '&:hover': {
            backgroundColor: alpha(PALETTE.brightRed, 0.85),
          },
        },
        containedSecondary: {
          // Uses palette.secondary.main (PALETTE.darkRed) and palette.secondary.contrastText (PALETTE.white)
          '&:hover': {
            backgroundColor: alpha(PALETTE.darkRed, 0.85),
          },
        },
        outlinedPrimary : {
            borderColor: PALETTE.brightRed,
            color: PALETTE.brightRed,
             '&:hover': {
                backgroundColor: alpha(PALETTE.brightRed, 0.08),
            }
        }
        // Add other button variants if needed (e.g., outlinedSecondary, textSecondary)
        // based on the new palette. For instance:
        // outlinedSecondary: {
        //   borderColor: PALETTE.darkRed,
        //   color: PALETTE.darkRed,
        //   '&:hover': {
        //     backgroundColor: alpha(PALETTE.darkRed, 0.08),
        //   },
        // },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
        filledPrimary: { // Active tag
          backgroundColor: PALETTE.brightRed,
          color: PALETTE.white,
          '&:hover': {
            backgroundColor: alpha(PALETTE.brightRed, 0.85),
          },
        },
        outlined: { // Inactive tags
          borderColor: PALETTE.mediumBlueGray,
          color: PALETTE.darkBlueGray,
          backgroundColor: alpha(PALETTE.mediumBlueGray, 0.1),
          '&:hover': {
            backgroundColor: alpha(PALETTE.mediumBlueGray, 0.25),
          },
        },
        filledDefault: { // "Explore All" chip
            backgroundColor: PALETTE.mediumBlueGray,
            color: PALETTE.white, // Good contrast with mediumBlueGray
             '&:hover': {
                backgroundColor: alpha(PALETTE.mediumBlueGray, 0.8),
            }
        }
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                 border: `1px solid ${alpha(PALETTE.mediumBlueGray, 0.3)}`, // Softer border
                 boxShadow: 'none',
            }
        }
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                 // background.paper is PALETTE.white
            },
            elevation1: { 
                boxShadow: `0px 3px 6px ${alpha(PALETTE.darkBlueGray, 0.08)}`, 
            },
            elevation2: {
                boxShadow: `0px 4px 8px ${alpha(PALETTE.darkBlueGray, 0.1)}`,
            },
            elevation3: {
                 boxShadow: `0px 5px 10px ${alpha(PALETTE.darkBlueGray, 0.12)}`,
            }
        }
    },
    MuiIconButton: {
        styleOverrides: {
            root: {
                color: PALETTE.mediumBlueGray,
                '&:hover': {
                    backgroundColor: alpha(PALETTE.mediumBlueGray, 0.08)
                }
            },
            colorPrimary: {
                color: PALETTE.brightRed,
                 '&:hover': {
                    backgroundColor: alpha(PALETTE.brightRed, 0.08)
                }
            }
        }
    },
    MuiLink: {
        styleOverrides: {
            root: {
                color: PALETTE.brightRed, 
                textDecorationColor: alpha(PALETTE.brightRed, 0.4),
                '&:hover': {
                    textDecorationColor: PALETTE.brightRed,
                }
            }
        }
    }
  },
});

export default theme; 