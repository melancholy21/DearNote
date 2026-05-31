import { NotebookIcon, PlusIcon, SparklesIcon, SearchX, ArchiveX } from "lucide-react";
import { Link } from "react-router";

const NotesNotFound = ({ search, selectedTag, showArchived, onClearFilters, onGoToActive }) => {
  const isFiltering = !!(search || selectedTag);

  // Customize UI elements based on state
  let title = "No notes yet";
  let description = "Your notebook is a blank canvas. Start capturing your thoughts, one note at a time.";
  let IconComponent = NotebookIcon;
  let actionElement = null;

  if (isFiltering) {
    title = "No results found";
    description = "We couldn't find any notes matching your search or tag filters. Try adjusting them.";
    IconComponent = SearchX;
    actionElement = (
      <button
        onClick={onClearFilters}
        className="btn btn-primary btn-md gap-2 rounded-2xl btn-glow shadow-lg shadow-primary/20 px-8"
      >
        Clear Search & Filters
      </button>
    );
  } else if (showArchived) {
    title = "No archived notes";
    description = "Clean up your main dashboard by archiving notes. They'll be stored here safely.";
    IconComponent = ArchiveX;
    actionElement = (
      <button
        onClick={onGoToActive}
        className="btn btn-primary btn-md gap-2 rounded-2xl btn-glow shadow-lg shadow-primary/20 px-8"
      >
        Go to Active Notes
      </button>
    );
  } else {
    actionElement = (
      <Link
        to="/create"
        className="btn btn-primary btn-lg gap-2 rounded-2xl btn-glow shadow-lg shadow-primary/20 px-8"
      >
        <PlusIcon className="size-5" />
        Create Your First Note
      </Link>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[55vh] animate-fade-in">
      <div className="text-center max-w-md px-6">
        {/* Floating illustration */}
        <div className="relative inline-block mb-8">
          <div className="w-28 h-28 rounded-3xl bg-primary/8 flex items-center justify-center animate-float">
            <IconComponent className="size-12 text-primary/50" />
          </div>
          <SparklesIcon className="size-5 text-secondary/60 absolute -top-2 -right-3 animate-glow" />
          <SparklesIcon className="size-3 text-primary/40 absolute -bottom-1 -left-2 animate-glow" style={{ animationDelay: '0.7s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl -z-10 bg-primary/5" />
        </div>

        <h2 className="text-3xl font-extrabold mb-3 gradient-text">
          {title}
        </h2>
        <p className="text-base-content/35 leading-relaxed mb-8 text-[15px]">
          {description}
        </p>

        {actionElement}
      </div>
    </div>
  );
};

export default NotesNotFound;