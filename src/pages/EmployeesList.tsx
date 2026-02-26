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
  Checkbox,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";


type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  status: boolean;
};

function EmployeesList() {
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === employees.length) {
      setSelected([]);
    } else {
      setSelected(employees.map(emp => emp.id));
    }
  };
  const handleDelete = async () => {
    await Promise.all(
      selected.map(id =>
        deleteDoc(doc(db, "employees", id))
      )
    );

    setEmployees(prev =>
      prev.filter(emp => !selected.includes(emp.id))
    );

    setSelected([]);
  };
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);

  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

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

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
    emp.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
    (departmentFilter === "" || emp.department === departmentFilter)
  );

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
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

        <Box sx={{ display: "flex", gap: 2 }}>

          {selected.length === 0 && (
            <Button
              variant="contained"
              onClick={() => navigate("/employees/new")}
              sx={{
                backgroundColor: "#22C55E",
                height: 44,
                minWidth: 160,
                px: 2,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Novo Colaborador
            </Button>
          )}

          {selected.length === 1 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/employees/edit/${selected[0]}`)}
              sx={{
                backgroundColor: "#22C55E",
                height: 44,
                minWidth: 160,
                px: 2,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Editar
            </Button>
          )}

          {selected.length > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{
                height: 44,
                minWidth: 160,
                px: 2,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Excluir ({selected.length})
            </Button>
          )}

        </Box>
      </Box>
      <Box display="flex" gap={2} mb={2}>

        <TextField
          label="Filtrar por Nome"
          className="text-field-modelo-mm"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          fullWidth          
        />

        <TextField
          label="Filtrar por Email"
          className="text-field-modelo-mm"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          fullWidth
        />

        <FormControl fullWidth
        className="text-field-modelo-mm">
          <InputLabel>Departamento</InputLabel>
          <Select
            value={departmentFilter}
            label="Departamento"
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Tecnologia">Tecnologia</MenuItem>
            <MenuItem value="Financeiro">Financeiro</MenuItem>
            <MenuItem value="Recursos Humanos">RH</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
          </Select>
        </FormControl>

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
                py: 2,
                px: 3,
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
                    color: "#637381",
                    py: 2,
                  },
                }}
              >

                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.length === employees.length}
                    indeterminate={
                      selected.length > 0 && selected.length < employees.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>

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
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(emp.id)}
                      onChange={() => handleSelect(emp.id)}
                    />
                  </TableCell>
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
