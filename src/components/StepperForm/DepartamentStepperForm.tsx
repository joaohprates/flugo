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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

type DepartmentFormData = {
  name: string;
  managerId: string;
  members: string[];
};

type EmployeeFromDB = {
  id: string;
  name: string;
  level: string;
};

function DepartmentStepperForm() {
  const [activeStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<EmployeeFromDB[]>([]);
  const [employees, setEmployees] = useState<EmployeeFromDB[]>([]);
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    managerId: "",
    members: [],
  });

  const navigate = useNavigate();

  const steps = ["Informações do Departamento"];
  const progress = ((activeStep + 1) / steps.length) * 100;

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "employees"));

      const allEmployees = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<EmployeeFromDB, "id">),
      }));

      setManagers(allEmployees.filter((emp) => emp.level === "Gestor"));
      setEmployees(allEmployees);
    };

    fetchData();
  }, []);

  const isValid = () => {
    if (!formData.name.trim()) return false;
    if (!formData.managerId) return false;
    return true;
  };

  const handleBack = () => {
    navigate("/departments");
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);

      const depRef = await addDoc(collection(db, "departments"), {
        name: formData.name,
        managerId: formData.managerId,
        members: formData.members,
        createdAt: serverTimestamp(),
      });

      await Promise.all(
        formData.members.map((empId) =>
          updateDoc(doc(db, "employees", empId), {
            departmentId: depRef.id,
          })
        )
      );

      navigate("/departments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Box sx={{ flex: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 999,
              backgroundColor: "#E5E7EB",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#22C55E",
                borderRadius: 999,
              },
            }}
          />
        </Box>
        <Typography fontSize={14} color="#6B7280">
          {progress}%
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 6 }}>
        <Box sx={{ width: 220 }}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            sx={{
              "& .MuiStepIcon-root.Mui-active": {
                color: "#22C55E",
              },
              "& .MuiStepIcon-root.Mui-completed": {
                color: "#22C55E",
              },
              "& .MuiStepConnector-line": {
                minHeight: 72,
                borderColor: "#E5E7EB",
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography fontSize={24} fontWeight={700} color="#637381" mb={3}>
            Informações do Departamento
          </Typography>

          <TextField
            label="Nome do Departamento"
            className="text-field-modelo-mm"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            fullWidth
            required
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth required className="text-field-modelo-mm">
            <InputLabel>Gestor Responsável</InputLabel>
            <Select
              value={formData.managerId}
              label="Gestor Responsável"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  managerId: e.target.value,
                }))
              }
            >
              {managers.map((manager) => (
                <MenuItem key={manager.id} value={manager.id}>
                  {manager.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography mt={4} mb={2} fontWeight={700}>
            Colaboradores do Departamento
          </Typography>

          <Box display="flex" flexDirection="column">
            {employees.map((emp) => (
              <FormControlLabel
                key={emp.id}
                control={
                  <Checkbox
                    checked={formData.members.includes(emp.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData((prev) => ({
                          ...prev,
                          members: [...prev.members, emp.id],
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          members: prev.members.filter((id) => id !== emp.id),
                        }));
                      }
                    }}
                  />
                }
                label={emp.name}
              />
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
            }}
          >
            <Button
              onClick={handleBack}
              disabled={loading}
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
              disabled={loading}
              sx={{
                backgroundColor: "#22C55E",
                height: 44,
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#16A34A",
                },
              }}
            >
              Concluir
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default DepartmentStepperForm;