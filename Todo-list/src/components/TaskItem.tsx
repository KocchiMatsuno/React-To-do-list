import { useState, useEffect } from "react";

interface Props {
  id: string;
  title: string;
  completed: boolean;
  isRemoving?: boolean;
  onRemove: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onMovedOut?: (id: string) => void; // ✅ Support animation before moving between lists
}

export default function TaskItem({
  id,
  title,
  completed,
  isRemoving,
  onRemove,
  onEdit,
  onToggleComplete,
  onMovedOut,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isVisible, setIsVisible] = useState(true);
  const [prevCompleted, setPrevCompleted] = useState(completed);

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

  // Normal removal (e.g. delete button or delete completed)
  useEffect(() => {
    if (isRemoving) {
      setIsVisible(false);
    }
  }, [isRemoving]);

  // ✅ Animate task movement between active/completed lists
  useEffect(() => {
    if (completed !== prevCompleted) {
      setIsVisible(false);
      const timeout = setTimeout(() => {
        if (onMovedOut) onMovedOut(id);
      }, 300);
      return () => clearTimeout(timeout);
    }
    setPrevCompleted(completed);
  }, [completed]);

  return (
    <li className={`task-item ${isVisible ? "fade-in" : "fade-out"}`}>
      <input
        type="checkbox"
        checked={completed}
        onChange={(e) => onToggleComplete(id, e.target.checked)}
        style={{ marginRight: "0.75rem" }}
      />

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
        <span
          className="task-title"
          style={{
            textDecoration: completed ? "line-through" : "none",
            flex: 1,
          }}
        >
          {title}
        </span>
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
