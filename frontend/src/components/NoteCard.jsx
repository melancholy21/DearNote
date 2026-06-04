import { Trash2Icon, ClockIcon, Pin, Archive } from "lucide-react";
import { Link } from "react-router";
import { formatDate, getRelativeTime } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { marked } from "marked";
import DOMPurify from "dompurify";

const NoteCard = ({ note, setNotes, index = 0 }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isNew = new Date() - new Date(note.createdAt) < 24 * 60 * 60 * 1000;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/notes/${note._id}`);
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
      toast.success("Note deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete note");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleTogglePin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.patch(`/notes/${note._id}/pin`);
      setNotes((prev) =>
        prev.map((n) => (n._id === note._id ? res.data : n))
      );
      toast.success(res.data.isPinned ? "Note pinned!" : "Note unpinned!");
    } catch (error) {
      toast.error("Failed to update pin state");
    }
  };

  const handleToggleArchive = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.patch(`/notes/${note._id}/archive`);
      // Since it's archived/unarchived, we filter it out of the current view if views don't match
      setNotes((prev) =>
        prev.filter((n) => n._id !== note._id)
      );
      toast.success(res.data.isArchived ? "Note archived!" : "Note unarchived!");
    } catch (error) {
      toast.error("Failed to update archive state");
    }
  };

  const handleToggleStatus = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    let nextStatus = "todo";
    if (note.status === "todo") nextStatus = "inprogress";
    else if (note.status === "inprogress") nextStatus = "completed";
    else if (note.status === "completed") nextStatus = "todo";
    
    try {
      const res = await api.put(`/notes/${note._id}`, {
        title: note.title,
        content: note.content,
        tags: note.tags,
        status: nextStatus
      });
      setNotes((prev) =>
        prev.map((n) => (n._id === note._id ? res.data : n))
      );
      toast.success(`Status updated to ${nextStatus === "inprogress" ? "In Progress" : nextStatus === "todo" ? "To Do" : "Completed"}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleCheckboxToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const nextStatus = note.status === "completed" ? "todo" : "completed";
    
    try {
      const res = await api.put(`/notes/${note._id}`, {
        title: note.title,
        content: note.content,
        tags: note.tags,
        status: nextStatus
      });
      setNotes((prev) =>
        prev.map((n) => (n._id === note._id ? res.data : n))
      );
      toast.success(nextStatus === "completed" ? "Task completed!" : "Task marked as active");
    } catch (error) {
      toast.error("Failed to update task completion");
    }
  };

  const getMarkdownPreview = (text) => {
    const rawHtml = marked.parse(text || "");
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return { __html: cleanHtml };
  };

  return (
    <>
      <Link
        to={`/note/${note._id}`}
        className={`glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between relative
          animate-fade-in-up stagger-${(index % 9) + 1}`}
      >
        <div>
          {/* Gradient accent bar */}
          <div className="accent-bar" />

          <div className="p-5 flex flex-col gap-3">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                {note.status && note.status !== "none" && (
                  <input
                    type="checkbox"
                    checked={note.status === "completed"}
                    onChange={handleCheckboxToggle}
                    onClick={(e) => e.stopPropagation()}
                    className="checkbox checkbox-primary checkbox-sm mt-0.5 rounded-lg flex-shrink-0"
                  />
                )}
                <h3 className={`font-semibold text-[15px] text-base-content line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-300 ${
                  note.status === "completed" ? "line-through text-base-content/30" : ""
                }`}>
                  {note.title}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {note.isPinned && (
                  <span className="text-primary hover:text-primary-focus p-0.5" onClick={handleTogglePin}>
                    <Pin className="size-3.5 fill-primary text-primary" />
                  </span>
                )}
                {isNew && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary animate-glow">
                    New
                  </span>
                )}
              </div>
            </div>

            {/* Tags & Status row */}
            {((note.status && note.status !== "none") || (note.tags && note.tags.length > 0)) && (
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                {note.status && note.status !== "none" && (
                  <button
                    onClick={handleToggleStatus}
                    className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                      note.status === "completed"
                        ? "status-badge-completed"
                        : note.status === "inprogress"
                        ? "status-badge-inprogress"
                        : "status-badge-todo"
                    }`}
                    title="Click to cycle task status"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      note.status === "completed" ? "bg-success" : note.status === "inprogress" ? "bg-warning" : "bg-info"
                    }`} />
                    {note.status === "completed"
                      ? "Completed"
                      : note.status === "inprogress"
                      ? "In Progress"
                      : "To Do"}
                  </button>
                )}
                {note.tags && note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium bg-base-content/5 text-base-content/40 px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content preview */}
            <div 
              className="text-sm text-base-content/35 line-clamp-3 leading-relaxed markdown-preview"
              dangerouslySetInnerHTML={getMarkdownPreview(note.content)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-3 flex items-center justify-between border-t border-base-content/5 mt-auto">
          <div className="flex items-center gap-1.5 text-[11px] text-base-content/25">
            <ClockIcon className="size-3" />
            <span>{formatDate(new Date(note.createdAt))}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              className={`p-1.5 rounded-lg transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 ${
                note.isPinned
                  ? "text-primary hover:bg-primary/10"
                  : "text-base-content/20 hover:text-primary hover:bg-primary/10"
              }`}
              title={note.isPinned ? "Unpin Note" : "Pin Note"}
              onClick={handleTogglePin}
            >
              <Pin className={`size-3.5 ${note.isPinned ? "fill-primary text-primary" : ""}`} />
            </button>
            <button
              className="p-1.5 rounded-lg text-base-content/20 hover:text-secondary hover:bg-secondary/10 transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              title={note.isArchived ? "Unarchive Note" : "Archive Note"}
              onClick={handleToggleArchive}
            >
              <Archive className="size-3.5" />
            </button>
            <button
              className="p-1.5 rounded-lg text-base-content/20 hover:text-error hover:bg-error/10 transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              title="Delete Note"
              onClick={handleDelete}
            >
              <Trash2Icon className="size-3.5" />
            </button>
          </div>
        </div>
      </Link>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={(e) => {
          e?.preventDefault?.();
          e?.stopPropagation?.();
          setShowDeleteModal(false);
        }}
        noteTitle={note.title}
      />
    </>
  );
};

export default NoteCard;