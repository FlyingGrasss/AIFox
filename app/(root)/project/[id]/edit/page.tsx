// app/(root)/project/[id]/edit/page.tsx
import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { PROJECT_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound, redirect } from "next/navigation";
import ProjectForm from "@/components/ProjectForm";
import React from "react";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  if (!session) redirect("/");

  const post = await client.fetch(PROJECT_BY_ID_QUERY, { id });

  if (!post) return notFound();

  // Security: only the author can edit
  if (post.author?._id !== session.user.id) {
    redirect(`/project/${id}`);
  }

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="text-white font-bold sm:text-[54px] sm:leading-[64px] text-[36px] leading-[44px] max-w-5xl text-center tracking-tight animate-in fade-in slide-in-from-top-4 duration-700">
           Edit Project
        </h1>
      </section>

      <section className="px-6 py-10 max-w-7xl mx-auto">
        <ProjectForm initialData={post} />
      </section>
    </>
  );
};

export default Page;
