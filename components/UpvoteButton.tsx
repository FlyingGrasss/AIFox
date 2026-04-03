// components/UpvoteButton.tsx
"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { upvoteProject } from "@/lib/actions";
import { cn } from "@/lib/utils";

const UpvoteButton = ({ id, initialUpvotes }: { id: string; initialUpvotes: number }) => {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = async () => {
    if (hasUpvoted) return;

    // Optimistic UI
    setUpvotes((prev) => prev + 1);
    setHasUpvoted(true);

    try {
      const result = await upvoteProject(id);
      if (result.status !== "SUCCESS") {
        // Rollback on error
        setUpvotes((prev) => prev - 1);
        setHasUpvoted(false);
      }
    } catch (error) {
      setUpvotes((prev) => prev - 1);
      setHasUpvoted(false);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={hasUpvoted}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer",
        hasUpvoted 
          ? "bg-red-50 border-red-200 text-red-500 cursor-default" 
          : "bg-white border-secondary text-black hover:border-red-200 hover:text-red-500"
      )}
    >
      <Heart size={20} fill={hasUpvoted ? "currentColor" : "none"} strokeWidth={2.5} />
      <span className="font-bold">{upvotes}</span>
    </button>
  );
};

export default UpvoteButton;
