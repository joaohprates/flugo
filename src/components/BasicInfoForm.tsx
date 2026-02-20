import { TextField, Box } from "@mui/material";
import { useState } from "react";
import type { EmployeeFormData } from "./StepperForm/StepperForm";
import { field } from "firebase/firestore/pipelines";

type Props = {
  formData: EmployeeFormData;
  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
};

const BasicInfoForm = ({ formData, setFormData }: Props) => {
  const [emailError, setEmailError] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      email: value,
    }));

    const isValid = value.includes("@") && value.includes(".");
    setEmailError(!isValid);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} mt={4}>
      <TextField
        label="Nome"
        value={formData.name}
        onChange={handleNameChange}
        fullWidth
        required
        sx={{
          "& .MuiInputLabel-root": {
            color: "#22C55E",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#22C55E",
          },
          "& .MuiFormLabel-asterisk": {
            color: "#22C55E",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            "& fieldset": {
              borderColor: "#22C55E",
            },
            "&:hover fieldset": {
              borderColor: "#22C55E",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#22C55E",
            },
          },
        }}
      />

      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleEmailChange}
        error={emailError}
        helperText={emailError ? "Email inválido" : ""}
        fullWidth
        required
        sx={{
          "& .MuiInputLabel-root": {
            color: "#22C55E",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#22C55E",
          },
          "& .MuiFormLabel-asterisk": {
            color: "#22C55E",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            "& fieldset": {
              borderColor: "#22C55E",
            },
            "&:hover fieldset": {
              borderColor: "#22C55E",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#22C55E",
            },
          },
        }}
      />
    </Box>
  );
};

export default BasicInfoForm;
