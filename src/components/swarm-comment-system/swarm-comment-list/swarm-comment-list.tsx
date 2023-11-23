import { Comment, CommentNode } from "@ethersphere/comment-system";
import styles from "./swarm-comment-list.module.scss";

export interface SwarmCommentListProps {
  comments: CommentNode[];
  onReply: (comments: Comment[]) => void;
  replyLevel: number;
  className?: string;
  maxReplyLevel?: number;
}

export default function SwarmCommentList({
  comments,
  onReply,
  replyLevel,
  className,
  maxReplyLevel,
}: SwarmCommentListProps) {
  const canReply = () =>
    typeof maxReplyLevel !== "number" || replyLevel < maxReplyLevel;

  const onSubnodeReply = (comment: Comment, comments: Comment[]) => {
    comments.push(comment);
    onReply(comments);
  };

  return (
    <div className={`${styles["swarm-comment-list"]} ${className}`}>
      {comments.map(({ comment, replies }, index) => (
        <div key={index}>
          <p>
            <strong>{comment.user}</strong> on{" "}
            {new Date(comment.timestamp).toDateString()}
          </p>
          <p
            className={styles["comment"]}
            onClick={() => canReply() && onReply([comment])}
          >
            {comment.data}
          </p>
          {replies && (
            <div className={styles["replies"]}>
              <SwarmCommentList
                comments={replies}
                onReply={(comments) => onSubnodeReply(comment, comments)}
                className={className}
                replyLevel={replyLevel + 1}
                maxReplyLevel={maxReplyLevel}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
