import type { ToastType } from "../hooks/useToast";

export interface Toast {
    id: number;
    message: string;
    type: ToastType
}

const alertClasses: Record<string, string> = {
  success: "alert-success",
  error:   "alert-error",
  warning: "alert-warning",
  info:    "alert-info",
};

export default function ToastComponent({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast toast-top toast-end z-50">
      {toasts.map(t => (
        <div key={t.id} className={`alert ${alertClasses[t.type]}`}>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
