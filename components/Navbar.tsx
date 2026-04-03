// components/Navbar.tsx
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { LogOut, PlusSquare } from "lucide-react";
import { Suspense } from "react";

const UserMenu = async () => {
  const session = await auth();

  return (
    <div className="flex items-center gap-6">
      {session && session?.user ? (
        <>
          <Link
            href="/project/create"
            className="flex items-center gap-2 text-[15px] font-medium text-black/60 hover:text-black transition-colors cursor-pointer"
          >
            <PlusSquare size={20} />
            <span className="max-sm:hidden">Create</span>
          </Link>

          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 text-[15px] font-medium text-black/60 hover:text-red-500 transition-colors cursor-pointer"
            >
              <LogOut size={20} />
              <span className="max-sm:hidden">Logout</span>
            </button>
          </form>

          <Link
            href={`/user/${session?.user?.id}`}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="size-8 rounded-full bg-secondary flex justify-center items-center overflow-hidden border border-secondary shadow-sm">
              {session?.user?.image ? (
                <img src={session.user.image} alt="profile" className="object-cover size-full" />
              ) : (
                <span className="text-xs font-bold">{session?.user?.name?.charAt(0)}</span>
              )}
            </div>
            <span className="text-[15px] font-semibold text-black max-sm:hidden">
              {session?.user?.name}
            </span>
          </Link>
        </>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-full text-[15px] font-bold hover:opacity-90 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-2"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.64 12.27c0-.85-.07-1.66-.21-2.45H12v4.63h6.52a5.57 5.57 0 0 1-2.42 3.65v3.04h3.91c2.28-2.1 3.63-5.2 3.63-8.87z"
                fill="#4285F4"
              />
              <path
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.91-3.04c-1.08.73-2.48 1.16-4.02 1.16-3.09 0-5.71-2.09-6.64-4.89H1.32v3.13A12.01 12.01 0 0 0 12 24z"
                fill="#34A853"
              />
              <path
                d="M5.36 14.32c-.24-.73-.38-1.5-.38-2.32s.14-1.59.38-2.32V6.55H1.32a11.98 11.98 0 0 0 0 10.9l4.04-3.13z"
                fill="#FBBC05"
              />
              <path
                d="M12 4.75c1.76 0 3.35.61 4.59 1.79l3.44-3.44A11.93 11.93 0 0 0 12 0 12.01 12.01 0 0 0 1.32 6.55l4.04 3.13c.93-2.8 3.55-4.93 6.64-4.93z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>

        </form>
      )}
    </div>
  );
};

const Navbar = () => {
  return (
    <header className="px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-secondary">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group transition-all">
          <div className="size-11 rounded-2xl flex justify-center items-center overflow-hidden shadow-lg group-hover:scale-105 transition-all duration-500">
            <img src="/icon.webp" alt="AIFox" className="object-contain size-full rounded" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-slate-900 group-hover:text-indigo-600 transition-colors">AIFox</span>
        </Link>


        <Suspense fallback={<div className="h-10 w-24 bg-secondary animate-pulse rounded-full" />}>
          <UserMenu />
        </Suspense>
      </nav>
    </header>
  );
};

export default Navbar;