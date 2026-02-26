import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { Alert } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  
  
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };
  const handleLogin = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      localStorage.setItem("login_time", Date.now().toString());
      navigate("/employees");

    } catch (error: any) {
      setErrorMessage(getFirebaseErrorMessage(error.code));
    }
  };
  const handleForgotPassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Digite seu email primeiro");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Email de redefinição enviado com sucesso");

    } catch (error: any) {
      setErrorMessage(getFirebaseErrorMessage(error.code));
    }
  };
  const getFirebaseErrorMessage = (code: string) => {
    switch (code) {
      case "auth/user-not-found":
        return "Usuário não encontrado";
      case "auth/wrong-password":
        return "Senha incorreta";
      case "auth/invalid-email":
        return "Email inválido";
      case "auth/invalid-credential":
        return "Email ou senha incorretos";
      default:
        return "Erro inesperado. Tente novamente.";
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{ maxWidth: 400, margin: "100px auto", p: 3}}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <img
          src="https://flugo.com.br/images/flugo_hor.png"
          alt="Flugo Logo"
          
          style={{ width: "50%", height: "auto", marginBottom: 32}}
        />
      </Box>
      {errorMessage && (
        <Alert severity="error">
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success">
          {successMessage}
        </Alert>
      )}
      <TextField label="Email" onChange={(e)=>setEmail(e.target.value)}
        className="text-field-modelo-mm"
        />
      <TextField label="Senha" type="password" onChange={(e)=>setPassword(e.target.value)}
        className="text-field-modelo-mm"
        />
      <Button type="submit" variant="contained"
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
      <Button variant="contained" onClick={handleForgotPassword}
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