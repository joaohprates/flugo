import {
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.checked,
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
        Informações Básicas
      </Typography>
      <TextField
        label="Nome"
        value={formData.name}
        onChange={handleNameChange}
        fullWidth
        required
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
      />
      <FormControlLabel
        control={
          <Switch
            checked={formData.status}
            onChange={handleStatusChange}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#ffffff",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#22C55E",
                opacity: 1,
              },
              "& .MuiSwitch-track": {
                backgroundColor: "#E5E7EB",
              },
            }}
          />
        }
        label="Ativar ao criar"
      />
    </Box>
  );
};

export default BasicInfoForm;
