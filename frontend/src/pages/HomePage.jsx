import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import toast from 'react-hot-toast';
import NoteCard from '../components/NoteCard';
import api from '../lib/axios';
import NotesNotFound from '../components/NotesNotFound';
import SearchAndFilters from '../components/SearchAndFilters';
import { FileTextIcon } from 'lucide-react';

const SkeletonCard = ({ index }) => (
  <div
    className={`glass-card rounded-2xl overflow-hidden animate-fade-in-up stagger-${(index % 9) + 1}`}
  >
    <div className="h-1 skeleton-shimmer" />
    <div className="p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="h-4 skeleton-shimmer w-3/4 rounded" />
        <div className="h-4 w-10 skeleton-shimmer rounded-full flex-shrink-0" />
      </div>
      <div className="space-y-2.5">
        <div className="h-3 skeleton-shimmer w-full rounded" />
        <div className="h-3 skeleton-shimmer w-5/6 rounded" />
        <div className="h-3 skeleton-shimmer w-2/3 rounded" />
      </div>
      <div className="border-t border-base-content/5 pt-3 mt-1">
        <div className="h-3 skeleton-shimmer w-28 rounded" />
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // 1. Fetch available tags globally for user
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get("/notes");
        const tags = new Set();
        res.data.forEach(note => {
          if (note.tags) note.tags.forEach(t => tags.add(t.toLowerCase()));
        });
        setAvailableTags(Array.from(tags));
      } catch (err) {
        console.error("Error compilation of tags", err);
      }
    };
    fetchTags();
  }, [notes]); // Update tag lists dynamically if notes delete/archive

  // 2. Fetch filtered notes list
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      
      let statusParam = undefined;
      if (selectedType === "notes") {
        statusParam = "notes-only";
      } else if (selectedType === "todos") {
        if (selectedStatus === "all") {
          statusParam = "todo-all";
        } else {
          statusParam = selectedStatus;
        }
      } else {
        if (selectedStatus !== "all") {
          statusParam = selectedStatus;
        }
      }

      try {
        const res = await api.get("/notes", {
          params: {
            search,
            tag: selectedTag || undefined,
            archived: showArchived,
            status: statusParam
          }
        });
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes");
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [search, selectedTag, showArchived, selectedType, selectedStatus]);

  return (
    <div className="min-h-screen">
      <Navbar noteCount={notes.filter(n => !n.isArchived).length} />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Search and Filters panel */}
        {!isRateLimited && (
          <SearchAndFilters
            search={search}
            setSearch={setSearch}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            showArchived={showArchived}
            setShowArchived={setShowArchived}
            availableTags={availableTags}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        )}

        {/* Header / Stats */}
        {!loading && notes.length > 0 && !isRateLimited && (
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <div className="flex items-center gap-2 text-base-content/30">
              <FileTextIcon className="size-4" />
              <span className="text-sm font-medium">
                {notes.length} {notes.length === 1 ? "note" : "notes"} {showArchived ? "archived" : ""}
              </span>
            </div>
            <div className="accent-bar flex-1 opacity-30" />
          </div>
        )}

        {/* Empty state */}
        {!loading && notes.length === 0 && !isRateLimited && (
          <NotesNotFound
            search={search}
            selectedTag={selectedTag}
            showArchived={showArchived}
            onClearFilters={() => {
              setSearch("");
              setSelectedTag(null);
              setSelectedType("all");
              setSelectedStatus("all");
            }}
            onGoToActive={() => setShowArchived(false)}
          />
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        )}

        {/* Notes grid */}
        {!loading && notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map((note, index) => (
              <NoteCard
                key={note._id}
                note={note}
                setNotes={setNotes}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
