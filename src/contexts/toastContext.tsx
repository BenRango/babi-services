import ToastBanner from "@/components/toast";
import { createContext, useCallback, useContext, useRef, useState } from "react";

interface ToastState {
  id: number;
  message: string;
  onPress?: () => void;
}

interface ToastContextValue {
  showToast: (message: string, onPress?: () => void) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DUREE_MS = 10000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const idRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast(null);
  }, []);

  const showToast = useCallback(
    (message: string, onPress?: () => void) => {
      idRef.current += 1;
      setToast({ id: idRef.current, message, onPress });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(dismiss, DUREE_MS);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <ToastBanner
          key={toast.id}
          message={toast.message}
          onPress={() => {
            toast.onPress?.();
            dismiss();
          }}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast doit être utilisé dans ToastProvider");
  return ctx;
}
