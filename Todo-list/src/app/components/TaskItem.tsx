import { useState, useEffect } from "react";

interface Props {
  id: string;
  title: string;
  completed: boolean;
  isRemoving?: boolean;
  onRemove: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

export default function TaskItem({
  id,
  title,
  completed,
  isRemoving,
  onRemove,
  onEdit,
  onToggleComplete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [prevCompleted, setPrevCompleted] = useState(completed);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleEdit = () => {
    if (editing && newTitle.trim()) {
      onEdit(id, newTitle.trim());
    }
    setEditing(!editing);
  };

  // ✅ Only animate out if parent marks as removing (e.g. completed + delete confirmed)
  useEffect(() => {
    if (isRemoving) {
      setIsAnimatingOut(true);
    }
  }, [isRemoving]);

  // ✅ Animate movement between active ↔ completed (not removal)
  useEffect(() => {
    if (completed !== prevCompleted) {
      setIsAnimatingOut(true);
      const timeout = setTimeout(() => {
        setPrevCompleted(completed);
        setIsAnimatingOut(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [completed]);

  return (
    <li className={`task-item ${isAnimatingOut ? "fade-out" : "fade-in"}`}>
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
        <button
          onClick={() => onRemove(id)} // ✅ let parent handle confirm logic
          className="delete"
          title="Delete"
        >
          ❌
        </button>
      </div>
    </li>
  );
}
