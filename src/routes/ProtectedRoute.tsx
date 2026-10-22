import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"] as const;

export default function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId: number;

    const logOut = () => {
      localStorage.removeItem("isAuthenticated");
      navigate("/login", { replace: true });
    };

    const resetTimeout = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(logOut, INACTIVITY_TIMEOUT_MS);
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, resetTimeout);
    });
    resetTimeout();

    return () => {
      window.clearTimeout(timeoutId);
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, resetTimeout);
      });
    };
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
