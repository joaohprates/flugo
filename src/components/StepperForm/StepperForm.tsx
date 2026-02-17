import { useState } from "react";
import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";
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

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleNext = async () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
      return;
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
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <BasicInfoForm formData={formData} setFormData={setFormData} />
      )}

      {activeStep === 1 && (
        <ProfessionalInfoForm formData={formData} setFormData={setFormData} />
      )}

      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        <Button onClick={handleBack} disabled={activeStep === 0 || loading}>
          Voltar
        </Button>

        <Button variant="contained" onClick={handleNext} disabled={loading}>
          {activeStep === steps.length - 1 ? "Concluir" : "Próximo"}
        </Button>
      </Box>
    </Box>
  );
}
