import { createContext, useContext, useState } from "react";
import AlertDialog from "../components/AlertDialog";

const DialogContext = createContext();

export function DialogProvider({ children }) {

  const [dialog, setDialog] = useState({
    open:false,
    type:"info",
    title:"",
    message:"",
    confirm:false,
    onConfirm:null,
  });

  function showDialog({
    type="info",
    title="",
    message="",
  }){

    setDialog({
      open:true,
      type,
      title,
      message,
      confirm:false,
      onConfirm:null,
    });

  }

  function showConfirm({
    type="warning",
    title="",
    message="",
    onConfirm,
  }){

    setDialog({
      open:true,
      type,
      title,
      message,
      confirm:true,
      onConfirm,
    });

  }

  function closeDialog(){

    setDialog(prev=>({
      ...prev,
      open:false,
    }));

  }

  function confirm(){

    if(dialog.onConfirm){

      dialog.onConfirm();

    }

    closeDialog();

  }

  return(

    <DialogContext.Provider
      value={{
        showDialog,
        showConfirm,
      }}
    >

      {children}

      <AlertDialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        confirm={dialog.confirm}
        onConfirm={confirm}
        onClose={closeDialog}
      />

    </DialogContext.Provider>

  );

}

export function useDialog(){

  return useContext(DialogContext);

}