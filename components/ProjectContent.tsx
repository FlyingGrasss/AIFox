// components/ProjectContent.tsx
"use client";

import React, { startTransition } from "react";
import Link from "next/link";
import { Edit, Trash2, Link as LinkIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { deleteProject } from "@/lib/actions";
import { useRouter } from "next/navigation";

import { PROJECT_BY_ID_QUERYResult } from "@/sanity/types";

interface Props {
  post: NonNullable<PROJECT_BY_ID_QUERYResult>;
  userId?: string;
}

const ProjectContent = ({ post, userId }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    startTransition(async () => {
      const result = await deleteProject(post._id);
      if (result.status === "SUCCESS") {
        router.push("/");
      }
    });
  };

  return (
    <>
      <section className="pink_container min-h-[300px]!">
        <div className="flex flex-col items-center gap-6">
          <p className="bg-white/20 text-white px-4 py-1.5 font-bold rounded-full uppercase text-xs tracking-wider">
            {formatDate(post?._createdAt)}
          </p>
          {userId === post.author?._id && (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <Link
                href={`/project/${post._id}/edit`}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2 border border-white/10 shadow-lg"
              >
                <Edit size={16} /> Edit Project
              </Link>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          )}
        </div>
        <h1 className="text-white font-bold sm:text-[64px] sm:leading-[72px] text-[40px] leading-[48px] max-w-5xl text-center my-5 tracking-tight animate-in fade-in zoom-in duration-700">
          {post.title}
        </h1>
        <p className="font-medium text-[20px] text-white/80 max-w-2xl text-center wrap-break-word leading-relaxed">
          {post.description}
        </p>
      </section>

      <section className="px-6 py-10 max-w-7xl mx-auto border-b border-slate-100 mb-10">
        <div className="space-y-8">
          <div className="relative group">
            <img
              src={post.image || "/placeholder.webp"}
              alt="thumbnail"
              className="w-full h-auto rounded-[48px] shadow-2xl object-cover max-h-[700px] border border-slate-100"
            />
            {post.githubUrl && (
              <Link
                href={post.githubUrl}
                target="_blank"
                className="absolute bottom-8 right-8 flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all cursor-pointer shadow-2xl active:scale-95"
              >
                <LinkIcon size={24} />
                <span>View Code</span>
              </Link>
            )}
          </div>

          {(post.image2 || post.image3) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {post.image2 && (
                <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-xl border border-slate-100 group">
                  <img
                    src={post.image2}
                    alt="Secondary preview"
                    className="object-cover size-full group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              {post.image3 && (
                <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-xl border border-slate-100 group">
                  <img
                    src={post.image3}
                    alt="Tertiary preview"
                    className="object-cover size-full group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProjectContent;
