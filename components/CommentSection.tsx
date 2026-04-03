// components/CommentSection.tsx
"use client";

import React, { useState, useTransition } from "react";
import { createComment, deleteComment } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import { Send, Trash2 } from "lucide-react";

interface Comment {
  _id: string;
  text: string;
  _createdAt: string;
  author: {
    _id: string;
    name: string;
    image: string;
  };
}

const CommentSection = ({ 
  projectId, 
  comments, 
  user 
}: { 
  projectId: string; 
  comments: Comment[]; 
  user?: { id: string; name?: string | null; image?: string | null } 
}) => {
  const [commentText, setCommentText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isPending) return;

    startTransition(async () => {
      const result = await createComment(projectId, commentText);
      if (result.status === "SUCCESS") {
        setCommentText("");
      }
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    startTransition(async () => {
      await deleteComment(commentId, projectId);
    });
  };

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold text-slate-900 mb-8">Comments ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleAddComment} className="flex gap-4 mb-12 items-start">
          <img
            src={user.image || "https://placehold.co/40x40"}
            alt={user.name || "user"}
            className="size-10 rounded-full border border-slate-200"
          />
          <div className="flex-1 relative group">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add your thoughts..."
              className="w-full bg-white border border-slate-200 rounded-[24px] p-5 pr-14 text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none min-h-[120px] shadow-sm"
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={isPending || !commentText.trim()}
              className="absolute bottom-5 right-5 size-10 bg-slate-900 text-white rounded-full flex justify-center items-center hover:bg-indigo-600 disabled:opacity-50 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-100 border border-slate-200 rounded-[24px] p-8 text-center mb-12">
          <p className="text-slate-500 font-medium">Please sign in to join the discussion.</p>
        </div>
      )}

      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            <img
              src={comment.author?.image || "https://placehold.co/40x40"}
              alt="avatar"
              className="size-10 rounded-full border border-slate-200 object-cover"
            />
            <div className="flex-1 bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="font-bold text-[15px] text-slate-900">{comment.author?.name}</span>
                  <span className="text-xs font-semibold text-slate-400">{formatDate(comment._createdAt)}</span>
                </div>
                {user?.id === comment.author?._id && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Comment"
                    disabled={isPending}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <p className="text-[15px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                {comment.text}
              </p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-center text-slate-400 py-10 font-medium">No comments yet. Be the first to start the conversation!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
