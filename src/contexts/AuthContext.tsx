import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User, signOut } from "firebase/auth";
import { auth } from "../services/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const MAX_SESSION_TIME = 30 * 60 * 1000; 

  const checkSession = async () => {
    const loginTime = localStorage.getItem("login_time");

    if (!loginTime) return;

    const diff = Date.now() - Number(loginTime);

    if (diff > MAX_SESSION_TIME) {
      console.log("Sessão expirada");

      await signOut(auth);

      localStorage.removeItem("token");
      localStorage.removeItem("login_time");

      setUser(null);
    }
  };

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        localStorage.setItem("token", token);
        setUser(firebaseUser);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("login_time");
        setUser(null);
      }

      setLoading(false);
    });

    const interval = setInterval(checkSession, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };

  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);