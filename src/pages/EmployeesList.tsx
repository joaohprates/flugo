import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TableSortLabel,
  Avatar,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  status: boolean;
};

function EmployeesList() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [orderBy, setOrderBy] = useState<keyof Employee>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "employees"));

        const data: Employee[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Employee, "id">),
        }));

        setEmployees(data);
      } catch (error) {
        console.error("Erro ao buscar colaboradores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSort = (property: keyof Employee) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Colaboradores
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/employees/new")}
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
            }}
        >
          Novo Colaborador
        </Button>
      </Box>

      {loading ? (
        <Typography>Carregando...</Typography>
      ) : (
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            borderRadius: 4,
            overflow: "hidden",
            border: "0px solid #E5E7EB",
            boxShadow: "1px 60px 60px 0px rgba(0, 0, 0, 0.11)",
            mt: 2,
          }}
        >
          <Table
            sx={{
              width: "100%",

              tableLayout: "fixed",
              "& .MuiTableCell-root": {
                py: 2.5,
                px: 4,
              },
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#F4F6F8",
                  "& .MuiTableCell-root": {
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#3c424dca",
                    py: 2.5,
                  },
                }}
              >
                <TableCell sx={{ width: "40%" }}>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleSort("name")}
                  >
                    Nome
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ width: "30%" }}>
                  <TableSortLabel
                    active={orderBy === "email"}
                    direction={orderBy === "email" ? order : "asc"}
                    onClick={() => handleSort("email")}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ width: "20%" }}>
                  <TableSortLabel
                    active={orderBy === "department"}
                    direction={orderBy === "department" ? order : "asc"}
                    onClick={() => handleSort("department")}
                  >
                    Departamento
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ width: "10%" }}>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleSort("status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={`https://api.dicebear.com/7.x/personas/svg?seed=${emp.name}`}
                        sx={{ width: 40, height: 40 }}
                      />
                      {emp.name}
                    </Box>
                  </TableCell>

                  <TableCell 
                    sx={{ 
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontWeight: 400, 
                    }}>
                    {emp.email}
                  </TableCell>
                  <TableCell>{emp.department}</TableCell>

                  <TableCell>
                    <Chip
                      label={emp.status ? "Ativo" : "Inativo"}
                      size="small"
                      sx={{
                        px: 0,
                        backgroundColor: emp.status ? "#22C55E29" : "#FF563029",
                        color: emp.status ? "#118D57" : "#B71D18",
                        fontWeight: 700,
                        fontStyle: "bold",
                        borderRadius: "6px",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}

export default EmployeesList;
