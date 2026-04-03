// app/(root)/page.tsx
import { Suspense } from "react";
import SearchForm from "@/components/SearchForm";
import ProjectList from "@/components/ProjectList";
import { SanityLive } from "@/sanity/lib/live";

const HomeContent = async ({ searchParams }: { searchParams: Promise<{ query?: string }> }) => {
  const query = (await searchParams).query || null;

  return (
    <>
      <section className="pink_container">
        <SearchForm query={query || ""} />
      </section>


      <section className="section_container">
        <p className="text-30-bold">
          {query ? `Search results for "${query}"` : "Latest Projects"}
        </p>

        <Suspense fallback={<div className="mt-10 card_grid"><Skeleton /><Skeleton /><Skeleton /></div>}>
          <ProjectList query={query} />
        </Suspense>
      </section>
    </>
  );
};

const Skeleton = () => <div className="startup-card_skeleton" />;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <HomeContent searchParams={searchParams} />
      </Suspense>
      <SanityLive />
    </>
  );
}
