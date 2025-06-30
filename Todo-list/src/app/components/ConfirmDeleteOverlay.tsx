interface ConfirmDeleteOverlayProps {
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteOverlay({
  taskTitle,
  onConfirm,
  onCancel,
}: ConfirmDeleteOverlayProps) {
  return (
    <div className="congrats-overlay">
      <div className="congrats-box">
        <h2>
          Are you sure you want to delete <em>"{taskTitle}"</em>?
        </h2>
        <div className="confirm-buttons">
          <button className="confirm-yes" onClick={onConfirm}>
            Yes, Delete
          </button>
          <button className="confirm-no" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
