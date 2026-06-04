import { Link } from "react-router";
import { PlusIcon, BookOpenIcon } from "lucide-react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ noteCount }) => {
  return (
    <header className="glass-navbar sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <BookOpenIcon className="size-5 text-primary" />
            </div>
            <span className="text-xl font-extrabold tracking-tight gradient-text">
              DearNote
            </span>
            <SignedIn>
              {noteCount > 0 && (
                <span className="text-[11px] font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                  {noteCount}
                </span>
              )}
            </SignedIn>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <SignedIn>
              <Link
                to="/create"
                className="btn btn-primary btn-sm gap-2 rounded-xl btn-glow shadow-lg shadow-primary/20"
              >
                <PlusIcon className="size-4" />
                <span className="hidden sm:inline">New Note</span>
              </Link>
              <UserButton afterSignOutUrl="/" appearance={{
                elements: {
                  avatarBox: "size-8 rounded-xl border border-primary/20"
                }
              }} />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn btn-primary btn-sm rounded-xl btn-glow shadow-lg shadow-primary/20 px-4">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;