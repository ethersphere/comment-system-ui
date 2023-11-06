import { Comment, readComments } from "@ethersphere/comment-system";
import SwarmCommentList from "./swarm-comment-list/swarm-comment-list";
import { useEffect, useState } from "react";

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

  const loadComments = async () => {
    const comments = await readComments(props);

    setComments(comments);
    setLoading(false);
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

  return <SwarmCommentList comments={comments} />;
}
