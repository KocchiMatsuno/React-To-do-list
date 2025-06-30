import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Task } from "../domain/entities/Task";
import { LocalStorageTaskRepository } from "../data/repos/LocalStorageTaskRepository";

import { AddTaskUseCase } from "../domain/usecases/AddTaskUseCase";
import { RemoveTaskUseCase } from "../domain/usecases/RemoveTaskUseCase";
import { UpdateTaskUseCase } from "../domain/usecases/UpdateTaskUseCase";
import { GetAllTasksUseCase } from "../domain/usecases/GetAllTasksUseCase";
import { ToggleCompleteUseCase } from "../domain/usecases/ToggleCompleteUseCase";
import { DeleteCompletedTasksUseCase } from "../domain/usecases/DeleteCompletedTasksUseCase";

// Result Types
type TaskResult = {
  success: boolean;
  task?: Task;
  error?: string;
};

type SimpleResult = {
  success: boolean;
  error?: string;
};

// Repo and use case instances
const repo = new LocalStorageTaskRepository();
const addUC = new AddTaskUseCase(repo);
const removeUC = new RemoveTaskUseCase(repo);
const updateUC = new UpdateTaskUseCase(repo);
const getAllUC = new GetAllTasksUseCase(repo);
const toggleUC = new ToggleCompleteUseCase(repo);
const deleteCompletedUC = new DeleteCompletedTasksUseCase(repo);

// Thunks
export const fetchTasks = createAsyncThunk<Task[]>("tasks/fetch", async () => {
  return await getAllUC.execute();
});

export const addNew = createAsyncThunk<TaskResult, string, { rejectValue: string }>(
  "tasks/add",
  async (title, thunkAPI) => {
    const res = await addUC.execute(title);
    if (!res.success) return thunkAPI.rejectWithValue(res.error ?? "Failed to add task");
    return res;
  }
);

export const removeOne = createAsyncThunk<SimpleResult & { arg: string }, string, { rejectValue: string }>(
  "tasks/remove",
  async (id, thunkAPI) => {
    const res = await removeUC.execute(id);
    if (!res.success) return thunkAPI.rejectWithValue(res.error ?? "Failed to remove task");
    return { ...res, arg: id };
  }
);

export const updateTask = createAsyncThunk<TaskResult, { id: string; title: string }, { rejectValue: string }>(
  "tasks/update",
  async ({ id, title }, thunkAPI) => {
    const task = new Task(id, title);
    const res = await updateUC.execute(task);
    if (!res.success) return thunkAPI.rejectWithValue(res.error ?? "Failed to update task");
    return res;
  }
);

export const toggleComplete = createAsyncThunk<TaskResult, { id: string; completed: boolean }, { rejectValue: string }>(
  "tasks/toggleComplete",
  async ({ id, completed }, thunkAPI) => {
    const res = await toggleUC.execute(id, completed);
    if (!res.success) return thunkAPI.rejectWithValue(res.error ?? "Failed to toggle task");
    return res;
  }
);

export const deleteCompleted = createAsyncThunk<SimpleResult, void, { rejectValue: string }>(
  "tasks/deleteCompleted",
  async (_, thunkAPI) => {
    const res = await deleteCompletedUC.execute();
    if (!res.success) return thunkAPI.rejectWithValue(res.error ?? "Failed to delete completed");
    return res;
  }
);

// Slice
type TaskState = {
  tasks: Task[];
  loading: boolean;
  error?: string;
};

const initialState: TaskState = {
  tasks: [],
  loading: false,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add
      .addCase(addNew.fulfilled, (state, action) => {
        if (action.payload.task) {
          state.tasks.push(action.payload.task);
        }
      })

      // Remove
      .addCase(removeOne.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload.arg);
      })

      // Update
      .addCase(updateTask.fulfilled, (state, action) => {
        const updated = action.payload.task;
        if (updated) {
          const index = state.tasks.findIndex((t) => t.id === updated.id);
          if (index !== -1) {
            state.tasks[index] = updated;
          }
        }
      })

      // Toggle
      .addCase(toggleComplete.fulfilled, (state, action) => {
        const toggled = action.payload.task;
        if (toggled) {
          const task = state.tasks.find((t) => t.id === toggled.id);
          if (task) task.completed = toggled.completed;
        }
      })

      // Delete completed
      .addCase(deleteCompleted.fulfilled, (state) => {
        state.tasks = state.tasks.filter((t) => !t.completed);
      });
  },
});

export default taskSlice.reducer;
