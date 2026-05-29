import { useState } from "react";
import type { Toast } from "../components/toatsComponent";

export type ToastType = "success" | "error" | "warning" | "info";

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return { toasts, showToast };
}
