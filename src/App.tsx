import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EmployeesList from "./pages/EmployeesList";
import CreateEmployee from "./pages/CreatEmployee";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/employees" />} />
          <Route path="/employees" element={<EmployeesList />} />
          <Route path="/employees/new" element={<CreateEmployee />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
