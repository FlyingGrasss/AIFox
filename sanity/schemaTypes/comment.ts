// sanity/schemaTypes/comment.ts
import { defineField, defineType } from "sanity";

export const comment = defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    defineField({
      name: "project",
      type: "reference",
      to: { type: "project" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
