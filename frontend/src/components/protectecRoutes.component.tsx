import { Navigate } from "react-router-dom";
import { AuthService } from "../services/authService";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = AuthService.isAuthenthicated();
  
  if (!isAuth) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
}