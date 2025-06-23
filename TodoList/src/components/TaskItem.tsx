import { useState } from "react";

interface Props {
  id: string;
  title: string;
  onRemove: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
}

export default function TaskItem({ id, title, onRemove, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isVisible, setIsVisible] = useState(true);

  const handleEdit = () => {
    if (editing && newTitle.trim()) {
      onEdit(id, newTitle.trim());
    }
    setEditing(!editing);
  };

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(id), 300);
  };

  return (
    <li className={`task-item ${isVisible ? "fade-in" : "fade-out"}`}>
      {editing ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEdit()}
          autoFocus
          className="task-edit-input"
        />
      ) : (
        <span className="task-title">{title}</span>
      )}

      <div className="task-actions">
        <button onClick={handleEdit} className="edit" title="Edit">
          ✏️
        </button>
        <button onClick={handleRemove} className="delete" title="Delete">
          ❌
        </button>
      </div>
    </li>
  );
}
