import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from '../api/comment';
import CommentForm from './CommentForm';
import type { Comment, CommentBody } from '../types/comment.types';

export default function CommentList({ taskId }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState('');
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const id = Number(taskId);

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
  }, [taskId]);

  const handleCreate = async (values: CommentBody) => {
    const response = await createComment(values, id);

    if (response.errors) {
      setErrors(response.errors.error);
      return;
    }

    const newComment = response.data;
    if (!newComment) return;
    setComments((prev) => [...prev, newComment]);
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

  const handleEdit = (commentId: number) => {
    setEditCommentId(commentId);
  };

  if (loading) return <p>Loading...</p>;
  if (errors) return <p>{errors}</p>;

  return (
    <div>
      <div>Comments:</div>
      <div>
        {comments.map((comment) => (
          <div key={comment.id}>
            <div>{comment.content}</div>
            <div>
              Comment Created: {new Date(comment.created_at).toLocaleString()}
            </div>
            <button
              onClick={() => handleEdit(comment.id)}
              className="bg-yellow-500"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => handleDelete(comment.id)}
              className="bg-red-500"
            >
              Delete
            </button>
            {editCommentId === comment.id && (
              <CommentForm
                comment={comment}
                setEditCommentId={setEditCommentId}
                onSubmit={(values) => handleUpdate(values, comment.id)}
              />
            )}
          </div>
        ))}
      </div>
      <div>Create Comment:</div>
      <CommentForm onSubmit={handleCreate} />
    </div>
  );
}
