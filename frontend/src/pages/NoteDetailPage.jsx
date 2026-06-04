import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, Link } from 'react-router';
import api from "../lib/axios";
import {
  ArrowLeftIcon, LoaderIcon, Trash2Icon, SaveIcon,
  HomeIcon, FileTextIcon, TypeIcon, CalendarIcon, PenLineIcon, HashIcon, XIcon, ArrowRightIcon
} from 'lucide-react';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { formatDate } from '../lib/utils';
import ThemeToggle from '../components/ThemeToggle';

const paginateContent = (text, limit = 1200) => {
  if (!text) return [""];
  const paragraphs = text.split(/\n\n+/);
  const pages = [];
  let currentPage = "";

  for (const para of paragraphs) {
    if ((currentPage + para).length > limit && currentPage.trim() !== "") {
      pages.push(currentPage.trim());
      currentPage = para;
    } else {
      currentPage = currentPage ? currentPage + "\n\n" + para : para;
    }
  }
  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }
  return pages.length > 0 ? pages : [""];
};
import { marked } from "marked";
import DOMPurify from "dompurify";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [noteType, setNoteType] = useState("note"); // "note" or "todo"
  const [todoStatus, setTodoStatus] = useState("todo"); // "todo", "inprogress", "completed"
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const navigate = useNavigate();
  const { id } = useParams();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchNote = async() => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
        setTags(res.data.tags || []);
        
        // Initialize status values
        const hasStatus = res.data.status && res.data.status !== "none";
        setNoteType(hasStatus ? "todo" : "note");
        setTodoStatus(hasStatus ? res.data.status : "todo");
        setCurrentPageIndex(0);
      } catch (error) {
        console.log("Error in fetching notes");
        toast.error("Failed to fetch the note");
      } finally {
        setLoading(false);
      }
    }
    fetchNote()
  }, [id]);

  const handleDelete = async() => {
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete note");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleSave = async() => {
    if(!title.trim() || !content.trim()){
      toast.error("Please add a title and content");
      return;
    }

    setSaving(true);

    try {
      const status = noteType === "note" ? "none" : todoStatus;
      await api.put(`/notes/${id}`, { title, content, tags, status });
      toast.success("Note updated successfully");
      // Refresh the note details in place and switch back to notebook view
      const res = await api.get(`/notes/${id}`);
      setNote(res.data);
      setTitle(res.data.title);
      setContent(res.data.content);
      setTags(res.data.tags || []);
      setCurrentPageIndex(0);
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update note");
      console.log("Error in saving the note:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!note) return;
    
    let nextStatus = "todo";
    if (note.status === "todo") nextStatus = "inprogress";
    else if (note.status === "inprogress") nextStatus = "completed";
    else if (note.status === "completed") nextStatus = "todo";
    
    try {
      const res = await api.put(`/notes/${id}`, {
        title: note.title,
        content: note.content,
        tags: note.tags,
        status: nextStatus
      });
      setNote(res.data);
      setTodoStatus(nextStatus);
      toast.success(`Status updated to ${nextStatus === "inprogress" ? "In Progress" : nextStatus === "todo" ? "To Do" : "Completed"}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSave();
    }
  };

  const getMarkdownHtml = (text) => {
    const rawHtml = marked.parse(text || "");
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return { __html: cleanHtml };
  };

  if (loading) {
    return(
      <div className='min-h-screen flex items-center justify-center'>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <LoaderIcon className='animate-spin size-8 text-primary' />
            <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full" />
          </div>
          <span className="text-base-content/30 text-sm font-medium">Loading note...</span>
        </div>
      </div>
    )
  }

  if (!isEditing) {
    return (
      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in-up">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between text-sm text-base-content/40 mb-8">
            <Link to="/" className="hover:text-base-content/70 transition-colors flex items-center gap-1.5 font-medium">
              <ArrowLeftIcon className="size-4" />
              <span>Back to Notes</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle className="h-9 w-9 p-0 flex items-center justify-center" />
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary btn-sm rounded-xl btn-glow shadow-lg shadow-primary/10 gap-2 h-9 px-4"
              >
                <PenLineIcon className="size-3.5" />
                <span>Edit Note</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn btn-ghost btn-sm text-error/60 hover:text-error hover:bg-error/10 rounded-xl h-9 w-9 p-0 flex items-center justify-center"
                title="Delete note"
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          </div>

          {/* Notebook Sheet Page */}
          <div className="notebook-sheet relative">
            {/* Note details layout on page */}
            <div className="notebook-lines flex flex-col justify-between">
              <div>
                {/* Header inside notebook: Title & Date & Status */}
                <div className="border-b border-base-content/10 pb-4 mb-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl font-extrabold tracking-tight text-base-content leading-tight">
                        {note?.title}
                      </h1>
                    </div>

                    {note?.status && note.status !== "none" && (
                      <div className="flex-shrink-0">
                        <button
                          onClick={handleToggleStatus}
                          className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-all flex items-center gap-1.5 shadow-sm ${
                            note.status === "completed"
                              ? "status-badge-completed"
                              : note.status === "inprogress"
                              ? "status-badge-inprogress"
                              : "status-badge-todo"
                          }`}
                          title="Click to cycle status"
                        >
                          <span className={`w-2 h-2 rounded-full ${
                            note.status === "completed" ? "bg-success" : note.status === "inprogress" ? "bg-warning" : "bg-info"
                          }`} />
                          {note.status === "completed"
                            ? "Completed"
                            : note.status === "inprogress"
                            ? "In Progress"
                            : "To Do"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Tags row inside notebook */}
                  {note?.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold bg-base-content/5 text-base-content/40 px-2.5 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Created / Updated Timestamps */}
                  <div className="text-[11px] text-base-content/30 mt-3 flex items-center gap-3">
                    <span>Created: {formatDate(new Date(note?.createdAt))}</span>
                    {note?.updatedAt !== note?.createdAt && (
                      <span className="text-primary/50">Updated: {formatDate(new Date(note?.updatedAt))}</span>
                    )}
                  </div>
                </div>

                {/* Lined body with rendered markdown */}
                <div 
                  className="notebook-content markdown-preview-body prose max-w-none animate-fade-in"
                  key={currentPageIndex}
                  dangerouslySetInnerHTML={getMarkdownHtml(paginateContent(note?.content)[currentPageIndex])}
                />
              </div>
            </div>
          </div>

          {/* Page Navigation Controls (Placed outside the notebook sheet) */}
          {paginateContent(note?.content).length > 1 && (
            <div className="flex justify-between items-center mt-4 text-xs font-semibold px-2">
              <button
                type="button"
                onClick={() => setCurrentPageIndex((p) => Math.max(0, p - 1))}
                disabled={currentPageIndex === 0}
                className="btn btn-ghost btn-sm rounded-xl gap-1.5 px-3 h-9 text-base-content hover:text-primary disabled:opacity-20 disabled:bg-transparent"
              >
                <ArrowLeftIcon className="size-3.5" />
                <span>Previous</span>
              </button>
              <span className="text-base-content/60">
                Page {currentPageIndex + 1} of {paginateContent(note?.content).length}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPageIndex((p) => Math.min(paginateContent(note?.content).length - 1, p + 1))}
                disabled={currentPageIndex === paginateContent(note?.content).length - 1}
                className="btn btn-ghost btn-sm rounded-xl gap-1.5 px-3 h-9 text-base-content hover:text-primary disabled:opacity-20 disabled:bg-transparent"
              >
                <span>Next</span>
                <ArrowRightIcon className="size-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Delete modal */}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          noteTitle={note?.title}
        />
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in-up'>
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-base-content/30 mb-8">
          <Link to="/" className="hover:text-base-content/60 transition-colors flex items-center gap-1">
            <HomeIcon className="size-3.5" />
            <span>Notes</span>
          </Link>
          <span>/</span>
          <span className="text-base-content/50 truncate max-w-[200px]">{note?.title || "Detail"}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <PenLineIcon className="size-5 text-primary" />
            </div>
            <div>
              <h1 className='text-2xl font-extrabold gradient-text'>Edit Note</h1>
              <p className="text-sm text-base-content/30 mt-0.5">Make your changes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="h-9 w-9 p-0 flex items-center justify-center" />
            <button
              onClick={() => setShowDeleteModal(true)}
              className='btn btn-ghost btn-sm text-error/60 hover:text-error hover:bg-error/10 gap-2 rounded-xl h-9 px-3'
            >
              <Trash2Icon className='size-4' />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Timestamps */}
        {note && (
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="inline-flex items-center gap-1.5 text-xs text-base-content/30 bg-base-content/5 px-3 py-1.5 rounded-full">
              <CalendarIcon className="size-3" />
              Created {formatDate(new Date(note.createdAt))}
            </div>
            {note.updatedAt !== note.createdAt && (
              <div className="inline-flex items-center gap-1.5 text-xs text-primary/50 bg-primary/5 px-3 py-1.5 rounded-full">
                <CalendarIcon className="size-3" />
                Updated {formatDate(new Date(note.updatedAt))}
              </div>
            )}
          </div>
        )}

        {/* Edit card */}
        <div className="glass-card rounded-2xl overflow-hidden" onKeyDown={handleKeyDown}>
          <div className="accent-bar" />
          <div className="p-6 sm:p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-base-content/60 flex items-center gap-1.5">
                  <TypeIcon className="size-3.5" />
                  Title
                </span>
                <span className="text-xs text-primary/50">
                  {title.length} chars
                </span>
              </label>
              <input
                type="text"
                placeholder="Note title"
                className="glass-input input input-bordered w-full rounded-xl"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Note Type & Status Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Type Selection */}
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-base-content/60">
                    Note Type
                  </span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNoteType("note")}
                    className={`flex-1 btn rounded-xl btn-sm h-11 border transition-all ${
                      noteType === "note"
                        ? "btn-primary font-semibold"
                        : "btn-ghost bg-base-content/5 border-transparent text-base-content/50 hover:bg-base-content/10"
                    }`}
                  >
                    Standard Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteType("todo")}
                    className={`flex-1 btn rounded-xl btn-sm h-11 border transition-all ${
                      noteType === "todo"
                        ? "btn-primary font-semibold"
                        : "btn-ghost bg-base-content/5 border-transparent text-base-content/50 hover:bg-base-content/10"
                    }`}
                  >
                    To-Do Item
                  </button>
                </div>
              </div>

              {/* Status Selection (Visible if To-Do is selected) */}
              {noteType === "todo" && (
                <div className="animate-scale-in">
                  <label className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-base-content/60">
                      Task Status
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "todo", label: "To Do" },
                      { id: "inprogress", label: "In Progress" },
                      { id: "completed", label: "Completed" }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setTodoStatus(s.id)}
                        className={`flex-1 btn rounded-xl btn-xs h-11 text-xs border transition-all ${
                          todoStatus === s.id
                            ? s.id === "completed"
                              ? "btn-success text-success-content font-bold"
                              : s.id === "inprogress"
                              ? "btn-warning text-warning-content font-bold"
                              : "btn-info text-info-content font-bold"
                            : "btn-ghost bg-base-content/5 border-transparent text-base-content/50 hover:bg-base-content/10"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tags Input */}
            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-base-content/60 flex items-center gap-1.5">
                  <HashIcon className="size-3.5" />
                  Tags
                </span>
                <span className="text-xs text-base-content/20">Press Enter or Comma to add</span>
              </label>
              
              <div className="glass-input p-2 rounded-xl flex flex-wrap gap-2 items-center min-h-12 border border-base-content/10">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-lg border border-primary/15"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                      className="text-primary hover:text-primary-focus p-0.5 rounded-full"
                    >
                      <XIcon className="size-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={tags.length === 0 ? "Add tags (e.g. work, ideas)..." : ""}
                  className="bg-transparent border-0 outline-none flex-1 min-w-[120px] text-sm text-base-content placeholder-base-content/25 py-1"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const val = tagInput.replace(/,/g, "").trim().toLowerCase();
                      if (val && !tags.includes(val)) {
                        setTags([...tags, val]);
                      }
                      setTagInput("");
                    }
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-base-content/60 flex items-center gap-1.5">
                  <FileTextIcon className="size-3.5" />
                  Content
                </span>
                <div className="tabs tabs-boxed bg-base-content/5 p-0.5 rounded-lg flex gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={`tab tab-xs rounded-md px-3 py-1 text-xs transition-all ${
                      activeTab === "write" ? "tab-active bg-primary/15 text-primary font-semibold" : "text-base-content/40"
                    }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`tab tab-xs rounded-md px-3 py-1 text-xs transition-all ${
                      activeTab === "preview" ? "tab-active bg-primary/15 text-primary font-semibold" : "text-base-content/40"
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {activeTab === "write" ? (
                <textarea
                  placeholder="Write your note here (supports Markdown)..."
                  className="glass-input textarea textarea-bordered w-full h-44 rounded-xl leading-relaxed resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              ) : (
                <div 
                  className="glass-input w-full min-h-[176px] h-auto p-4 rounded-xl text-base-content overflow-y-auto markdown-preview-body border border-base-content/10"
                  dangerouslySetInnerHTML={getMarkdownHtml(content)}
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="hidden sm:flex items-center gap-1 text-base-content/20 text-xs">
                <kbd className="kbd kbd-xs bg-base-content/5 border-base-content/10">Ctrl</kbd>
                <span>+</span>
                <kbd className="kbd kbd-xs bg-base-content/5 border-base-content/10">↵</kbd>
                <span className="ml-1">to save</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost rounded-xl"
                >
                  Cancel
                </button>
                <button
                  className='btn btn-primary gap-2 rounded-xl btn-glow shadow-lg shadow-primary/20'
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="size-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        noteTitle={note?.title}
      />
    </div>
  )
}

export default NoteDetailPage
