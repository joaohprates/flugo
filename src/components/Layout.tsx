import type { ReactNode } from "react";
import { Box, Typography, Avatar } from "@mui/material";

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      
      <Box
        sx={{
          width: { xs: 0, md: 240 },
          display: { xs: "none", md: "block" },
          backgroundColor: "#F9FAFB",
          borderRight: "1px solid #E5E7EB",
          p: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={4}>
          Flugo
        </Typography>

        <Typography sx={{ fontWeight: 500 }}>
          Colaboradores
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            height: 64,
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: { xs: 2, md: 4 },
          }}
        >
          <Avatar sx={{ bgcolor: "#22C55E" }}>JD</Avatar>
        </Box>

        
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 6 },
            backgroundColor: "#F3F4F6",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
