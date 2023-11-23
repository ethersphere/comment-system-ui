import {
  Comment,
  CommentNode,
  CommentRequest,
  readCommentsAsTree,
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
  approvedFeedAddress?: string;
  classes?: {
    wrapper?: string;
    form?: string;
    tabs?: string;
    comments?: string;
  };
}

export function SwarmCommentSystem(props: SwarmCommentSystemProps) {
  const { approvedFeedAddress, classes } = props;
  const [comments, setComments] = useState<CommentNode[] | null>(null);
  const [category, setCategory] = useState<"all" | "approved">("approved");
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [replyingComments, setReplyingComments] = useState<
    Comment[] | undefined
  >();

  const loadComments = async () => {
    try {
      setLoading(true);

      const comments = await readCommentsAsTree({
        ...props,
        approvedFeedAddress:
          category === "approved" ? approvedFeedAddress : undefined,
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

      if (replyingComments) {
        comment.replyId = replyingComments[0].id;
      }

      const addedComment = await writeComment(comment, props);

      const updatedComments = [...(comments as CommentNode[])];
      let currentCommentList = updatedComments;

      if (replyingComments) {
        replyingComments?.reverse().forEach(({ id }) => {
          const index = currentCommentList.findIndex(
            ({ comment }) => comment.id === id
          );

          if (index < 0) {
            return;
          }
          const parentNode = currentCommentList[index];

          currentCommentList[index] = { ...parentNode };

          currentCommentList = parentNode.replies;
        });
      }

      currentCommentList.push({ comment: addedComment, replies: [] });

      setComments(updatedComments);
      setReplyingComments(undefined);
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

  if (!comments) {
    return <div>Couldn't load comments</div>;
  }

  return (
    <div className={classes?.wrapper}>
      <SwarmCommentForm
        className={classes?.form}
        onSubmit={sendComment}
        replyingComment={replyingComments ? replyingComments[0] : undefined}
        onReplyCancel={() => setReplyingComments(undefined)}
        loading={loading || formLoading}
      />
      <Tabs
        activeTab={category === "approved" ? 0 : 1}
        className={classes?.tabs}
        disabled={[loading, loading]}
        tabs={approvedFeedAddress ? ["Author Selected", "All"] : ["All"]}
        onTabChange={(tab) => setCategory(tab === 0 ? "approved" : "all")}
      >
        <SwarmCommentList
          className={classes?.comments}
          onReply={setReplyingComments}
          comments={comments}
          replyLevel={0}
          maxReplyLevel={3}
        />
      </Tabs>
    </div>
  );
}
