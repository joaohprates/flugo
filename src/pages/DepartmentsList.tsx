import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Checkbox,
  TextField,
  Button,
} from "@mui/material";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

type Department = {
  id: string;
  name: string;
  managerId: string;
};

function DepartmentsList() {

  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();
  const [nameFilter, setNameFilter] = useState("");
  const [loading] = useState(true);

const [orderBy] = useState<keyof Department>("name");
const [order] = useState<"asc" | "desc">("asc");

  const getManagerName = (id: string) => {
    const manager = employees.find(emp => emp.id === id);
    return manager ? manager.name : "-";
  };

  const getEmployeeCount = (departmentId: string) => {
    return employees.filter(emp => emp.departmentId === departmentId).length;
  };
    const handleSelectAll = () => {
    if (selected.length === departments.length) {
      setSelected([]);
    } else {
      setSelected(departments.map(dep => dep.id));
    }
  };
  const handleDelete = async () => {

    await Promise.all(
      selected.map(id =>
        deleteDoc(doc(db, "departments", id))
      )
    );

    setDepartments(prev =>
      prev.filter(dep => !selected.includes(dep.id))
    );

    setSelected([]);
  };

  {/*useEffect(() => {
    const fetchData = async () => {
      try {
        const depSnapshot = await getDocs(collection(db, "departments"));
        const empSnapshot = await getDocs(collection(db, "employees"));

        const deps = depSnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Department, "id">)
        }));

        const emps = empSnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data())
        }));

        setDepartments(deps);
        setEmployees(emps);

      } catch (err) {
        console.error("Firestore read failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
*/}
  const filteredDepartments = departments.filter(dep =>
    dep.name.toLowerCase().includes(nameFilter.toLowerCase())
  );

  const sortedDepartments = [...filteredDepartments].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  if (loading) return <Typography>Carregando...</Typography>;

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >

        <Typography variant="h5" fontWeight={700}>
          Departamentos
        </Typography>

        <Box display="flex" gap={2}>

          {selected.length === 0 && (
            <Button
              variant="contained"
              onClick={() => navigate("/departments/new")}
              sx={{
                backgroundColor: "#22C55E",
                height: 44,
                minWidth: 160,
                px: 2,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Novo Departamento
            </Button>
          )}

          {selected.length === 1 && (
            <Button
              variant="contained"
              onClick={() => navigate(`/departments/edit/${selected[0]}`)}
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
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Filtrar por Nome"
          className="text-field-modelo-mm"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          sx={{
            width: {
              xs: "100%",
              sm: 300
            }
          }}
        />
      </Box>

      <Paper elevation={0} 
        sx={{
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
          border: "0px solid #E5E7EB",
          boxShadow: "1px 60px 60px 0px rgba(0, 0, 0, 0.11)",
          mt: 2,
        }}>
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
                    checked={selected.length === departments.length}
                    indeterminate={
                      selected.length > 0 && selected.length < departments.length
                    }
                    onChange={handleSelectAll}
                  />
              </TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Colaboradores</TableCell>
              <TableCell>Gestor</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedDepartments.map(dep => (
              <TableRow key={dep.id}>

                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(dep.id)}
                    onChange={() =>
                      setSelected(prev =>
                        prev.includes(dep.id)
                          ? prev.filter(item => item !== dep.id)
                          : [...prev, dep.id]
                      )
                    }
                  />
                </TableCell>

                <TableCell>{dep.name}</TableCell>

                <TableCell>
                  {getEmployeeCount(dep.id)}
                </TableCell>

                <TableCell>
                  {getManagerName(dep.managerId)}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>
      </Paper>
    </Box>
  );
}

export default DepartmentsList;