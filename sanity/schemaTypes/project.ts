// sanity/schemaTypes/project.ts
import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "views",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      validation: (Rule) => Rule.min(1).max(20).required().error("Please enter a category"),
    }),
    defineField({
      name: "image",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image2",
      type: "url",
    }),
    defineField({
      name: "image3",
      type: "url",
    }),
    defineField({
      name: "pitch",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "techStack",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "githubUrl",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "upvotes",
      type: "number",
      initialValue: 0,
    }),
  ],
});
