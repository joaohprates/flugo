import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EmployeesList from "./pages/EmployeesList";
import CreateEmployee from "./pages/CreatEmployee";
import Layout from "./components/Layout";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./themes/theme";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* 🔓 ROTA PÚBLICA */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/employees" />} />
            {/* 🔒 ROTAS PROTEGIDAS */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="employees" />} />
              <Route path="employees" element={<EmployeesList />} />
              <Route path="employees/new" element={<CreateEmployee />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/login" />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;