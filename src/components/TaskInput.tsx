import { useState } from "react";
import toast from "react-hot-toast";

export default function TaskInput({
  onAdd,
}: {
  onAdd: (title: string) => Promise<boolean>;
}) {
  const [title, setTitle] = useState("");

  const handle = async () => {
    if (!title.trim()) {
      toast.error("❌ Task title cannot be empty."); // ✅ Toast here
      return;
    }
    const ok = await onAdd(title.trim());
    if (ok) setTitle("");
  };

  return (
    <div className="task-input-wrapper">
      <input
        className="task-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handle()}
        placeholder="Enter your task"
      />
      <button onClick={handle} className="add-button">
        Add Task
      </button>
    </div>
  );
}
