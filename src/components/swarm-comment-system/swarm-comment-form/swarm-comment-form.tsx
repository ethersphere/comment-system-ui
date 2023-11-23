import { Comment, CommentRequest } from "@ethersphere/comment-system";
import styles from "./swarm-comment-form.module.scss";
import { useState } from "react";

export interface SwarmCommentFormProps {
  loading: boolean;
  onSubmit: (comment: CommentRequest) => void;
  replyingComment?: Comment;
  onReplyCancel?: () => void;
  className?: string;
}

interface FormElements extends HTMLFormControlsCollection {
  user: HTMLInputElement;
  data: HTMLInputElement;
}
interface CommentFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface FormErrors {
  user?: string;
  data?: string;
}

export default function SwarmCommentForm({
  loading,
  onSubmit,
  replyingComment,
  onReplyCancel,
  className,
}: SwarmCommentFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (value: string): string | undefined => {
    if (!value) {
      return "This field is required.";
    }
  };
  const hasErrors = (errors: FormErrors): boolean => {
    return Object.values(errors).some((value) => Boolean(value));
  };

  const submit = (event: React.FormEvent<CommentFormElement>) => {
    event.preventDefault();
    const elements = event.currentTarget.elements;
    const user = elements.user.value;
    const data = elements.data.value;
    const errors: FormErrors = {
      user: validate(user),
      data: validate(data),
    };

    if (hasErrors(errors)) {
      return setErrors(errors);
    }

    onSubmit({ user, data });

    elements.user.value = "";
    elements.data.value = "";
  };

  return (
    <form
      className={`${styles["swarm-comment-form"]} ${className}`}
      onSubmit={submit}
    >
      <h6>Add comment:</h6>
      {replyingComment && (
        <>
          <p>Reply: {replyingComment.data}</p>
          <button className={styles["reply-cancel"]} onClick={onReplyCancel}>
            Cancel
          </button>
        </>
      )}
      <input
        className={errors.user && styles["field-error"]}
        onChange={() => setErrors({ ...errors, user: undefined })}
        type="text"
        name="user"
        placeholder="Your name"
        disabled={loading}
      />
      <textarea
        className={errors.data && styles["field-error"]}
        onChange={() => setErrors({ ...errors, data: undefined })}
        name="data"
        rows={5}
        disabled={loading}
      ></textarea>
      <button disabled={loading}>Submit</button>
    </form>
  );
}
