type DeleteModalProps = {
  open: boolean;
  chatName: string;
  onClose: () => void;
  onDelete: () => void;
};

export default function DeleteModal({
  open,
  chatName,
  onClose,
  onDelete,
}: DeleteModalProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[999]
        bg-black/70
        backdrop-blur-sm
        flex
        items-center
        justify-center
      "
    >
      <div
        className="
          w-[420px]
          rounded-3xl
          bg-white
          dark:bg-zinc-900
          border
          border-zinc-300
          dark:border-red-500/30
          p-6
          shadow-[0_0_40px_rgba(239,68,68,0.25)]
        "
      >
        <h2
          className="
            text-black
            dark:text-white
            text-xl
            font-semibold
          "
        >
          Delete Chat
        </h2>

        <p
          className="
            text-zinc-600
            dark:text-zinc-400
            mt-3
          "
        >
          Are you sure you want to delete
          <span
            className="
              text-black
              dark:text-white
              font-medium
            "
          >
            {" "}
            "{chatName}"
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="
              px-5
              py-2
              rounded-xl
              bg-gray-200
              dark:bg-zinc-700
              text-black
              dark:text-white
              hover:bg-gray-300
              dark:hover:bg-zinc-600
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="
              px-5
              py-2
              rounded-xl
              bg-red-600
              hover:bg-red-700
              text-white
              transition
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}