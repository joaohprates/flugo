import { Box, Typography, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { JSX } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../services/auth";

function Layout(): JSX.Element {

  const navigate = useNavigate(); 

  const handleLogout = async () => {
    console.log("Deslogando...");

    await signOut(auth);

    localStorage.removeItem("token");
    localStorage.removeItem("login_time");

    navigate("/login");
  };

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
          src="https://flugo.com.br/images/flugo_hor.png"
          alt="Flugo Logo"
          style={{ width: "35%", height: "auto", marginBottom: 32 }}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
            onClick={handleLogout}
            src={`https://api.dicebear.com/9.x/personas/svg?seed=Alexander`}
            sx={{
              width: 40,
              height: 40,
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                opacity: 0.7
              }
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 6 },
            backgroundColor: "#ffffff",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;