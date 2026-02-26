import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Chip,
  Avatar,
} from "@mui/material";
import { doc, updateDoc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate, useParams } from "react-router-dom";

type DepartmentFormData = {
  name: string;
  managerId: string;
};

type EmployeeFromDB = {
  id: string;
  name: string;
  level: string;
};
type Employee = {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  status: boolean;
};

function DepartmentEditStepperForm() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    managerId: ""
  });

  const [managers, setManagers] = useState<EmployeeFromDB[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);


  useEffect(() => {
    const fetchData = async () => {

        const depRef = doc(db, "departments", id!);
        const depSnap = await getDoc(depRef);

        if (depSnap.exists()) {
        setFormData(depSnap.data() as DepartmentFormData);
        }

        const empSnapshot = await getDocs(collection(db, "employees"));

        const managersData: EmployeeFromDB[] = empSnapshot.docs
        .map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<EmployeeFromDB, "id">)
        }))
        .filter(emp => emp.level === "Gestor");

        setManagers(managersData);

        const allEmployeesSnapshot = await getDocs(collection(db, "employees"));

        const departmentEmployees: Employee[] = allEmployeesSnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Employee, "id">)
            }))
            .filter(emp => emp.departmentId === id);

        setEmployees(departmentEmployees);
    };

    fetchData();

  }, []);

  const handleSubmit = async () => {

    if (!formData.name || !formData.managerId) {
      alert("Preencha tudo.");
      return;
    }

    await updateDoc(doc(db, "departments", id!), {
      ...formData
    });

    navigate("/departments");
    };

    return (
        <Box display="flex" flexDirection="column" gap={4}>
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                }}
                >
                <Typography 
                    fontSize={24}
                    fontWeight={700}
                    color="#637381"
                    mb={3}
                >
                    Informações do Departamento
                </Typography>

                <Box display="flex" flexDirection="column" gap={3}>

                <TextField
                    label="Nome"
                    className="text-field-modelo-mm"
                    value={formData.name}
                    onChange={(e) =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                    }
                    fullWidth
                    sx={{ mb: 3 }}
                />

                <FormControl fullWidth
                className="text-field-modelo-mm">
                    <InputLabel>Gestor</InputLabel>
                    <Select
                    value={formData.managerId}
                    label="Gestor"
                    onChange={(e) =>
                        setFormData(prev => ({ ...prev, managerId: e.target.value }))
                    }
                    >
                    {managers.map(manager => (
                        <MenuItem key={manager.id} value={manager.id}>
                        {manager.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
              </Box>
            </Paper>
            <Paper
                elevation={0}
                sx={{
                    paddingTop: 3,
                    paddingLeft: 4,

                }}
            >
                <Typography 
                    fontSize={24}
                    fontWeight={700}
                    color="#637381"
                    mb={3}
                >
                    Colaboradores do Departamento
                </Typography>
            </Paper>
                <Paper
                    elevation={0}
                    sx={{
                        width: "auto",
                        borderRadius: 4,
                        overflow: "hidden",
                        border: "0px solid #E5E7EB",
                        boxShadow: "1px 60px 60px 0px rgba(0, 0, 0, 0.11)",
                        mt: 2,
                        
                        
                    }}
                >
                    <Table
                        sx={{
                            backgroundColor: "#F9FAFB",
                            "& .MuiTableCell-root": {
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#637381",
                                borderBottom: "1px solid #E5E7EB"
                            }
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
                        <TableCell sx={{ width: "40%" }}>Nome</TableCell>
                        <TableCell sx={{ width: "30%" }}>Email</TableCell>
                        <TableCell sx={{ width: "10%" }}>Status</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody 
                    sx={{
                        "& .MuiTableRow-root:hover":{
                            backgroundColor: "#F4F6F8"
                        }
                    }}
                    >
                        {employees.map(emp => (
                        <TableRow key={emp.id}>
                            <TableCell
                            sx={{ 
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontWeight: 400, 
                            }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar
                                    src={`https://api.dicebear.com/7.x/personas/svg?seed=${emp.name}`}
                                    sx={{ width: 40, height: 40 }}
                                    />
                                    {emp.name}
                                </Box>
                            </TableCell>
                            <TableCell sx={{ 
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            fontWeight: 400, 
                                        }}
                            >{emp.email}</TableCell>
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
            <Box 
                mt={2}
                pt={3}
                borderTop="1px solid #E5E7EB"
                display="flex"
                justifyContent="space-between"
            >

                <Button 
                onClick={() => navigate("/departments")}
                sx={{
                    color: "black",
                    width: {
                    xs: "100%",
                    sm: "auto",
                    },
                }} 
                >
                Voltar
                </Button>

                <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                    backgroundColor: "#22C55E"
                }}
                >
                Salvar
                </Button>

            </Box>

        </Box>
    );
}

export default DepartmentEditStepperForm;