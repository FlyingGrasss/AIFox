// components/ProjectForm.tsx
"use client";

import React, { useState, useActionState, useEffect, useRef } from "react";
import { projectSchema } from "@/lib/validation";
import { z } from "zod";
import { createProject, updateProject } from "@/lib/actions";
import { useRouter } from "next/navigation";
import TechStackInput from "./TechStackInput";
import { Send, AlertCircle, Save } from "lucide-react";

interface Props {
  initialData?: {
    _id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    image2?: string;
    image3?: string;
    githubUrl: string;
    pitch: string;
    techStack: string[];
  };
}

const ProjectForm = ({ initialData }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState(initialData?.pitch || "");
  const [techStack, setTechStack] = useState<string[]>(initialData?.techStack || []);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        link2: formData.get("link2") as string,
        link3: formData.get("link3") as string,
        githubUrl: formData.get("githubUrl") as string,
        pitch,
        techStack,
      };

      await projectSchema.parseAsync(formValues);
      setErrors({});

      let result;
      if (initialData?._id) {
        result = await updateProject(initialData._id, prevState, formData, pitch, techStack);
      } else {
        result = await createProject(prevState, formData, pitch, techStack);
      }

      if (result.status === "SUCCESS") {
        router.push(`/project/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        const mappedErrors = Object.fromEntries(
          Object.entries(fieldErrors).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
        ) as Record<string, string>;
        
        setErrors(mappedErrors);
        
        const entries = Array.from(formData.entries()) as [string, string][];
        const values = Object.fromEntries(entries);

        return { 
          ...prevState, 
          error: "Please check the form for errors.", 
          status: "ERROR", 
          values: { ...values, pitch, techStack } 
        };
      }

      return {
        ...prevState,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    status: "INITIAL",
    error: "",
  });

  useEffect(() => {
    if (state.status === "ERROR") {
      const firstError = formRef.current?.querySelector(".text-red-500");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [state]);

  const inputStyles = "w-full bg-white border border-slate-200 px-6 py-4 text-[16px] text-slate-900 font-medium rounded-2xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm";
  const labelStyles = "block font-bold text-[14px] text-slate-500 uppercase tracking-widest mb-2 ml-1";

  const isEditing = !!initialData?._id;

  return (
    <form ref={formRef} action={formAction} className="max-w-2xl mx-auto my-12 space-y-8 bg-white/50 p-8 rounded-[32px] border border-slate-100 shadow-xl backdrop-blur-sm">
      <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-10">
        {isEditing ? "Update Your Project" : "Launch Your Project"}
      </h2>

      <div className="space-y-2">
        <label htmlFor="title" className={labelStyles}>Title</label>
        <input
          id="title"
          name="title"
          defaultValue={state.values?.title || initialData?.title}
          className={`${inputStyles} ${errors.title ? "border-red-300 ring-2 ring-red-500/10" : ""}`}
          required
          placeholder="What's your project name?"
        />
        {errors.title && <p className="text-red-500 mt-2 text-sm ml-1 font-medium flex items-center gap-1.5"><AlertCircle size={14} /> {errors.title}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className={labelStyles}>Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={state.values?.description || initialData?.description}
          className={`${inputStyles} min-h-[100px] resize-none ${errors.description ? "border-red-300 ring-2 ring-red-500/10" : ""}`}
          required
          placeholder="A catchy one-liner or short summary"
        />
        {errors.description && <p className="text-red-500 mt-2 text-sm ml-1 font-medium flex items-center gap-1.5"><AlertCircle size={14} /> {errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="category" className={labelStyles}>Category</label>
          <input
            id="category"
            name="category"
            defaultValue={state.values?.category || initialData?.category}
            className={`${inputStyles} ${errors.category ? "border-red-300 ring-2 ring-red-500/10" : ""}`}
            required
            placeholder="AI, SaaS, Mobile..."
          />
          {errors.category && <p className="text-red-500 mt-2 text-sm ml-1 font-medium flex items-center gap-1.5"><AlertCircle size={14} /> {errors.category}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="githubUrl" className={labelStyles}>GitHub Repo</label>
          <input
            id="githubUrl"
            name="githubUrl"
            defaultValue={state.values?.githubUrl || initialData?.githubUrl}
            className={`${inputStyles} ${errors.githubUrl ? "border-red-300 ring-2 ring-red-500/10" : ""}`}
            required
            placeholder="github.com/..."
          />
          {errors.githubUrl && <p className="text-red-500 mt-2 text-sm ml-1 font-medium flex items-center gap-1.5"><AlertCircle size={14} /> {errors.githubUrl}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="link" className={labelStyles}>Primary Image URL</label>
          <input
            id="link"
            name="link"
            defaultValue={state.values?.link || initialData?.image}
            className={`${inputStyles} ${errors.link ? "border-red-300 ring-2 ring-red-500/10" : ""}`}
            required
            placeholder="Paste a link to a preview image"
          />
          {errors.link && <p className="text-red-500 mt-2 text-sm ml-1 font-medium flex items-center gap-1.5"><AlertCircle size={14} /> {errors.link}</p>}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="link2" className={labelStyles}>Secondary Image (Optional)</label>
            <input
              id="link2"
              name="link2"
              defaultValue={state.values?.link2 || initialData?.image2}
              className={inputStyles}
              placeholder="Second screenshot/preview"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="link3" className={labelStyles}>Tertiary Image (Optional)</label>
            <input
              id="link3"
              name="link3"
              defaultValue={state.values?.link3 || initialData?.image3}
              className={inputStyles}
              placeholder="Third screenshot/preview"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelStyles}>Tech Stack</label>
        <TechStackInput value={techStack} onChange={setTechStack} />
        {errors.techStack && <p className="text-red-500 mt-2 text-sm ml-1 font-medium flex items-center gap-1.5"><AlertCircle size={14} /> {String(errors.techStack)}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="pitch" className={labelStyles}>Pitch</label>
        <textarea
          id="pitch"
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          className={`${inputStyles} min-h-[200px] ${errors.pitch ? "border-red-300 ring-2 ring-red-500/10" : ""}`}
          required
          placeholder="Why is your project special?"
        />
        {errors.pitch && <p className="text-red-500 mt-2 text-sm ml-1 font-medium flex items-center gap-1.5"><AlertCircle size={14} /> {errors.pitch}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-slate-900 text-white rounded-2xl p-6 min-h-[72px] font-bold text-[18px] cursor-pointer hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2 disabled:bg-slate-400"
        disabled={isPending}
      >
        {isPending ? (isEditing ? "Saving..." : "Submitting...") : (isEditing ? "Save Changes" : "Launch Project")}
        {isEditing ? <Save size={22} /> : <Send size={22} />}
      </button>

      {state.status === "ERROR" && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300 flex items-start gap-3">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}
    </form>
  );
};

export default ProjectForm;
