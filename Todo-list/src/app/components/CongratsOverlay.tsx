import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function CongratsOverlay({ onClose }: Props) {
  return (
    <div className="congrats-overlay">
      <div className="congrats-box">
        <button className="close-btn" onClick={onClose} title="Close">
          <X size={20} />
        </button>
        <h2>🎉 Congrats! All tasks done!</h2>
        <img
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb210NTluZXB4Y3B6OTg0b25zczg4ajVwNDY5bnozYjJ4bTM3bTF5dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/BK1EfIsdkKZMY/giphy.gif"
          alt="All Done"
          className="congrats-image"
        />
      </div>
    </div>
  );
}
