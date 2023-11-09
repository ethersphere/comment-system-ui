import {
  Comment,
  CommentRequest,
  readComments,
  writeComment,
} from "@ethersphere/comment-system";
import SwarmCommentList from "./swarm-comment-list/swarm-comment-list";
import { useEffect, useState } from "react";
import SwarmCommentForm from "./swarm-comment-form/swarm-comment-form";
import { Tabs } from "../tabs/tabs";

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
  approvedFeed?: string;
}

export default function SwarmCommentSystem(props: SwarmCommentSystemProps) {
  const { approvedFeed } = props;
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [category, setCategory] = useState<"all" | "approved">("all");
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const loadComments = async () => {
    try {
      setLoading(true);

      const comments = await readComments({
        ...props,
        approvedFeed: category === "approved" ? approvedFeed : undefined,
      });

      setComments(comments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
  }, [category]);

  if (loading) {
    return <div>Loading comments...</div>;
  }

  if (!comments) {
    return <div>Couldn't load comments</div>;
  }

  return (
    <div>
      <SwarmCommentForm onSubmit={sendComment} loading={formLoading} />
      <Tabs
        tabs={["All", "Author Selected"]}
        disabled={[false, !approvedFeed]}
        onTabChange={(tab) => setCategory(tab === 0 ? "all" : "approved")}
      >
        <SwarmCommentList comments={comments} />
      </Tabs>
    </div>
  );
}
