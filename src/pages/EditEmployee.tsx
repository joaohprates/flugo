import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";

import BasicInfoForm from "../components/BasicInfoForm";
import ProfessionalInfoForm from "../components/ProfessionalInfoForm";
import type { EmployeeFormData } from "../components/StepperForm/StepperForm";

export default function EditEmployee() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    departmentId: "",
    status: true,
    role: "",
    admissionDate: "",
    level: "",
    managerId: "",
    baseSalary: 0
  });

  const [loading, setLoading] = useState(true);

  
  useEffect(() => {

    const fetchEmployee = async () => {

      const ref = doc(db, "employees", id!);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setFormData(snap.data() as EmployeeFormData);
      }

      setLoading(false);
    };

    fetchEmployee();

  }, []);

  
  const handleUpdate = async () => {

    await updateDoc(doc(db, "employees", id!), {
      ...formData
    });

    navigate("/employees");
  };

  if (loading) return null;

  return (
    <Box>

      <BasicInfoForm
        formData={formData}
        setFormData={setFormData}
      />

      <ProfessionalInfoForm
        formData={formData}
        setFormData={setFormData}
      />

      <Box sx={{ display:"flex", gap:2, mt:4 }}>

        <Button
          onClick={()=>navigate("/employees")}
          sx={{ color:"black" }}
        >
          Voltar
        </Button>

        <Button
          variant="contained"
          onClick={handleUpdate}
          sx={{
            backgroundColor:"#22C55E",
            height:44,
            px:3,
            textTransform:"none",
            "&:hover":{
              backgroundColor:"#16A34A"
            }
          }}
        >
          Salvar Alterações
        </Button>

      </Box>

    </Box>
  );
}