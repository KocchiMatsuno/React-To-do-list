import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../reduxToolkit/task.slice";

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

// 🔧 Defines types used by your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
