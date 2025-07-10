import { createTheme } from '@mui/material/styles';


const getCssVariable = (variable: any) =>
  getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

const customTheme = createTheme({
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&:hover': {
            color: getCssVariable('--white'), // Text color on hover
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        img: {
          'text-align': 'left',
        },
      },
    },
  },
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: getCssVariable('--light-gray'), // Body
          paper: '#ffffff', // Nav top and side bar
        },
        text: {
          primary: '#000000', // Text body
          secondary: '#000000', // Text Nav header
        },
        action: {
          hover: '#b1b1b1', // Hover Nav
        },
        primary: {
          light: '#f2cd51', //
          main: '#00658b', // Title text and main button color
          dark: '#00658b', //
          contrastText: '#000000', //
        },
        secondary: {
          light: '#f2cd51', //
          main: '#f2cd51', //
          dark: '#f2cd51', //
          contrastText: '#f2cd51', //
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: getCssVariable('--near-black'), // Body
          paper: getCssVariable('--near-black-dark'), // Nav top and side bar
        },
        text: {
          primary: getCssVariable('--white'), // Text body
          secondary: '#B3B9C6', // Text Nav header
        },
        action: {
          active: '#635BFF',
          hover: '#635BFF', // Hover Nav
        },
        primary: {
          light: getCssVariable('--purple'), //
          main: getCssVariable('--purple'), // Title text and main button color
          dark: '#a7d3ec', //
          contrastText: '#000000', //
        },
        secondary: {
          light: '#f2cd51', // var(--yellow)
          main: '#f2cd51', // var(--yellow)
          dark: '#f2cd51', // var(--yellow)
          contrastText: '#f2cd51', // var(--yellow)
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default customTheme;
