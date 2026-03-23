export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  errors?: { error: string };
  data?: T;
};

type ColumnData = {
  id: number;
  user_id: number;
  name: string;
  position: number;
  created_at: string;
};

const API_BASE = "http://localhost:3000";

export const getColumns = async (): Promise<ApiResponse<ColumnData[]>> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE}/columns`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
    console.error("Failed to retrieve columns");
    return { success: false, message: "Network error. Please try again" };
  }
};
