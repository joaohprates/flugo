import { useEffect, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  LinearProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { doc, updateDoc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../services/firestore";
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

function DepartmentEditStepperForm() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    managerId: ""
  });

  const [managers, setManagers] = useState<EmployeeFromDB[]>([]);
  const [loading, setLoading] = useState(false);

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
    };

    fetchData();

  }, []);

  const handleSubmit = async () => {

    if (!formData.name || !formData.managerId) {
      alert("Preencha tudo.");
      return;
    }

    setLoading(true);

    await updateDoc(doc(db, "departments", id!), {
      ...formData
    });

    navigate("/departments");
  };

  return (
    <Box>

      <Typography fontSize={24} fontWeight={700} mb={3}>
        Editar Departamento
      </Typography>

      <TextField
        label="Nome"
        value={formData.name}
        onChange={(e) =>
          setFormData(prev => ({ ...prev, name: e.target.value }))
        }
        fullWidth
        sx={{ mb: 3 }}
      />

      <FormControl fullWidth>
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

      <Box mt={4} display="flex" justifyContent="space-between">

        <Button onClick={() => navigate("/departments")}>
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