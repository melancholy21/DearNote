import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative p-2 rounded-xl border transition-all duration-300 group overflow-hidden
        ${
          theme === "dearnote"
            ? "bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary shadow-lg shadow-primary/5"
            : "bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary shadow-md shadow-primary/5"
        } 
        ${className}`}
      title={theme === "dearnote" ? "Switch to Eye-Care Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      {/* Decorative background glow that slides on hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      
      <div className="relative size-5 flex items-center justify-center">
        {/* Sun Icon (Visible in Dark Mode) */}
        <Sun
          className={`size-5 transition-all duration-500 absolute transform
            ${
              theme === "dearnote"
                ? "rotate-0 scale-100 opacity-100 group-hover:rotate-45"
                : "-rotate-90 scale-50 opacity-0"
            }`}
        />
        {/* Moon Icon (Visible in Light Mode) */}
        <Moon
          className={`size-5 transition-all duration-500 absolute transform
            ${
              theme === "dearnote-light"
                ? "rotate-0 scale-100 opacity-100 group-hover:-rotate-12"
                : "rotate-90 scale-50 opacity-0"
            }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
