import { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {

  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const showToast = (
    msg,
    toastType = "success"
  ) => {

    setMessage(msg);
    setType(toastType);
    setShow(true);

    setTimeout(() => {
      setShow(false);
    }, 2500);

  };

  return (
    <ToastContext.Provider
      value={{ showToast }}
    >

      {children}

      <Toast
        show={show}
        message={message}
        type={type}
      />

    </ToastContext.Provider>
  );

}

export function useToast() {
  return useContext(ToastContext);
}