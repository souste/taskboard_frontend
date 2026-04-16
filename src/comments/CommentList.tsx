import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getComments, createComment } from '../api/comment';
import CommentForm from './CommentForm';
import type { Comment, CommentBody } from '../types/comment.types';

export default function CommentList() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState('');
  const { taskId } = useParams();

  useEffect(() => {
    if (!taskId) return;
    const fetchComments = async () => {
      try {
        setLoading(true);
        setErrors('');
        const id = Number(taskId);
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
    const id = Number(taskId);
    const response = await createComment(values, id);

    if (response.errors) {
      setErrors(response.errors.error);
      return;
    }

    const newComment = response.data;
    if (!newComment) return;
    setComments((prev) => [...prev, newComment]);
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
          </div>
        ))}
      </div>
      <div>Create Comment:</div>
      <CommentForm onSubmit={handleCreate} taskId={taskId} />
    </div>
  );
}
