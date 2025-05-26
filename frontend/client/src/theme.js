import { createTheme, alpha } from '@mui/material/styles';

// Palette from user
const PALETTE = {
  lightGreenishGray: '#D8E2DC',
  white: '#FFFFFF',
  lightPink: '#FFCAD4',
  mediumPink: '#F4ACB7',
  taupe: '#9D8189',
};

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: PALETTE.mediumPink, // #F4ACB7
      contrastText: PALETTE.white,
    },
    secondary: {
      main: PALETTE.taupe, // #9D8189
      contrastText: PALETTE.white,
    },
    background: {
      default: PALETTE.white,
      paper: PALETTE.white,
    },
    text: {
      primary: '#4A4A4A', // Dark Gray for better contrast on white background
      secondary: PALETTE.taupe, // #9D8189
    },
    // Custom colors accessible via theme.palette.accentPink.main etc.
    accentPink: {
      main: PALETTE.lightPink,
      contrastText: PALETTE.taupe,
    },
    subtleBackground: {
      main: PALETTE.lightGreenishGray,
      contrastText: PALETTE.taupe,
    },
    neutralAlternate: { // For elements that need to be distinct but not primary/secondary
        main: PALETTE.lightGreenishGray,
        contrastText: PALETTE.taupe,
    },
    Button: {
        main: PALETTE.lightGreenishGray,
        contrastText: '#000000',
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
    borderRadius: 8, // Softer corners for components like Paper, Card, Button
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: PALETTE.white,
          color: PALETTE.taupe,
          boxShadow: `0px 2px 4px -1px ${alpha(PALETTE.taupe, 0.06)}`, // Softer shadow
          borderBottom: `1px solid ${PALETTE.lightGreenishGray}` // Subtle border
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Keep button text casing as is
          borderRadius: '16px', // Pill-shaped buttons
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: alpha(PALETTE.mediumPink, 0.85),
          },
        },
        containedSecondary: {
            backgroundColor: PALETTE.taupe,
            color: PALETTE.white,
          '&:hover': {
            backgroundColor: alpha(PALETTE.taupe, 0.85),
          },
        },
        outlinedPrimary : {
            borderColor: PALETTE.mediumPink,
            color: PALETTE.mediumPink,
             '&:hover': {
                backgroundColor: alpha(PALETTE.mediumPink, 0.08),
            }
        }
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px', // Pill-shaped chips
        },
        // Active tag in TagPostsPage (filled primary)
        filledPrimary: {
          backgroundColor: PALETTE.mediumPink,
          color: PALETTE.white,
          '&:hover': {
            backgroundColor: alpha(PALETTE.mediumPink, 0.85),
          },
        },
        // Inactive tags in TagPostsPage (outlined default)
        outlined: { 
          borderColor: PALETTE.lightGreenishGray,
          color: PALETTE.taupe,
          backgroundColor: alpha(PALETTE.lightGreenishGray, 0.2),
          '&:hover': {
            backgroundColor: alpha(PALETTE.lightGreenishGray, 0.4),
          },
        },
        // "Explore All" chip and other general purpose chips
        filledDefault: { // Used if variant="filled" and no color prop or color="default"
            backgroundColor: PALETTE.lightGreenishGray,
            color: PALETTE.taupe,
             '&:hover': {
                backgroundColor: alpha(PALETTE.lightGreenishGray, 0.7),
            }
        }
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                // Using background.paper (white by default)
                // Add a subtle border if needed, or rely on elevation/shadow
                 border: `1px solid ${PALETTE.lightGreenishGray}`,
                 boxShadow: 'none', // Remove default MUI card shadow if using border
            }
        }
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                 //border: `1px solid ${PALETTE.lightGreenishGray}`, // Optional: if all papers should have this border
            },
            elevation1: { // Default elevation for many Paper components (like in UserProfilePage)
                boxShadow: `0px 3px 6px ${alpha(PALETTE.taupe, 0.08)}`, // Softer custom shadow
            },
            elevation2: {
                boxShadow: `0px 4px 8px ${alpha(PALETTE.taupe, 0.1)}`,
            },
            elevation3: {
                 boxShadow: `0px 5px 10px ${alpha(PALETTE.taupe, 0.12)}`,
            }
        }
    },
    MuiIconButton: {
        styleOverrides: {
            root: {
                color: PALETTE.taupe, // Default icon button color
                '&:hover': {
                    backgroundColor: alpha(PALETTE.taupe, 0.08)
                }
            },
            colorPrimary: {
                color: PALETTE.mediumPink,
                 '&:hover': {
                    backgroundColor: alpha(PALETTE.mediumPink, 0.08)
                }
            }
        }
    },
    MuiLink: {
        styleOverrides: {
            root: {
                color: PALETTE.mediumPink, // Links should be primary color
                textDecorationColor: alpha(PALETTE.mediumPink, 0.4),
                '&:hover': {
                    textDecorationColor: PALETTE.mediumPink,
                }
            }
        }
    }
  },
});

export default theme; 