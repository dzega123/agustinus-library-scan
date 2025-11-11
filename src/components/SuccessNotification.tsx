import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

interface SuccessNotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

const SuccessNotification = ({ show, message, onClose }: SuccessNotificationProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-in fade-in-0 zoom-in-95 duration-300 pointer-events-auto">
        <div className="bg-success text-success-foreground px-8 py-6 rounded-lg shadow-2xl flex items-center gap-4 max-w-md">
          <CheckCircle className="w-8 h-8 shrink-0" />
          <div>
            <p className="font-semibold text-lg">Berhasil!</p>
            <p className="text-sm opacity-90">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;
