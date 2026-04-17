import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import type { Comment, CommentBody } from '../types/comment.types';

export default function CommentForm({ comment, onSubmit, setEditCommentId }) {
  const [values, setValues] = useState<CommentBody>({
    content: comment?.content ?? '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setValues({ content: comment?.content ?? '' });
  }, [comment]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    onSubmit(values);

    if (!comment) {
      setValues({
        content: '',
      });
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="content"
            type="text"
            value={values.content}
            onChange={handleChange}
            placeholder="Add a comment"
          />
        </div>
        <button className="bg-green-500">Submit</button>
        <button type="button" onClick={() => setEditCommentId(null)}>
          Cancel
        </button>
      </form>
    </div>
  );
}
