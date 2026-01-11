import React from "react";
import { Box, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";

const AppPreloader = ({ message = "Loading sector catalog..." }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #F9E6D7 0%, #F6F1EC 45%, #ECF0EF 100%)",
        p: 3,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 520, width: "100%" }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #FDE1C1, #CDE6E4)",
                color: "#1F5460",
              }}
            >
              <InsightsIcon />
            </Box>
            <Box>
              <Typography variant="h2">MF Analyser</Typography>
              <Typography variant="body2" color="text.secondary">
                Preparing dashboards and rankings
              </Typography>
            </Box>
          </Stack>
          <Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {message}
            </Typography>
            <LinearProgress />
          </Box>
          <Stack spacing={1}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  height: 10,
                  borderRadius: 999,
                  background:
                    "linear-gradient(90deg, rgba(31,84,96,0.08), rgba(31,84,96,0.02))",
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AppPreloader;
