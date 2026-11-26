import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

const STORAGE_KEY = '@daily_do_list_tasks_v1';

/**
 * Loads all saved tasks from local device storage.
 */
export async function loadTasks(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Task =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.completed === 'boolean'
    );
  } catch {
    return [];
  }
}

/**
 * Persists the full task list to local device storage.
 */
export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage write errors so UI remains responsive
  }
}
