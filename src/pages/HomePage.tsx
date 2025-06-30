import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchTasks,
  addNew,
  removeOne,
  updateTask,
  toggleComplete,
  deleteCompleted,
} from "../reduxToolkit/task.slice";
import TaskItem from "../components/TaskItem";
import TaskInput from "../components/TaskInput";
import toast from "react-hot-toast";
import CongratsOverlay from "../components/CongratsOverlay";
import ConfirmDeleteOverlay from "../components/ConfirmDeleteOverlay";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );
  const [showCongrats, setShowCongrats] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const allCompleted =
      tasks.length > 0 && tasks.every((task) => task.completed);
    const dismissed = localStorage.getItem("congratsDismissed") === "true";

    if (allCompleted && !dismissed) {
      setShowCongrats(true);
    }
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const handleAdd = async (title: string) => {
    const res = await dispatch(addNew(title)).unwrap();
    if (res.success && res.task) {
      toast.success(`✅ Task "${res.task.title}" added.`);
      return true;
    } else {
      toast.error(res.error ?? "❌ Failed to add task");
      return false;
    }
  };

  const handleRemove = (id: string, title: string, completed: boolean) => {
    if (completed) {
      dispatch(removeOne(id))
        .unwrap()
        .then((res) => {
          if (res.success) toast.success("🗑️ Task removed");
          else toast.error(res.error ?? "❌ Failed to remove task");
        });
    } else {
      setTaskToDelete({ id, title });
      setShowConfirmDelete(true);
    }
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      const res = await dispatch(removeOne(taskToDelete.id)).unwrap();
      if (res.success) {
        toast.success(`🗑️ Task "${taskToDelete.title}" removed`);
      } else {
        toast.error(res.error ?? "❌ Failed to delete task");
      }
      setShowConfirmDelete(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setTaskToDelete(null);
  };

  const handleUpdate = async (id: string, newTitle: string) => {
    const res = await dispatch(updateTask({ id, title: newTitle })).unwrap();
    if (res.success) toast.success("✏️ Task updated");
    else toast.error(res.error ?? "❌ Failed to update task");
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const res = await dispatch(toggleComplete({ id, completed })).unwrap();
    if (res.success) {
      toast.success(completed ? "✅ Task completed" : "🔄 Task marked active");
    } else {
      toast.error(res.error ?? "❌ Failed to toggle task");
    }
  };

  const handleDeleteCompleted = async () => {
    const res = await dispatch(deleteCompleted()).unwrap();
    if (res.success) toast.success("🧹 Completed tasks deleted");
    else toast.error(res.error ?? "❌ Failed to delete completed tasks");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="page-wrapper">
      {/* Header with theme toggle */}
      <div className="header">
        <h1>📝 My Todo List</h1>
        <button className="toggle-theme-btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      {/* Main section */}
      <main className={`main-content ${showConfirmDelete ? "blurred" : ""}`}>
        <TaskInput onAdd={handleAdd} />

        {/* Filter buttons */}
        <div className="filter-buttons">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as "all" | "active" | "completed")}
              className={filter === f ? "active-filter" : ""}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task list */}
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              completed={task.completed}
              onRemove={() => handleRemove(task.id, task.title, task.completed)}
              onEdit={handleUpdate}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </ul>

        {/* Delete all completed button */}
        {filter === "completed" && filteredTasks.length > 0 && (
          <button
            className="delete-completed-button"
            onClick={handleDeleteCompleted}
          >
            🗑️ Delete All Completed Tasks
          </button>
        )}

        {loading && <p className="text-gray-400 mt-4">Loading tasks...</p>}
      </main>

      {/* Congrats Overlay */}
      {showCongrats && (
        <CongratsOverlay
          onClose={() => {
            setShowCongrats(false);
            localStorage.setItem("congratsDismissed", "true");
          }}
        />
      )}

      {/* Confirm Delete Overlay */}
      {showConfirmDelete && taskToDelete && (
        <ConfirmDeleteOverlay
          taskTitle={taskToDelete.title}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
