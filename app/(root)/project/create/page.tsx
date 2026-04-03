// app/(root)/project/create/page.tsx
import { auth } from "@/auth";
import ProjectForm from "@/components/ProjectForm";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const CreateProjectContent = async () => {
  const session = await auth();

  if (!session) redirect("/");

  return <ProjectForm />;
};

const Page = async () => {
  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading !text-white">Submit Your Project</h1>
      </section>

      <section className="section_container">
        <Suspense fallback={<div className="h-96 w-full bg-secondary animate-pulse rounded-3xl" />}>
          <CreateProjectContent />
        </Suspense>
      </section>
    </>
  );
};

export default Page;