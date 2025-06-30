import { useEffect, useState } from "react";

interface Props {
  id: string;
  title: string;
  completed: boolean;
  onRemove: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

export default function TaskItem({
  id,
  title,
  completed,
  onRemove,
  onEdit,
  onToggleComplete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isChecked, setIsChecked] = useState(completed);

  // 🔁 Sync checkbox with redux state
  useEffect(() => {
    setIsChecked(completed);
  }, [completed]);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    onToggleComplete(id, !isChecked);
  };

  const save = () => {
    if (newTitle.trim()) onEdit(id, newTitle.trim());
    setEditing(false);
  };

  return (
    <li className="task-item">
      <input type="checkbox" checked={isChecked} onChange={handleToggle} />
      {editing ? (
        <input
          className="task-edit-input"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          autoFocus
        />
      ) : (
        <>
          <span
            className="task-title"
            style={{ textDecoration: isChecked ? "line-through" : undefined }}
          >
            {title}
          </span>
          <button onClick={() => setEditing(true)}>✏️</button>
          <button onClick={() => onRemove(id)}>❌</button>
        </>
      )}
    </li>
  );
}
