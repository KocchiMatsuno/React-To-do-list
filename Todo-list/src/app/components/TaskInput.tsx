import { useState } from "react";

export default function TaskInput({
  onAdd,
}: {
  onAdd: (title: string) => boolean; // Return success/failure
}) {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (title.trim()) {
      const success = onAdd(title.trim());
      if (success) setTitle("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="task-input-wrapper">
      <input
        className="task-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your task"
      />
      <button className="add-button" onClick={handleAdd}>
        Add Task
      </button>
    </div>
  );
}
