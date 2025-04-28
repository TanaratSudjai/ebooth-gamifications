"use client";
import Swal from "sweetalert2";
import { createContext, useContext } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const showSuccess = (title = "Success!", message = "Berjaya!") => {
    if (typeof window !== "undefined") {
      Swal.fire({
        position: "top-end",
        toast: true,
        icon: "success",
        title: title,
        text: message,
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
        background: "#28a745",
        color: "#fff",
      });
    }
  };

  const showError = (title = "Oops!", message = "Something went wrong.") => {
    if (typeof window !== "undefined") {
      Swal.fire({
        position: "top-end",
        toast: true,
        icon: "error",
        title: title,
        text: message,
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
        background: "#dc3545",
        color: "#fff",
      });
    }
  };

  return (
    <AlertContext.Provider value={{ showSuccess, showError }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
