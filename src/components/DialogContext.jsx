import { createContext, useContext, useState } from "react";
import AlertDialog from "../components/AlertDialog";

const DialogContext = createContext();

export function DialogProvider({ children }) {

  const [dialog, setDialog] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
  });

  function showDialog({
    type = "info",
    title = "",
    message = "",
  }) {
    setDialog({
      open: true,
      type,
      title,
      message,
    });
  }

  function closeDialog() {
    setDialog((prev) => ({
      ...prev,
      open: false,
    }));
  }

  return (
    <DialogContext.Provider
      value={{ showDialog }}
    >
      {children}

      <AlertDialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
      />

    </DialogContext.Provider>
  );
}

export function useDialog() {
  return useContext(DialogContext);
}