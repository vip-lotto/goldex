import "./AlertDialog.css";

import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react";

export default function AlertDialog({
  open,
  type,
  title,
  message,
  onClose,
}) {

  if (!open) return null;

  const icon = {
    success: <CheckCircle size={65} />,
    warning: <AlertTriangle size={65} />,
    error: <XCircle size={65} />,
    info: <Info size={65} />,
  };

  return (
    <div
      className="dialog-overlay"
      onClick={onClose}
    >

      <div
        className="dialog-box"
        onClick={(e) => e.stopPropagation()}
      >

        <div className={`dialog-icon ${type}`}>
          {icon[type]}
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <button
          className="dialog-btn"
          onClick={onClose}
        >
          ตกลง
        </button>

      </div>

    </div>
  );
}