// components/SearchFormReset.tsx
"use client"

import { X } from "lucide-react";
import Link from "next/link";

const SearchFormReset = () => {
    const reset = () => {
        const form = document.querySelector(".search-form") as HTMLFormElement;
        if (form) form.reset();
    };

    return (
        <button type="reset" onClick={reset} className="cursor-pointer">
            <Link href="/" className="search-btn text-white flex items-center justify-center hover:bg-black/80 transition-colors">
                <X size={24} />
            </Link>
        </button>
    );
};

export default SearchFormReset;