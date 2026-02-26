import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EmployeesList from "./pages/EmployeesList";
import CreateEmployee from "./pages/CreatEmployee";
import Layout from "./components/Layout";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./themes/theme";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import EditEmployee from "./pages/EditEmployee";
import './App.css';
import DepartmentsList from "./pages/DepartmentsList";
import DepartmentStepperForm from "./components/StepperForm/DepartamentStepperForm";
import DepartmentEditStepperForm from "./pages/DepartmentEditStepperForm";
import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log("Auth user:", user);
    console.log("Auth loading:", loading);
  }, [user, loading]);
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/employees" />} />
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
              <Route path="employees/edit/:id" element={<EditEmployee />} />
              <Route path="departments" element={<DepartmentsList />} />
              <Route path="departments/new" element={<DepartmentStepperForm />} />
              <Route path="departments/edit/:id" element={<DepartmentEditStepperForm />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;