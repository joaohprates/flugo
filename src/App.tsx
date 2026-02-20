import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EmployeesList from "./pages/EmployeesList";
import CreateEmployee from "./pages/CreatEmployee";
import Layout from "./components/Layout";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./themes/theme";


function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/employees" />} />
            <Route path="/employees" element={<EmployeesList />} />
            <Route path="/employees/new" element={<CreateEmployee />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
