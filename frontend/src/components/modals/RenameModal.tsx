type RenameModalProps = {
  open: boolean;
  value: string;
  setValue: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function RenameModal({
  open,
  value,
  setValue,
  onClose,
  onSave,
}: RenameModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="
  w-[420px]
  rounded-3xl
  bg-white
  dark:bg-zinc-900
  border
  border-zinc-300
  dark:border-cyan-500/30
  p-6
">
        <h2 className="
  text-black
  dark:text-white
  text-xl
  font-semibold
">
          Rename Chat
        </h2>

        <input
          value={value}
          onChange={(e) =>
            setValue(e.target.value)
          }
          className="
w-full
h-12
px-4
rounded-xl
bg-gray-100
dark:bg-zinc-800
border
border-zinc-300
dark:border-zinc-700
text-black
dark:text-white
outline-none
"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="
              px-5 py-2
              rounded-xl
              bg-gray-200
dark:bg-zinc-700
text-black
dark:text-white
            "
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="
              px-5 py-2
              rounded-xl
              bg-gradient-to-r
              from-cyan-500
              to-fuchsia-500
              text-white
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}