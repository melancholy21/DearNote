import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeftIcon, SaveIcon, TypeIcon, FileTextIcon, SparklesIcon, HashIcon, XIcon } from 'lucide-react';
import toast from "react-hot-toast";
import api from '../lib/axios';
import { marked } from "marked";
import DOMPurify from "dompurify";
import ThemeToggle from '../components/ThemeToggle';

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const [loading, setLoading] = useState(false);
  const [noteType, setNoteType] = useState("note"); // "note" or "todo"
  const [todoStatus, setTodoStatus] = useState("todo"); // "todo", "inprogress", "completed"

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const status = noteType === "note" ? "none" : todoStatus;
      await api.post("/notes", { title, content, tags, status });
      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("You're creating notes too fast!", {
          duration: 4000,
          icon: "🥵",
        });
      } else {
        toast.error("Failed to create a note");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const getMarkdownHtml = (text) => {
    const rawHtml = marked.parse(text || "");
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return { __html: cleanHtml };
  };

  const isReady = title.trim() && content.trim();

  return (
    <div className='min-h-screen'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in-up'>
        {/* Back */}
        <Link to="/" className='inline-flex items-center gap-2 text-sm text-base-content/40 hover:text-base-content/70 transition-colors mb-8'>
          <ArrowLeftIcon className='size-4'/>
          Back to Notes
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <SparklesIcon className="size-5 text-primary" />
            </div>
            <div>
              <h1 className='text-2xl font-extrabold gradient-text'>Create New Note</h1>
              <p className="text-sm text-base-content/30 mt-0.5">Capture your thoughts</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Form card */}
        <div className='glass-card rounded-2xl overflow-hidden'>
          <div className="accent-bar" />
          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-6 sm:p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center justify-between mb-2">
                <span className='text-sm font-medium text-base-content/60 flex items-center gap-1.5'>
                  <TypeIcon className="size-3.5" />
                  Title
                </span>
                <span className={`text-xs transition-colors ${title.length > 0 ? 'text-primary/60' : 'text-base-content/20'}`}>
                  {title.length} chars
                </span>
              </label>
              <input
                type="text"
                placeholder='Give your note a title...'
                className='glass-input input input-bordered w-full rounded-xl'
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
                <span className='text-sm font-medium text-base-content/60 flex items-center gap-1.5'>
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
                <span className='text-sm font-medium text-base-content/60 flex items-center gap-1.5'>
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
                  placeholder='Write your thoughts here (supports Markdown)...'
                  className='glass-input textarea textarea-bordered w-full h-44 rounded-xl leading-relaxed resize-none'
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
                  type='submit'
                  className={`btn btn-primary gap-2 rounded-xl btn-glow shadow-lg shadow-primary/20 ${
                    !isReady ? 'btn-disabled opacity-50' : ''
                  }`}
                  disabled={loading || !isReady}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="size-4" />
                      Create Note
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
