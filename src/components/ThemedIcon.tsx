import { useTheme } from '@mui/material/styles';




interface ThemedIconProps {
  iconForLight: string;
  iconForDark: string;
  style?: React.CSSProperties;
}

const ThemedIcon: React.FC<ThemedIconProps> = ({
  iconForLight,
  iconForDark,
  style = { width: '30px', height: '30px' },
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return <img src={isDarkMode ? iconForDark : iconForLight} alt="Logo" style={style} />;
};

export default ThemedIcon;
