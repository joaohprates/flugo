import { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  LinearProgress,
  Typography,
} from "@mui/material";
import BasicInfoForm from "../BasicInfoForm";
import ProfessionalInfoForm from "../ProfessionalInfoForm";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

export type EmployeeFormData = {
  name: string;
  email: string;
  department: string;
  status: boolean;
};

export function StepperForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    department: "",
    status: true,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const steps = ["Infos Básicas", "Infos Profissionais"];

  const progress = (activeStep / steps.length) * 100;

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const isBasicInfoValid = () => {
    if (!formData.name.trim()) return false;
    if (!formData.email.includes("@") || !formData.email.includes(".")) return false;
    return true;
  };

  const isProfessionalInfoValid = () => {
    if (!formData.department) return false;
    return true;
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      if (!isBasicInfoValid()) {
        alert("Preencha nome e email corretamente.");
        return;
      }
      setActiveStep((prev) => prev + 1);
      return;
    }

    if (activeStep === 1) {
      if (!isProfessionalInfoValid()) {
        alert("Selecione um departamento.");
        return;
      }
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "employees"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      navigate("/employees");
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>

      {/* Breadcrumb */}
      <Box sx={{ mb: 2 }}>
        <Typography fontSize={14} color="#6B7280">
          Colaboradores • Cadastrar Colaborador
        </Typography>
      </Box>

      {/* Progress Bar */}
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

      {/* Layout */}
      <Box sx={{ display: "flex", gap: 6 }}>

        {/* Vertical Stepper */}
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

        {/* Form */}
        <Box sx={{ flex: 1 }}>
          {activeStep === 0 && (
            <BasicInfoForm formData={formData} setFormData={setFormData} />
          )}

          {activeStep === 1 && (
            <ProfessionalInfoForm formData={formData} setFormData={setFormData} />
          )}

          <Box 
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column-reverse",
                sm: "row",
              },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mt: 4,
              width: "100%",
            }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
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
              onClick={handleNext}
              disabled={loading}
              
              sx={{
                backgroundColor: "#22C55E",
                height: 44,
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                "&:hover": {
                  backgroundColor: "#16A34A",
                },
              }}
            >
              {activeStep === steps.length - 1 ? "Concluir" : "Próximo"}
            </Button>
          </Box>
        </Box>

      </Box>
    </Box>
  );
}