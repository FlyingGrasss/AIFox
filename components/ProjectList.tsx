// components/ProjectList.tsx
import React from "react";
import ProjectCard, { ProjectTypeCard } from "./ProjectCard";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";

const ProjectList = async ({ query }: { query: string | null }) => {
  const params = { search: query || null };
  const { data: posts } = await sanityFetch({ query: PROJECTS_QUERY, params });

  return (
    <ul className="mt-10 card_grid">
      {posts?.length > 0 ? (
        posts.map((post: ProjectTypeCard) => (
          <ProjectCard key={post?._id} post={post} />
        ))
      ) : (
        <p className="no-result">No projects found</p>
      )}
    </ul>
  );
};

export default ProjectList;
