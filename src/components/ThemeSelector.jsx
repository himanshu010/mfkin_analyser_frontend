import { useDispatch, useSelector } from "react-redux";
import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { setTheme, selectTheme } from "../features/theme/themeSlice";

const themeOptions = [
  { key: "light", label: "Light", icon: <LightModeIcon fontSize="small" /> },
  { key: "dark", label: "Dark", icon: <DarkModeIcon fontSize="small" /> },
  { key: "funky", label: "Funky", icon: <AutoAwesomeIcon fontSize="small" /> },
];

const ThemeSelector = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);

  const handleChange = (_, newTheme) => {
    if (newTheme) dispatch(setTheme(newTheme));
  };

  return (
    <div className="theme-selector">
      <ToggleButtonGroup
        value={currentTheme}
        exclusive
        onChange={handleChange}
        size="small"
        aria-label="theme selector"
      >
        {themeOptions.map((option) => (
          <ToggleButton key={option.key} value={option.key} aria-label={option.label}>
            <Tooltip title={option.label}>{option.icon}</Tooltip>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
};

export default ThemeSelector;
