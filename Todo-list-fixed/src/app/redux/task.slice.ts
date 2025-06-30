import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../../domain/entities/TaskEntity';
import { LocalStorageTaskRepository } from '../../data/LocalStorageTaskRepository';
import { AddTaskUseCase } from '../../domain/usecases/AddTaskUseCase';
import { RemoveTaskUseCase } from '../../domain/usecases/RemoveTaskUseCase';
import { GetAllTasksUseCase } from '../../domain/usecases/GetAllTasksUseCase';
import { UpdateTaskUseCase } from '../../domain/usecases/UpdateTaskUseCase';
import { v4 as uuidv4 } from 'uuid';

const repo = new LocalStorageTaskRepository();
const getAllTasks = new GetAllTasksUseCase(repo);
const addTaskUC = new AddTaskUseCase(repo);
const removeTaskUC = new RemoveTaskUseCase(repo);
const updateTaskUC = new UpdateTaskUseCase(repo);

export const fetchTasks = createAsyncThunk('tasks/fetch', async () => {
  return await getAllTasks.execute();
});

export const addNew = createAsyncThunk('tasks/add', async (title: string) => {
  const task = { id: uuidv4(), title, completed: false };
  await addTaskUC.execute(task);
  return task;
});

export const removeOne = createAsyncThunk('tasks/remove', async (id: string) => {
  await removeTaskUC.execute(id);
  return id;
});

// ✅ FIXED: updateTask sends a complete Task object
export const updateTask = createAsyncThunk(
  'tasks/update',
  async (payload: { id: string; title: string }, { getState }) => {
    const state = getState() as { tasks: TaskState };
    const existing = state.tasks.tasks.find(t => t.id === payload.id);

    if (!existing) throw new Error("Task not found");

    const updatedTask: Task = {
      id: payload.id,
      title: payload.title,
      completed: existing.completed
    };

    await updateTaskUC.execute(updatedTask);
    return updatedTask;
  }
);

// Toggle completed
export const toggleComplete = createAsyncThunk(
  'tasks/toggleComplete',
  async (payload: { id: string; completed: boolean }, { getState }) => {
    const state = getState() as { tasks: TaskState };
    const task = state.tasks.tasks.find((t) => t.id === payload.id);

    if (!task) throw new Error("Task not found");

    const updatedTask: Task = {
      id: task.id,
      title: task.title,
      completed: payload.completed
    };

    await updateTaskUC.execute(updatedTask);
    return updatedTask;
  }
);

// Delete all completed
export const deleteCompleted = createAsyncThunk(
  'tasks/deleteCompleted',
  async (_, { getState }) => {
    const state = getState() as { tasks: TaskState };
    const toDelete = state.tasks.tasks.filter((t) => t.completed);
    await Promise.all(toDelete.map((t) => removeTaskUC.execute(t.id)));
    return toDelete.map((t) => t.id);
  }
);

// State type
interface TaskState {
  tasks: Task[];
  loading: boolean;
}

// Initial state
const initialState: TaskState = {
  tasks: [],
  loading: false,
};

// ... (imports unchanged)

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(addNew.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(removeOne.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const task = state.tasks.find((t) => t.id === action.payload.id);
        if (task) {
          task.title = action.payload.title;
          task.completed = action.payload.completed;
        }
      })
      // ✅ This is the FIX
      .addCase(toggleComplete.fulfilled, (state, action: PayloadAction<Task>) => {
        const task = state.tasks.find((t) => t.id === action.payload.id);
        if (task) {
          task.completed = action.payload.completed;
        }
      })
      .addCase(deleteCompleted.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.tasks = state.tasks.filter((t) => !action.payload.includes(t.id));
      });
  },
});


export default taskSlice.reducer;
