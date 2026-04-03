// app/(root)/user/[id]/page.tsx
import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import UserProjects from "@/components/UserProjects";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SessionTitle = async ({ id }: { id: string }) => {
  const session = await auth();
  return (
    <p className="text-3xl font-bold text-slate-900">
      {session?.user?.id === id ? "Your" : "User"} Projects
    </p>
  );
}


const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 animate-pulse" />}>
      <UserPageContent params={params} />
    </Suspense>
  );
};

const UserPageContent = async ({ params }: { params: Promise<{ id: string }> }) => {
  const idValue = (await params).id;
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id: idValue });

  if (!user) return notFound();

  return (
    <div className="w-full pb-10 pt-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <div className="w-full lg:w-80 p-8 flex flex-col items-center bg-white border border-slate-200 shadow-xl rounded-[32px] h-fit">
        <div className="w-full text-center mb-6">
          <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{user.name}</h3>
        </div>

        <div className="size-56 rounded-full border-4 border-slate-50 shadow-lg overflow-hidden mb-6">
          <img
            src={user.image || "https://placehold.co/220x220"}
            alt={user.name}
            className="object-cover size-full"
          />
        </div>

        <p className="text-2xl font-bold text-slate-900">{user.username}</p>
        <p className="mt-2 text-center text-slate-500 font-medium leading-relaxed">{user.bio}</p>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        <Suspense fallback={<p className="text-3xl font-bold text-slate-900">Projects</p>}>
          <SessionTitle id={idValue} />
        </Suspense>
        
        <div className="grid sm:grid-cols-2 gap-8">
          <Suspense fallback={<Skeleton className="w-full h-80 rounded-[28px] bg-slate-200 animate-pulse" />}>
            <UserProjects id={idValue} />
          </Suspense>
        </div>
      </div>
    </div>
  );

};

export default Page;
