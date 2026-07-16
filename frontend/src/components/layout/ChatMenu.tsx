type Props = {
  onPin: () => void
  onRename: () => void
  onShare: () => void
  onArchive: () => void
  onDelete: () => void
}

export default function ChatMenu({
  onPin,
  onRename,
  onShare,
  onArchive,
  onDelete,
}: Props) {

  return (
    <div className="absolute right-0 top-10 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50">

      <button
        onClick={onPin}
        className="w-full text-left px-4 py-3 text-white hover:bg-zinc-800"
      >
        📌 Pin Chat
      </button>

      <button
        onClick={onRename}
        className="w-full text-left px-4 py-3 text-white hover:bg-zinc-800"
      >
        ✏ Rename Chat
      </button>

      <button
        onClick={onShare}
        className="w-full text-left px-4 py-3 text-white hover:bg-zinc-800"
      >
        📤 Share Chat
      </button>

      <button
        onClick={onArchive}
        className="w-full text-left px-4 py-3 text-white hover:bg-zinc-800"
      >
        🗄 Archive Chat
      </button>

      <button
        onClick={onDelete}
        className="w-full text-left px-4 py-3 text-red-400 hover:bg-zinc-800"
      >
        🗑 Delete Chat
      </button>

    </div>
  )
}