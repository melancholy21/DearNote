import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, Link } from 'react-router';
import api from "../lib/axios";
import {
  ArrowLeftIcon, LoaderIcon, Trash2Icon, SaveIcon,
  HomeIcon, FileTextIcon, TypeIcon, CalendarIcon, PenLineIcon, HashIcon, XIcon
} from 'lucide-react';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { formatDate } from '../lib/utils';
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

  const navigate = useNavigate();
  const { id } = useParams();
  
  useEffect(() => {
    const fetchNote = async() => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
        setTags(res.data.tags || []);
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
      await api.put(`/notes/${id}`, { title, content, tags });
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to update note");
      console.log("Error in saving the note:", error);
    } finally {
      setSaving(false);
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
          <button
            onClick={() => setShowDeleteModal(true)}
            className='btn btn-ghost btn-sm text-error/60 hover:text-error hover:bg-error/10 gap-2 rounded-xl'
          >
            <Trash2Icon className='size-4' />
            <span className="hidden sm:inline">Delete</span>
          </button>
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
                <Link to="/" className="btn btn-ghost rounded-xl">
                  Cancel
                </Link>
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
