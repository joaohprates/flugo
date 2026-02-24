import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children }: any) {
  const { user, loading } = useAuth();

  console.log("PrivateRoute:");
  console.log("loading:", loading);
  console.log("user:", user);

  if (loading) return <div>Carregando...</div>;

  if (!user) {
    console.log("REDIRECIONANDO LOGIN");
    return <Navigate to="/login" />;
  }

  console.log("ACESSO LIBERADO");
  return children;
}