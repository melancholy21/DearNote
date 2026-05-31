import { AlertTriangleIcon } from "lucide-react";

const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel, noteTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="glass-card rounded-2xl p-8 max-w-sm w-full relative z-10 animate-scale-in border border-error/10">
        <div className="flex flex-col items-center text-center gap-5">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center">
            <AlertTriangleIcon className="size-8 text-error" />
          </div>

          {/* Text */}
          <div>
            <h3 className="font-bold text-xl mb-2">Delete this note?</h3>
            <p className="text-base-content/50 text-sm leading-relaxed">
              {noteTitle && (
                <>
                  <span className="font-medium text-base-content/70">"{noteTitle}"</span>
                  {" will be "}
                </>
              )}
              permanently deleted. This can't be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full">
            <button
              className="btn btn-ghost flex-1 rounded-xl"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-error flex-1 rounded-xl"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
