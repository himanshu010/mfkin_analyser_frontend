// Full-screen loading state shown during initial data fetch
import { Box, LinearProgress, Paper, Typography } from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";

const AppPreloader = ({ message = "Loading...", actions = null }) => (
  <Box className="app-preloader">
    <Paper className="app-preloader__card">
      <Box className="app-preloader__content">
        <Box className="app-preloader__header">
          <Box className="app-preloader__logo">
            <InsightsIcon />
          </Box>
          <Box>
            <Typography variant="h2">MFkin Analyser</Typography>
            <Typography variant="caption" color="text.secondary">
              Sector intelligence
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" className="app-preloader__message">
            {message}
          </Typography>
          <LinearProgress />
          {actions ? (
            <Box sx={{ mt: 1.5, display: "flex", justifyContent: "center" }}>{actions}</Box>
          ) : null}
        </Box>
        <Box className="app-preloader__skeleton">
          {[80, 60, 90, 45].map((width, index) => (
            <Box
              key={index}
              className="app-preloader__skeleton-line"
              style={{ width: `${width}%` }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  </Box>
);

export default AppPreloader;
