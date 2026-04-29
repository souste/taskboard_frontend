import { useState, ChangeEvent, FormEvent } from 'react';
import type { Comment, CommentBody } from '../types/comment.types';

type CommentFormProps = {
  onSubmit: (values: CommentBody) => void;
  comment?: Comment | null;
  setEditCommentId?: (value: number | null) => void;
};

export default function CommentForm({
  comment,
  setEditCommentId,
  onSubmit,
}: CommentFormProps) {
  const [values, setValues] = useState<CommentBody>({
    content: comment?.content ?? '',
  });

  const [error, setError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValues({ content: event.target.value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setError('');
    onSubmit(values);

    if (!comment) {
      setValues({ content: '' });
    }

    setEditCommentId?.(null);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}

      <textarea
        name="content"
        rows={3}
        value={values.content}
        onChange={handleChange}
        placeholder="Write a comment..."
        className="w-full resize-none rounded-lg border-none bg-transparent p-2 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-0"
      />

      <div className="flex items-center justify-end gap-2 rounded-b-xl border-t border-slate-100 bg-slate-50/50 p-2">
        {comment && (
          <button
            type="button"
            onClick={() => setEditCommentId?.(null)}
            className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-md bg-slate-800 px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-slate-900 active:scale-95"
        >
          {comment ? 'Save Changes' : 'Comment'}
        </button>
      </div>
    </form>
  );
}
