import { SearchIcon, ArchiveIcon, BookOpenIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

const SearchAndFilters = ({
  search,
  setSearch,
  selectedTag,
  setSelectedTag,
  showArchived,
  setShowArchived,
  availableTags,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(localSearch);
    }, 300); // 300ms debounce
    return () => clearTimeout(handler);
  }, [localSearch, setSearch]);

  return (
    <div className="glass-card rounded-2xl p-5 mb-8 flex flex-col gap-4">
      {/* Search and Tabs Row */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <SearchIcon className="size-4 text-base-content/30 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes by title or content..."
            className="glass-input input input-bordered w-full pl-11 rounded-xl text-sm h-11"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-base-content/60"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>

        {/* View Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowArchived(false)}
            className={`rounded-xl px-4 h-11 flex items-center justify-center gap-2 text-sm transition-all border ${
              !showArchived
                ? "bg-primary/15 text-primary border-primary/25 font-semibold shadow-md shadow-primary/5"
                : "bg-transparent text-base-content/40 border-base-content/10 font-medium hover:bg-base-content/5 hover:text-base-content/60"
            }`}
          >
            <BookOpenIcon className="size-4" />
            Active
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={`rounded-xl px-4 h-11 flex items-center justify-center gap-2 text-sm transition-all border ${
              showArchived
                ? "bg-primary/15 text-primary border-primary/25 font-semibold shadow-md shadow-primary/5"
                : "bg-transparent text-base-content/40 border-base-content/10 font-medium hover:bg-base-content/5 hover:text-base-content/60"
            }`}
          >
            <ArchiveIcon className="size-4" />
            Archived
          </button>
        </div>
      </div>

      {/* Type and Status Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-start pt-3 border-t border-base-content/5 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-base-content/30 font-medium">Type:</span>
          <div className="flex gap-1.5">
            {[
              { id: "all", label: "All" },
              { id: "notes", label: "Notes Only" },
              { id: "todos", label: "To-Dos" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedType(t.id);
                  if (t.id === "notes") {
                    setSelectedStatus("all");
                  }
                }}
                className={`px-3 py-1.5 rounded-full transition-all border ${
                  selectedType === t.id
                    ? "bg-primary/10 text-primary border-primary/20 font-semibold"
                    : "bg-base-content/5 text-base-content/50 border-transparent hover:bg-base-content/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {selectedType !== "notes" && (
          <div className="flex items-center gap-2">
            <span className="text-base-content/30 font-medium sm:ml-4">Status:</span>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { id: "all", label: "All Tasks" },
                { id: "todo", label: "To Do" },
                { id: "inprogress", label: "In Progress" },
                { id: "completed", label: "Completed" }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id)}
                  className={`px-3 py-1.5 rounded-full transition-all border ${
                    selectedStatus === s.id
                      ? "bg-primary/10 text-primary border-primary/20 font-semibold"
                      : "bg-base-content/5 text-base-content/50 border-transparent hover:bg-base-content/10"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tags Row */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-base-content/5 text-xs">
          <span className="text-base-content/30 mr-1 font-medium">Tags:</span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-full transition-all border ${
              !selectedTag
                ? "bg-primary/10 text-primary border-primary/20 font-semibold"
                : "bg-base-content/5 text-base-content/50 border-transparent hover:bg-base-content/10"
            }`}
          >
            All
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1.5 rounded-full transition-all border ${
                selectedTag === tag
                  ? "bg-primary/10 text-primary border-primary/20 font-semibold"
                  : "bg-base-content/5 text-base-content/50 border-transparent hover:bg-base-content/10"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
