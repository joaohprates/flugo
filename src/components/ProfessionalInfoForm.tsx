import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField
} from "@mui/material";
import type { EmployeeFormData } from "./StepperForm/StepperForm";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firestore";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";


type Props = {
  formData: EmployeeFormData;
  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
};

const departments = [
  "Tecnologia",
  "Financeiro",
  "Recursos Humanos",
  "Marketing",
];
const levels = [
  "Júnior",
  "Pleno",
  "Sênior",
  "Gestor"
];

const ProfessionalInfoForm = ({ formData, setFormData }: Props) => {
  type EmployeeFromDB = {
    id: string;
    name: string;
    level: string;
  };
  const [managers, setManagers] = useState<EmployeeFromDB[]>([]);

  useEffect(() => {
    const fetchManagers = async () => {
      const snapshot = await getDocs(collection(db, "employees"));

      const data: EmployeeFromDB[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<EmployeeFromDB, "id">)
      }));

      const onlyManagers = data.filter(emp => emp.level === "Gestor");

      setManagers(onlyManagers);
    };

    fetchManagers();
  }, []);

  const handleChange = (field: keyof EmployeeFormData) => (e: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };
  const isEditing = !!formData.id;
  const formatCurrency = (value: number | string) => {
    if (!value) return "";

    const numberValue = typeof value === "string"
      ? Number(value.replace(/\D/g, "")) / 100
      : value;

    return numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2
    });
  };
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");

    const numericValue = Number(raw) / 100;

    setFormData(prev => ({
      ...prev,
      baseSalary: numericValue
    }));
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} mt={4}>
      <Typography fontSize={24} fontWeight={700} color="#637381">
        Informações Profissionais
      </Typography>
      
        
        <FormControl fullWidth required>
          <InputLabel>Departamento</InputLabel>
          <Select
            value={formData.department}
            label="Departamento"
            onChange={handleChange("department")}
          >
            {departments.map(dep => (
              <MenuItem key={dep} value={dep}>{dep}</MenuItem>
            ))}
          </Select>
        </FormControl>

        
        <TextField
          label="Cargo"
          value={formData.role}
          onChange={handleChange("role")}
          fullWidth
          required
        />

        
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="pt-br"
        >
          <DatePicker
            label="Data de admissão"
            format="DD/MM/YYYY"
            value={formData.admissionDate ? dayjs(formData.admissionDate) : null}
            onChange={(newValue) => {
              if (!newValue || !newValue.isValid()) return;

              setFormData(prev => ({
                ...prev,
                admissionDate: newValue.toISOString()
              }));
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                sx: {
                  "& .MuiInputLabel-root": {
                    color: "#919eab",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#22C55E",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: "#919eab",
                    },
                    "&:hover fieldset": {
                      borderColor: "#22C55E",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#22C55E",
                    },
                  },
                }
              }
            }}
          />
        </LocalizationProvider>
        
        <FormControl fullWidth required>
          <InputLabel>Nível</InputLabel>
          <Select
            value={formData.level}
            label="Nível"
            onChange={handleChange("level")}
          >
            {levels.map(lvl => (
              <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
            ))}
          </Select>
        </FormControl>

        
        <FormControl fullWidth required>
          <InputLabel>Gestor</InputLabel>
          <Select
            value={formData.managerId || ""}
            label="Gestor"
            onChange={handleChange("managerId")}
          >
            {managers
              .filter(manager => {
                if (!isEditing) return true;
                return manager.id !== formData.id;
              })
              .map(manager => (
                <MenuItem key={manager.id} value={manager.id}>
                  {manager.name}
                </MenuItem>
            ))}
          </Select>
        </FormControl>
      
      
      <TextField
        label="Salário Base"
        value={formatCurrency(formData.baseSalary)}
        onChange={handleSalaryChange}
        fullWidth
        required
      />
    </Box>
  );
};

export default ProfessionalInfoForm;
