export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  errors?: { error: string };
  data?: T;
};

type TaskData = {
  id: number;
  user_id: number;
  column_id: number;
  title: string;
  description: string;
  position: number;
  created_at: string;
  updated_at: string;
};

const API_BASE = 'http://localhost:3000';

export const getTasks = async (): Promise<ApiResponse<TaskData[]>> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: result.message,
        errors: { error: result.message },
      };
    }
    return result;
  } catch (err) {
    console.error('Failed to retrieve tasks', err);
    return { success: false, message: 'Network error. Please try again' };
  }
};

export const getTask = async (
  taskId: number,
): Promise<ApiResponse<TaskData>> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();

    if (!response.ok) {
      console.error('Failed to retrieve task');
      return {
        success: false,
        message: result.message ?? 'Failed to retrieve task',
        errors: { error: result.message },
      };
    }
    return result;
  } catch (err) {
    console.error('Failed to retrieve task', err);
    return { success: false, message: 'Network error. Please try again' };
  }
};
