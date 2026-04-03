// app/(root)/project/[id]/page.tsx
import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { PROJECT_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import UpvoteButton from "@/components/UpvoteButton";
import CommentSection from "@/components/CommentSection";
import { auth } from "@/auth";
import ProjectContent from "@/components/ProjectContent";
import { PROJECT_BY_ID_QUERYResult } from "@/sanity/types";
import { Session } from "next-auth";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 animate-pulse" />}>
      <ProjectPageContent params={params} />
    </Suspense>
  );
};

const ProjectPageContent = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();
  const post = await client.fetch(PROJECT_BY_ID_QUERY, { id }, { useCdn: false });

  if (!post) return notFound();

  return (
    <>
      <ProjectContent post={post} userId={session?.user?.id} />

      <section className="px-6 py-10 max-w-7xl mx-auto">
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-6 pb-10 border-b border-slate-100">
            <Link href={`/user/${post.author?._id}`} className="flex gap-4 items-center group cursor-pointer">
              <img
                src={post.author?.image || "https://placehold.co/64x64"}
                alt="avatar"
                className="size-16 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div>
                <p className="text-xl font-bold text-slate-900">{post.author?.name}</p>
                <p className="text-sm font-semibold text-slate-400">{post.author?.username}</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <UpvoteButton id={id} initialUpvotes={post.upvotes || 0} />
              <p className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-2xl text-sm font-bold uppercase tracking-wide">
                {post.category}
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-3xl font-extrabold text-slate-900 mb-8">About this project</h3>
            <div className="prose max-w-none text-slate-600 text-[17px] leading-loose">
              {post.pitch}
            </div>
          </div>

          {post.techStack && post.techStack.length > 0 && (
            <div className="mt-12">
              <h4 className="text-xl font-bold text-slate-900 mb-6">Built with</h4>
              <div className="flex flex-wrap gap-3">
                {post.techStack.map((tech: string) => (
                  <span key={tech} className="px-5 py-2.5 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 border border-slate-200/50">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto my-20 border-t border-slate-100" />

        <Suspense fallback={<div className="h-64 w-full bg-slate-100 animate-pulse rounded-[32px]" />}>
          <Comments id={id} initialComments={post.comments || []} user={session?.user} />
        </Suspense>

        <Suspense fallback={<Skeleton className="fixed bottom-6 right-6 h-12 w-28 rounded-full bg-slate-900/10" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

const Comments = async ({ id, initialComments, user }: { id: string; initialComments: NonNullable<PROJECT_BY_ID_QUERYResult>['comments']; user?: Session['user'] }) => {
  return (
    <CommentSection
      projectId={id}
      comments={initialComments}
      user={user}
    />
  );
}

export default Page;