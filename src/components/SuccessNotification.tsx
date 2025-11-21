import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

interface SuccessNotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
  memberName?: string;
  memberPhoto?: string;
}

const SuccessNotification = ({ show, message, onClose, memberName, memberPhoto }: SuccessNotificationProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-in fade-in-0 zoom-in-95 duration-300 pointer-events-auto">
        <div className="bg-card text-card-foreground px-8 py-8 rounded-lg shadow-2xl flex flex-col items-center gap-4 max-w-md border-2 border-primary">
          {memberPhoto && (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
              <img src={memberPhoto} alt={memberName} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="text-center">
            {memberName && (
              <p className="font-bold text-2xl mb-2">{memberName}</p>
            )}
            <p className="text-lg text-muted-foreground">{message}</p>
          </div>
          <CheckCircle className="w-12 h-12 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;
