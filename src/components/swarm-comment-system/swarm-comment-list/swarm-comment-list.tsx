import { Comment } from "@ethersphere/comment-system";
import styles from "./swarm-comment-list.module.scss";

export interface SwarmCommentSystemProps {
  comments: Comment[];
}

export default function SwarmCommentList() {
  return <div className={styles.swarmCommentList}>comment system ui</div>;
}
