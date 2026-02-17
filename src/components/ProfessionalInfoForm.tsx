import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import type { EmployeeFormData } from "./StepperForm/StepperForm";

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

const ProfessionalInfoForm = ({ formData, setFormData }: Props) => {
  const handleDepartmentChange = (event: any) => {
    setFormData((prev) => ({
      ...prev,
      department: event.target.value,
    }));
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      status: event.target.checked,
    }));
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} mt={4}>
      <FormControl fullWidth required>
        <InputLabel>Departamento</InputLabel>
        <Select
          value={formData.department}
          label="Departamento"
          onChange={handleDepartmentChange}
        >
          {departments.map((dep) => (
            <MenuItem key={dep} value={dep}>
              {dep}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={formData.status}
            onChange={handleStatusChange}
          />
        }
        label={formData.status ? "Ativo" : "Inativo"}
      />
    </Box>
  );
};

export default ProfessionalInfoForm;
