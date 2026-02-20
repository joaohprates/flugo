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
import { collection, addDoc, serverTimestamp, query, where, getDocs  } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
  
  const isEmailUnique = async (email: string) => {
    const q = query(
      collection(db, "employees"),
      where("email", "==", email)
    );

    const snapshot = await getDocs(q);

    return snapshot.empty;
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate("/employees");
      return;
    }

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

      setLoading(true);

      const unique = await isEmailUnique(formData.email);

      if (!unique) {
        setLoading(false);
        alert("Este e-mail já está cadastrado.");
        return;
      }

      setLoading(false);
      setActiveStep((prev) => prev + 1);
      return;
      

      
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

      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          component={Link}
          to="/employees"
          fontSize={14}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            textDecoration: "none",
            cursor: "pointer",
            color: "#000000",
            "&:hover": {
              color: "#000000",
            },
          }}
        >
          Colaboradores
        </Typography>

        <Typography fontSize={14} color="#6B7280">
          •
        </Typography>

        <Typography fontSize={14} color="#6B7280">
          Cadastrar Colaborador
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
              pointerEvents: "none",
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
      <Box sx={{ display: "flex", gap: 6, position: "relative" }}>

        {/* Vertical Stepper */}
        <Box sx={{ width: 220, position: "relative", zIndex: 0 }}>
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
        <Box sx={{ flex: 1, position: "relative", zIndex: 1 }}>
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