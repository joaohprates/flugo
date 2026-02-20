import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
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

  

  return (
    <Box display="flex" flexDirection="column" gap={3} mt={4}>

      <Typography
        fontSize={24}
        fontWeight={700}
        fontStyle={"bold"}
        color="#637381"
      >
        Informações Profissionais
      </Typography>

      <FormControl fullWidth required
        sx={{
          "& .MuiInputLabel-root": {
            color: "#919eab",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#22C55E",
          },
          "& .MuiFormLabel-asterisk": {
            color: "#919eab",
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
        }}
        >
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

    </Box>
  );
};

export default ProfessionalInfoForm;
