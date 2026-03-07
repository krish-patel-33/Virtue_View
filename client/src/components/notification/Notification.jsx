import { useEffect } from "react";

const Notification = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 z-[1000] [animation:slideIn_0.3s_ease-out] ${
        type === 'success'
          ? 'bg-green-50 border border-green-200 text-green-800'
          : 'bg-red-50 border border-red-200 text-red-800'
      } flex items-center px-5 py-4 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)]`}
    >
      <span className="mr-4 font-medium">{message}</span>
      <button
        className="bg-none border-none text-xl cursor-pointer p-0 px-1 text-inherit opacity-70 hover:opacity-100 transition-opacity"
        onClick={onClose}
      >
        &times;
      </button>
    </div>
  );
};

export default Notification; 