import { Moon, Sparkles, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme, setTheme } from "../features/theme/themeSlice";
import Segmented from "./ui/Segmented.jsx";

const themeOptions = [
  { value: "light", ariaLabel: "Light", title: "Light", icon: Sun },
  { value: "dark", ariaLabel: "Dark", title: "Dark", icon: Moon },
  { value: "funky", ariaLabel: "Funky", title: "Funky", icon: Sparkles },
];

const ThemeSelector = ({ className }) => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);
  return (
    <Segmented
      className={className}
      label="Theme"
      onChange={(theme) => dispatch(setTheme(theme))}
      options={themeOptions}
      size="sm"
      value={currentTheme}
    />
  );
};

export default ThemeSelector;
