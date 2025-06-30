// ConfirmDeleteOverlay.tsx
type ConfirmDeleteOverlayProps = {
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDeleteOverlay = ({
  taskTitle,
  onConfirm,
  onCancel,
}: ConfirmDeleteOverlayProps) => {
  return (
    <div className="congrats-overlay">
      <div className="congrats-box">
        <h2>Are you sure you want to delete "{taskTitle}"?</h2>
        <div className="confirm-buttons">
          <button className="confirm-yes" onClick={onConfirm}>
            Yes
          </button>
          <button className="confirm-no" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteOverlay;
