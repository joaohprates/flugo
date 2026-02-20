import type { ReactNode } from "react";
import { Box, Typography, Avatar, } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import flugoLogo from "../assets/flugo_logo.png";

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
        <img
          src={flugoLogo}
          alt="Flugo Logo"
          style={{ width: "40%", height: "auto", marginBottom: 32 }}
        />

        <Box
          component={Link}
          to="/employees"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
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

          <ChevronRightIcon
            sx={{
              fontSize: 18,
              color: "#637381",
            }}
          />
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
