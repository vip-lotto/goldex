import "./AlertDialog.css";

import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react";

import { useTranslation } from "react-i18next";

export default function AlertDialog({
  open,
  type,
  title,
  message,
  confirm = false,
  onConfirm,
  onClose,
}) {

  const { t } = useTranslation();

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

        {confirm ? (

          <div className="dialog-actions">

            <button
              className="dialog-cancel"
              onClick={onClose}
            >
              {t("cancel")}
            </button>

            <button
              className="dialog-confirm"
              onClick={onConfirm}
            >
              {t("delete")}
            </button>

          </div>

        ) : (

          <button
            className="dialog-btn"
            onClick={onClose}
          >
            {t("ok")}
          </button>

        )}

      </div>
    </div>
  );
}