import type { ReactNode } from "react";
import { Box, Typography, Avatar, } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

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
          backgroundColor: "#ffffff",
          borderRight: "1px dashed #919eab",
          p: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={4}>
          Flugo
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
          }}
        >
          <Avatar
            sx={{
              width: 24,
              height: 24,
              bgcolor: "#919EAB29",
            }}
          >
            <PersonIcon
              sx={{
                fontSize: 16,
                color: "#637381",
              }}
            />
          </Avatar>

          <Typography
            sx={{
              fontWeight: 500,
              color: "#637381",
            }}
          >
            Colaboradores
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: { xs: 2, md: 4 },
          }}
        >
          <Avatar
            src={`https://api.dicebear.com/9.x/personas/svg?seed=Alexander`}
            sx={{ width: 40, height: 40 }}
          />
        </Box>

        
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 6 },
            backgroundColor: "#ffffff",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
