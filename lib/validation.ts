// lib/validation.ts
import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  category: z.string().min(1).max(20),
  link: z.string().url(),
  link2: z.string().url().optional().or(z.literal("")),
  link3: z.string().url().optional().or(z.literal("")),
  pitch: z.string().min(10),
  githubUrl: z.string().url(),
  techStack: z.array(z.string()).min(1),
});
