export interface Task { id: string; title: string; }
export interface TaskState { tasks: Task[]; loading: boolean; error?: string; }
export const LOAD_START = 'LOAD_START', LOAD_SUCCESS = 'LOAD_SUCCESS', LOAD_ERROR = 'LOAD_ERROR', ADD = 'ADD', REMOVE = 'REMOVE';
