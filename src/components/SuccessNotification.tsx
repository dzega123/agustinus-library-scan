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
        <div className="bg-background/95 backdrop-blur-sm text-foreground px-6 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3 max-w-xs border border-primary/20">
          {memberPhoto && (
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/50">
              <img src={memberPhoto} alt={memberName} className="w-full h-full object-cover" />
            </div>
          )}
          {memberName && (
            <p className="font-semibold text-lg text-center">{memberName}</p>
          )}
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;
