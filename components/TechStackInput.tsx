// components/TechStackInput.tsx
"use client";

import React, { useState } from "react";
import { X, Plus } from "lucide-react";

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

const TechStackInput = ({ value, onChange }: Props) => {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim() && !value.includes(input.trim())) {
      onChange([...value, input.trim()]);
      setInput("");
    }
  };

  const handleRemove = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a technology (e.g. Next.js, OpenAI)"
          className="w-full bg-white border border-slate-200 px-6 py-4 text-[16px] text-slate-900 font-medium rounded-2xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-slate-900 text-white px-8 rounded-2xl font-bold cursor-pointer hover:bg-indigo-600 transition-all shadow-md min-h-[64px]"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold border border-primary/20 group"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              className="text-primary/40 hover:text-primary transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        {value.length === 0 && (
          <p className="text-black-300 text-sm font-medium ml-1">No technologies added yet.</p>
        )}
      </div>
    </div>
  );
};

export default TechStackInput;
