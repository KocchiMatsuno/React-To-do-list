import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  action?: "add" | "delete" | "complete" | "duplicate" | "activate";
  onClose: () => void;
}

export default function Toast({ message, type, action, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500); // Auto-hide after 3.5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    if (type === "error" || action === "duplicate") return "🚫";
    if (action === "add") return "✅";
    if (action === "delete") return "❎";
    if (action === "complete") return "✔️";
    if (action === "activate") return "🔄"; // New icon for re-activated task
    return "ℹ️";
  };

  return (
    <div
      className={`toast ${type} ${action === "duplicate" ? "duplicate" : ""}`}
    >
      <span style={{ fontSize: "1.2rem", marginRight: "0.5rem" }}>
        {getIcon()}
      </span>
      <span dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
}
