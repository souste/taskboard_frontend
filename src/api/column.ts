export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  errors?: { error: string };
  data?: T | null;
};

type ColumnData = {
  id: number;
  user_id: number;
  name: string;
  position: number;
  created_at: string;
};

type ColumnBody = {
  name: string;
  position: number;
};

const API_BASE = 'http://localhost:3000';

export const getColumns = async (): Promise<ApiResponse<ColumnData[]>> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE}/columns`, {
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
    console.error('Failed to retrieve columns', err);
    return { success: false, message: 'Network error. Please try again' };
  }
};

export const createColumn = async (
  columnData: ColumnBody,
): Promise<ApiResponse<ColumnData | null>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE}/columns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(columnData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errors: { error: result.message || 'Failed to create column' },
      };
    }
    return result;
  } catch (err) {
    console.error('Failed to create column', err);
    return {
      success: false,
      errors: { error: 'Network error. Please try again' },
    };
  }
};

export const updateColumn = async (
  id: number,
  columnData: ColumnBody,
): Promise<ApiResponse<ColumnData | null>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE}/columns/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(columnData),
    });
    const result = await response.json();
    if (!response.ok) {
      return {
        success: false,
        errors: { error: result.message || 'Failed to update column' },
      };
    }
    return result;
  } catch (err) {
    console.error('Failed to update column', err);
    return {
      success: false,
      errors: { error: 'Network error. Please try again' },
    };
  }
};

export const deleteColumn = async (
  id: number,
): Promise<ApiResponse<ColumnData | null>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE}/columns/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    if (!response.ok) {
      return {
        success: false,
        errors: { error: result.message || 'Failed to delete column' },
      };
    }
    return result;
  } catch (err) {
    console.error('Failed to delete column', err);
    return {
      success: false,
      errors: { error: 'Network error. Please try again' },
    };
  }
};
