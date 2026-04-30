export type Comment = {
  id: number;
  user_id: number;
  task_id: number;
  username: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type CommentBody = {
  content: string;
};
