// lib/actions.ts
"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { revalidatePath } from "next/cache";

export const createProject = async (state: unknown, form: FormData, pitch: string, techStack: string[]) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  const { title, description, category, link, link2, link3, githubUrl } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch" && key !== "techStack")
  );

  try {
    // Check if user has more than 10 projects
    const userProjectsCount = await writeClient.fetch(
      `count(*[_type == "project" && author._ref == $id])`,
      { id: session.user.id }
    );

    if (userProjectsCount >= 10) {
      return parseServerActionResponse({
        error: "You can only create up to 10 projects.",
        status: "ERROR",
      });
    }

    const slug = slugify(title as string, { lower: true, strict: true });
    const project = {
      title,
      description,
      category,
      image: link,
      image2: link2,
      image3: link3,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.user?.id,
      },
      pitch,
      techStack,
      githubUrl,
      upvotes: 0,
    };

    const result = await writeClient.create({ _type: "project", ...project });

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
      values: { title, description, category, link, link2, link3, githubUrl, pitch, techStack },
    });
  }
};

export const updateProject = async (id: string, prevState: unknown, formData: FormData, pitch: string, techStack: string[]) => {
  const session = await auth();
  if (!session) return parseServerActionResponse({ error: "Not signed in", status: "ERROR" });

  try {
    const project = await writeClient.fetch(`*[_type == "project" && _id == $id][0]`, { id });
    if (project?.author?._ref !== session.user.id) {
       return parseServerActionResponse({ error: "Unauthorized", status: "ERROR" });
    }

    const { title, description, category, link, link2, link3, githubUrl } = Object.fromEntries(
      Array.from(formData).filter(([key]) => key !== "pitch" && key !== "techStack")
    );

    const slug = slugify(title as string, { lower: true, strict: true });

    const updatedData = {
      title,
      description,
      category,
      image: link,
      image2: link2,
      image3: link3,
      slug: { _type: "slug", current: slug },
      pitch,
      techStack,
      githubUrl,
    };

    await writeClient.patch(id).set(updatedData).commit();
    revalidatePath(`/project/${id}`);

    return parseServerActionResponse({ _id: id, status: "SUCCESS" });
  } catch (error) {
    return parseServerActionResponse({ error: JSON.stringify(error), status: "ERROR" });
  }
};

export const deleteProject = async (id: string) => {
  const session = await auth();
  if (!session) return parseServerActionResponse({ error: "Not signed in", status: "ERROR" });

  try {
    const project = await writeClient.fetch(`*[_type == "project" && _id == $id][0]`, { id });
    if (project?.author?._ref !== session.user.id) {
       return parseServerActionResponse({ error: "Unauthorized", status: "ERROR" });
    }

    await writeClient.delete(id);
    revalidatePath("/");
    return parseServerActionResponse({ status: "SUCCESS" });
  } catch (error) {
    return parseServerActionResponse({ error: JSON.stringify(error), status: "ERROR" });
  }
};

export const upvoteProject = async (id: string) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  try {
    const result = await writeClient
      .patch(id)
      .setIfMissing({ upvotes: 0 })
      .inc({ upvotes: 1 })
      .commit();

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const createComment = async (id: string, text: string) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  try {
    // Check if project has more than 10 comments
    const projectCommentsCount = await writeClient.fetch(
      `count(*[_type == "comment" && project._ref == $id])`,
      { id }
    );

    if (projectCommentsCount >= 10) {
      return parseServerActionResponse({
        error: "This project has reached the maximum number of allowed comments.",
        status: "ERROR",
      });
    }

    const result = await writeClient.create({
      _type: "comment",
      project: { _type: "reference", _ref: id },
      author: { _type: "reference", _ref: session?.user?.id },
      text,
    });

    revalidatePath(`/project/${id}`);

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const deleteComment = async (commentId: string, projectId: string) => {
  const session = await auth();
  if (!session) return parseServerActionResponse({ error: "Not signed in", status: "ERROR" });

  try {
    const comment = await writeClient.fetch(`*[_type == "comment" && _id == $id][0]`, { id: commentId });
    if (comment?.author?._ref !== session.user.id) {
       return parseServerActionResponse({ error: "Unauthorized", status: "ERROR" });
    }

    await writeClient.delete(commentId);
    revalidatePath(`/project/${projectId}`);
    return parseServerActionResponse({ status: "SUCCESS" });
  } catch (error) {
    return parseServerActionResponse({ error: JSON.stringify(error), status: "ERROR" });
  }
};
