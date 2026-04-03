// components/ProjectCard.tsx
import { formatDate } from "@/lib/utils";
import { EyeIcon, Link as LinkIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import { Author, Project } from "@/sanity/types";

export type ProjectTypeCard = {
  _id: string;
  _createdAt: string;
  views: number | null;
  description: string | null;
  author: { _id: string; name: string | null; image: string | null; bio?: string | null } | null;
  image: string | null;
  title: string | null;
  category: string | null;
  githubUrl: string | null;
};

const ProjectCard = ({ post }: { post: ProjectTypeCard }) => {
  const { _createdAt, views, description, author, image, title, category, _id, githubUrl } = post;

  return (
    <li className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm font-semibold text-slate-400">{formatDate(_createdAt)}</p>
        <div className="flex items-center gap-1.5 text-slate-400">
          <EyeIcon size={16} />
          <span className="text-sm font-bold">{views}</span>
        </div>
      </div>

      <div className="flex justify-between items-start gap-4 mb-5">
        <div className="flex-1">
          <Link href={`/user/${author?._id}`} className="cursor-pointer">
            <p className="text-[13px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider mb-1">{author?.name}</p>
          </Link>
          <Link href={`/project/${_id}`} className="cursor-pointer">
            <h3 className="text-2xl font-extrabold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors" title={title}>
              {title}
            </h3>
          </Link>
        </div>
        <Link href={`/user/${author?._id}`} className="cursor-pointer shrink-0">
          <img
            src={author?.image || "https://placehold.co/48x48"}
            alt={author?.name || "author"}
            className="size-12 rounded-full border-2 border-slate-50 shadow-md object-cover"
          />
        </Link>
      </div>

      <Link href={`/project/${_id}`} className="cursor-pointer flex-1 flex flex-col">
        <p className="text-slate-600 font-medium text-[15px] line-clamp-2 mb-4 leading-relaxed">{description}</p>
        <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-slate-100 mb-5">
           <img src={image || "/placeholder.webp"} alt={title} className="object-cover size-full group-hover:scale-105 transition-transform duration-500" />
        </div>
      </Link>

      <div className="flex justify-between items-center gap-3 mt-auto pt-5 border-t border-slate-50">
        <Link href={`/?query=${category?.toLowerCase()}`} className="cursor-pointer">
          <p className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide hover:bg-indigo-100 transition-colors">{category}</p>
        </Link>
        
        <div className="flex items-center gap-2">
          {githubUrl && (
            <Link 
              href={githubUrl} 
              target="_blank" 
              className="p-2.5 bg-slate-50 rounded-xl text-slate-600 hover:bg-slate-900 hover:text-white transition-all cursor-pointer shadow-sm"
              title="View Code"
            >
              <LinkIcon size={18} />
            </Link>
          )}
          <Link 
            href={`/project/${_id}`}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-[15px] hover:bg-indigo-600 transition-all cursor-pointer shadow-md active:scale-95"
          >
            Explore
          </Link>
        </div>
      </div>
    </li>
  );
};

export default ProjectCard;
