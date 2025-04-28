// src/plugins/toast.js
import { toast } from 'react-toastify';

// Customize the toast notifications if needed
toast.configure({
  autoClose: 3000, // Automatically close the toast after 3 seconds
  hideProgressBar: true,
  newestOnTop: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

export const success = (message) => {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
  });
};

export const error = (message) => {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
  });
};
