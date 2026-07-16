type Props = {
  open: boolean
  onClose: () => void
}

export default function SettingsModal({
  open,
  onClose,
}: Props) {

  if (!open) return null

  const email =
    localStorage.getItem("email") || ""

  const clearChats = () => {

    localStorage.removeItem("thread_id")

    alert("Chats Cleared")

  }

  const logout = () => {

    localStorage.clear()

    window.location.href = "/"

  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="w-full max-w-lg bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl">

        <div className="flex items-center justify-between p-6 border-b border-zinc-800">

          <h2 className="text-xl font-semibold text-white">
            Settings
          </h2>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-xl"
          >
            ✕
          </button>

        </div>

        <div className="p-6 space-y-6">

          <div>

            <h3 className="text-white font-medium">
              Account
            </h3>

            <p className="text-zinc-400 text-sm mt-1">
              {email}
            </p>

          </div>

          <div>

            <h3 className="text-white font-medium mb-3">
              Appearance
            </h3>

            <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-xl text-left">
              🌙 Dark Theme
            </button>

          </div>

          <div>

            <h3 className="text-white font-medium mb-3">
              Language
            </h3>

            <select className="w-full bg-zinc-800 text-white p-3 rounded-xl outline-none">

              <option>
                English
              </option>

              <option>
                Telugu
              </option>

              <option>
                Hindi
              </option>

            </select>

          </div>

          <div className="space-y-3">

            <button
              onClick={clearChats}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white p-3 rounded-xl"
            >
              Clear Chats
            </button>

            <button
              className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl"
            >
              Export Chats
            </button>

            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-500 text-white p-3 rounded-xl"
            >
              Logout
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}