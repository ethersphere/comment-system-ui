import { Comment } from "@ethersphere/comment-system";
import styles from "./swarm-comment-list.module.scss";

export interface SwarmCommentSystemProps {
  comments: Comment[];
}

export default function SwarmCommentList({
  comments,
}: SwarmCommentSystemProps) {
  return (
    <div className={styles.swarmCommentList}>
      {comments.map(({ user, data, timestamp }, index) => (
        <div key={index}>
          <p>
            <strong>{user}</strong> on {new Date(timestamp).toDateString()}
          </p>
          <p>{data}</p>
        </div>
      ))}
    </div>
  );
}
