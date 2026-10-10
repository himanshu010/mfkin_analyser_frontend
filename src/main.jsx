import { MotionConfig } from "framer-motion";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import App from "./App.jsx";
import { store } from "./app/store.js";
import { selectTheme } from "./features/theme/themeSlice.js";
import "./styles/index.css";

const themes = ["light", "dark", "funky"];

// The theme is a set of CSS variables keyed by <html data-theme>.
const ThemedApp = () => {
  const currentTheme = useSelector(selectTheme);
  React.useEffect(() => {
    document.documentElement.dataset.theme = themes.includes(currentTheme) ? currentTheme : "light";
  }, [currentTheme]);
  return <App />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <MotionConfig reducedMotion="user">
        <ThemedApp />
      </MotionConfig>
    </Provider>
  </React.StrictMode>
);
