export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  errors?: { error: string };
  data?: T | null;
};

type CommentData = {
  id: number;
  user_id: number;
  task_id: number;
  content: string;
  created_at: string;
  updated_at: string;
};

type CommentBody = {
  content: string;
};

const API_BASE = 'http://localhost:3000';

export const getComments = async (
  taskId: number,
): Promise<ApiResponse<CommentData[]>> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE}/tasks/${taskId}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();

    if (!response.ok) {
      console.error('Failed to retrieve comments');
      return {
        success: false,
        message: result.message ?? 'Failed to retrieve comments',
        errors: { error: result.message },
      };
    }
    return result;
  } catch (err) {
    console.error('Failed to retrieve comments', err);
    return { success: false, message: 'Network error. Please try again' };
  }
};

export const createComment = async (
  commentData: CommentBody,
  taskId: number,
): Promise<ApiResponse<CommentData | null>> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    });
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to create comment',
        errors: { error: result.message },
      };
    }
    return result;
  } catch (err) {
    console.error('Failed to create comment', err);
    return { success: false, message: 'Network error. Please try again' };
  }
};
