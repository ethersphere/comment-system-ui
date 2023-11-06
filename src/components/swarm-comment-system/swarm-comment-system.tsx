import {
  Comment,
  CommentRequest,
  readComments,
  writeComment,
} from "@ethersphere/comment-system";
import SwarmCommentList from "./swarm-comment-list/swarm-comment-list";
import { useEffect, useState } from "react";
import SwarmCommentForm from "./swarm-comment-form/swarm-comment-form";

/**
 * stamp - Postage stamp ID. If ommitted a first available stamp will be used.
 * identifier - Resource identifier. If not sepcified it's calculated from bzz path.
 * beeApiUrl - Bee API URL, default http://localhost:1633
 * beeDebugApiUrl - Bee Debug API URL, default http://localhost:1635
 */
export interface SwarmCommentSystemProps {
  stamp?: string;
  identifier?: string;
  beeApiUrl?: string;
  beeDebugApiUrl?: string;
}

export default function SwarmCommentSystem(props: SwarmCommentSystemProps) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const loadComments = async () => {
    const comments = await readComments(props);

    setComments(comments);
    setLoading(false);
  };

  const sendComment = async (comment: CommentRequest) => {
    try {
      setFormLoading(true);

      await writeComment(comment, props);

      setComments([
        ...(comments as Comment[]),
        { ...comment, timestamp: new Date().getTime() },
      ]);
    } catch (error) {
      // TODO the error should be displayed on page
      alert(error);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  if (loading) {
    return <div>Loading comments...</div>;
  }

  if (!comments) {
    return <div>Couldn't load comments</div>;
  }

  return (
    <div>
      <SwarmCommentForm onSubmit={sendComment} loading={formLoading} />
      <SwarmCommentList comments={comments} />
    </div>
  );
}
