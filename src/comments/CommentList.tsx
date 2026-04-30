import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from '../api/comment';
import CommentForm from './CommentForm';
import type { Comment, CommentBody } from '../types/comment.types';
import { MessageSquare, Clock } from 'lucide-react';

export default function CommentList({ taskId }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState('');
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const id = Number(taskId);
  const { user } = useAuth();

  useEffect(() => {
    if (!taskId) return;
    const fetchComments = async () => {
      try {
        setLoading(true);
        setErrors('');

        const result = await getComments(id);
        if (result.errors) {
          setErrors(result.errors.error);
          setComments([]);
        } else {
          setComments(result.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch comments', err);
        setErrors('Failed to fetch comments');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [taskId, id]);

  const handleCreate = async (values: CommentBody) => {
    const response = await createComment(values, id);

    if (response.errors) {
      setErrors(response.errors.error);
      return;
    }

    const newComment = response.data;
    if (!newComment) return;

    const commentWithUserInfo = {
      ...newComment,
      username: user?.username || 'You',
    };
    setComments((prev) => [...prev, commentWithUserInfo]);
  };

  const handleUpdate = async (values: CommentBody, commentId: number) => {
    const response = await updateComment(values, commentId, id);

    if (response.errors) {
      setErrors(response.errors.error);
      return;
    }

    const result = await getComments(id);
    setComments(result.data || []);
    setEditCommentId(null);
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('Delete this comment?')) return;
    const response = await deleteComment(id, commentId);

    if (response.errors) {
      setErrors(response.errors.error);
      return;
    }

    const result = await getComments(id);
    setComments(result.data || []);
    setEditCommentId(null);
  };

  if (loading) return <p>Loading...</p>;
  if (errors) return <p>{errors}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2">
        <MessageSquare size={18} className="text-slate-400" />
        <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase">
          Activity ({comments.length})
        </h3>
      </div>

      {errors && (
        <p className="rounded bg-red-50 p-2 text-xs font-medium text-red-600">
          {errors}
        </p>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="group relative flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500">
                {comment.username.charAt(0)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700">
                      {comment.username || 'Unknown User'}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock size={10} />
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => setEditCommentId(comment.id)}
                      className="text-[11px] font-semibold text-slate-400 hover:text-slate-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-[11px] font-semibold text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {editCommentId === comment.id ? (
                  <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2">
                    <CommentForm
                      comment={comment}
                      setEditCommentId={setEditCommentId}
                      onSubmit={(values) => handleUpdate(values, comment.id)}
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl rounded-tl-none bg-slate-50 px-4 py-2 text-sm text-slate-700">
                    {comment.content}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-4">
        <p className="mb-3 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
          Leave a comment
        </p>
        <div className="rounded-xl border border-slate-200 bg-white p-1 shadow-sm transition-colors focus-within:border-slate-400">
          <CommentForm onSubmit={handleCreate} />
        </div>
      </div>
    </div>
  );
}
