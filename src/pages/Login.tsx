import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {

      console.log("Tentando login com:", email);
      
      await signInWithEmailAndPassword(auth, email, password);

      console.log("LOGIN SUCESSO:");
      localStorage.setItem("login_time", Date.now().toString());

      navigate("/employees");
    } catch (error: any) {
      console.log("ERRO LOGIN:");
      console.log(error.code);
      console.log(error.message);
      alert("Erro: " + error.code);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}
      sx={{ maxWidth: 400, margin: "100px auto", p: 3}}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <img
          src="https://flugo.com.br/images/flugo_hor.png"
          alt="Flugo Logo"
          
          style={{ width: "50%", height: "auto", marginBottom: 32}}
        />
      </Box>
      <TextField label="Email" onChange={(e)=>setEmail(e.target.value)}
        sx={{
          "& .MuiInputLabel-root": {
            color: "#919eab",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#22C55E",
          },
          "& .MuiFormLabel-asterisk": {
            color: "#919eab",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            "& fieldset": {
              borderColor: "#919eab",
            },
            "&:hover fieldset": {
              borderColor: "#22C55E",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#22C55E",
            },
          },
        }}/>
      <TextField label="Senha" type="password" onChange={(e)=>setPassword(e.target.value)}
        sx={{
          "& .MuiInputLabel-root": {
            color: "#919eab",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#22C55E",
          },
          "& .MuiFormLabel-asterisk": {
            color: "#919eab",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            "& fieldset": {
              borderColor: "#919eab",
            },
            "&:hover fieldset": {
              borderColor: "#22C55E",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#22C55E",
            },
          },
        }}/>
      <Button variant="contained" onClick={handleLogin}
        sx={{
                fontWeight: 700,
                backgroundColor: "#22C55E",
                height: 44,
                px: 2,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                backgroundColor: "#16A34A",
                },
            }} >
        Entrar
      </Button>
      <Button variant="contained" onClick={() => navigate("/register")}
        sx={{
                fontWeight: 700,
                backgroundColor: "#2020202a",
                height: 44,
                px: 2,
                color: "#000000",
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                backgroundColor: "#a7a7a727",
                color: "#202020",
                },
            }} >
        Esqueci minha senha
      </Button>
    </Box>
  );
}