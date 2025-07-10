import { useTheme } from '@mui/material/styles';

interface LogoProps {
  lightLogo: string;
  darkLogo: string;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({
  lightLogo,
  darkLogo,
  style = { width: '30px', height: '30px' },
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return <img src={isDarkMode ? darkLogo : lightLogo} alt="Logo" style={style} />;
};

export default Logo;
