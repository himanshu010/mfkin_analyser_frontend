import React from "react";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";

const AppPreloader = ({ message = "Loading sector catalog..." }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #FCE8C8 0%, #F5F0E6 45%, #EDF2F3 100%)",
      }}
    >
      <Stack spacing={3} alignItems="center">
        <Box
          sx={{
            background: "#FFE3C2",
            color: "#0F4C5C",
            borderRadius: 3,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DashboardIcon sx={{ fontSize: 48 }} />
        </Box>
        <Typography variant="h2" sx={{ color: "#0F4C5C" }}>
          MF Analyser
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={24} sx={{ color: "#0F4C5C" }} />
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AppPreloader;
