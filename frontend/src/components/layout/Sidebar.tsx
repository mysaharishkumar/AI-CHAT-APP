import { useEffect, useState, useCallback } from "react";
import RenameModal from "../modals/RenameModal";
import DeleteModal from "../modals/DeleteModal";

import {
  Pencil,
  Share2,
  Trash2,
  MoreHorizontal,
  PenSquare,
  Search,
} from "lucide-react";

import ProfileMenu from "./ProfileMenu";

import {
  getThreads,
  createThread,
  deleteThread,
} from "../../services/thread";

import type {
  Thread,
} from "../../services/thread";

type SidebarProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const [search, setSearch] =
    useState<string>("");

  const [threads, setThreads] =
    useState<Thread[]>([]);

  const [menuOpen, setMenuOpen] =
    useState<string | null>(null);

  const [activeThreadId, setActiveThreadId] =
    useState<string>(
      localStorage.getItem(
        "thread_id"
      ) || ""
    );

    const [renameOpen, setRenameOpen] =
  useState(false);

const [renameValue, setRenameValue] =
  useState("");

const [selectedThread, setSelectedThread] =
  useState<Thread | null>(null);

  const [deleteOpen, setDeleteOpen] =
  useState(false);

const [threadToDelete, setThreadToDelete] =
  useState<Thread | null>(null);

  const loadThreads =
    useCallback(async (): Promise<void> => {
      try {
        const userId =
          localStorage.getItem(
            "user_id"
          ) || "";

        if (!userId) {
          setThreads([]);
          return;
        }

        const data =
          await getThreads(
            userId
          );

        setThreads([...data].reverse());
      } catch (error) {
        console.error(error);
      }
    }, []);

  useEffect(() => {
    void loadThreads();

    const handleThreadsUpdated =
      () => {
        void loadThreads();
      };

    window.addEventListener(
      "threadsUpdated",
      handleThreadsUpdated
    );

    return () => {
      window.removeEventListener(
        "threadsUpdated",
        handleThreadsUpdated
      );
    };
  }, [loadThreads]);

  const closeOnMobile = (): void => {
    if (
      onClose &&
      window.innerWidth < 768
    ) {
      onClose();
    }
  };

  const handleNewChat =
  async (): Promise<void> => {

    const userId =
      localStorage.getItem(
        "user_id"
      ) || "";

    if (!userId) {

      // Guest: start/reset a temporary, unsaved chat.
      // Nothing is stored — refreshing the page clears it.
      window.dispatchEvent(
        new Event(
          "guestNewChat"
        )
      );

      closeOnMobile();

      return;

    }

    // Don't create another blank chat if one already exists and is unused.
    const existingEmpty =
      threads.find(
        (thread) => thread.empty
      );

    if (existingEmpty) {

      localStorage.setItem(
        "thread_id",
        existingEmpty.id
      );

      setActiveThreadId(
        existingEmpty.id
      );

      window.dispatchEvent(
        new Event(
          "threadChanged"
        )
      );

      closeOnMobile();

      return;

    }

    try {

      const thread =
        await createThread(
          userId
        );

      setThreads(
        (prev) => [
          thread,
          ...prev,
        ]
      );

      localStorage.setItem(
        "thread_id",
        thread.id
      );

      setActiveThreadId(
        thread.id
      );

      window.dispatchEvent(
        new Event(
          "threadChanged"
        )
      );

      closeOnMobile();

    } catch (error) {

      console.error(
        error
      );

    }

  };


  const saveRename = (): void => {

  if (
    !selectedThread ||
    !renameValue.trim()
  ) {
    return;
  }

  setThreads((prev) =>
    prev.map((thread) =>
      thread.id === selectedThread.id
        ? {
            ...thread,
            title: renameValue,
          }
        : thread
    )
  );

  setRenameOpen(false);
  setMenuOpen(null);
};

const confirmDelete =
  async (): Promise<void> => {

    if (!threadToDelete) return;

    try {

      await deleteThread(
        threadToDelete.id
      );

      const updatedThreads =
        threads.filter(
          (thread) =>
            thread.id !==
            threadToDelete.id
        );

      setThreads(updatedThreads);

      if (
        activeThreadId ===
        threadToDelete.id
      ) {

        // Always drop back to the empty landing state
        // rather than silently jumping into another chat.
        localStorage.removeItem(
          "thread_id"
        );

        setActiveThreadId("");

        window.dispatchEvent(
          new Event(
            "threadChanged"
          )
        );

      }

      setDeleteOpen(false);

      setThreadToDelete(null);

    } catch (error) {

      console.error(error);

    }

  };

  const handleShare =
    (
      thread: Thread
    ): void => {

      const shareUrl =
        `${window.location.origin}/share/${thread.id}`;

      navigator.clipboard.writeText(
        shareUrl
      );

      alert(
        "Share link copied — anyone with this link can view this chat."
      );

    };

  const filteredThreads =
    threads.filter(
      (thread) =>
        thread.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <>
      {isOpen && (
        <div
          className="
            fixed inset-0
            bg-black/50
            z-40
            md:hidden
          "
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed md:static
          inset-y-0 left-0
          z-50 md:z-auto
          h-screen
          w-72
          ${
            isOpen
              ? "translate-x-0 md:w-72"
              : "-translate-x-full md:translate-x-0 md:w-0"
          }
          overflow-hidden
          transition-all
          duration-300
          bg-white dark:bg-zinc-950
          border-r
          border-zinc-300 dark:border-zinc-800
          flex
          flex-col
        `}
      >
      <div className="p-4 border-b border-zinc-300 dark:border-zinc-800">
        <ProfileMenu />
      </div>

      <div className="p-3 space-y-2">
        <button
          onClick={
            handleNewChat
          }
          className="
            w-full
            flex
            items-center
            gap-3
            text-left
            text-black
dark:text-white
bg-gray-200
dark:bg-zinc-900
hover:bg-gray-300
dark:hover:bg-zinc-800
            p-3
            rounded-xl
            transition
          "
        >
          <PenSquare size={18} />
          New Chat
        </button>

        <div className="relative">
          <Search
  size={16}
  className="
    absolute
    left-3
    top-1/2
    -translate-y-1/2
    text-zinc-400
    dark:text-zinc-500
  "
/>

          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
  w-full
  bg-white
  dark:bg-zinc-900
  border
  border-zinc-300
  dark:border-zinc-800
  rounded-xl
  py-3
  pl-10
  pr-3
  text-black
  dark:text-white
  outline-none
  placeholder:text-zinc-400
  dark:placeholder:text-zinc-500
"
          />
        </div>
      </div>

      <div
  className="
    flex-1
    overflow-y-auto
    px-2
    pt-2
    sidebar-scroll
  "
>
        <h3
          className="
  text-zinc-600
  dark:text-zinc-500
  text-xs
  px-2
  py-2
  uppercase
  tracking-wider
"
        >
          Recent Chats
        </h3>

        {filteredThreads.map(
          (thread) => (
            <div
              key={thread.id}
              className={`
                relative
                flex
                items-center
                justify-between
                px-3
                py-2.5
                rounded-lg
                text-black
dark:text-white
                cursor-pointer
                mb-1
                transition-all
                ${
                  activeThreadId ===
                  thread.id
                    ? "bg-gray-300 dark:bg-zinc-800"
: "hover:bg-gray-200 dark:hover:bg-zinc-900"
                }
              `}
              onClick={() => {

  localStorage.setItem(
    "thread_id",
    thread.id
  );

  setActiveThreadId(
    thread.id
  );

  window.dispatchEvent(
    new Event(
      "threadChanged"
    )
  );

  closeOnMobile();

}}
            >
              <span
  className="
    truncate
    text-sm
    flex-1
    text-black
    dark:text-white
  "
>
                {thread.title}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  setMenuOpen(
                    menuOpen ===
                      thread.id
                      ? null
                      : thread.id
                  );
                }}
                className="
  p-1
  rounded-md
  text-zinc-500
  dark:text-zinc-400
  hover:text-black
  dark:hover:text-white
  hover:bg-gray-300
  dark:hover:bg-zinc-700
"
              >
                <MoreHorizontal
                  size={18}
                />
              </button>

              {menuOpen ===
                thread.id && (
                <div
                  className="
  absolute
  right-0
  top-10
  w-52
  bg-white
  dark:bg-zinc-900
  border
  border-zinc-300
  dark:border-zinc-700
  rounded-2xl
  shadow-xl
  overflow-hidden
  z-50
"
                >
                  <button
  onClick={() => {
    setSelectedThread(thread);
    setRenameValue(thread.title);
    setRenameOpen(true);
    setMenuOpen(null);
  }}
  className="
    flex
    items-center
    gap-3
    w-full
    px-4
    py-3
    text-left
    text-black
    dark:text-white
    hover:bg-gray-200
    dark:hover:bg-zinc-800
"
>
  <Pencil size={18} />
  Rename
</button>

                  <button
                    onClick={() =>
                      handleShare(
                        thread
                      )
                    }
                    className="
  flex
  items-center
  gap-3
  w-full
  px-4
  py-3
  text-left
  text-black
  dark:text-white
  hover:bg-gray-200
  dark:hover:bg-zinc-800
"
                  >
                    <Share2
                      size={18}
                    />
                    Share
                  </button>

                  <div className="border-t border-zinc-700" />

                  <button
                    onClick={() => {
  setThreadToDelete(thread);
  setDeleteOpen(true);
  setMenuOpen(null);
}}
                    className="
  flex
  items-center
  gap-3
  w-full
  px-4
  py-3
  text-left
  text-red-500
  dark:text-red-400
  hover:bg-gray-200
  dark:hover:bg-zinc-800
"
                  >
                    <Trash2
                      size={18}
                    />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )
        )}
            </div>

      <RenameModal
        open={renameOpen}
        value={renameValue}
        setValue={setRenameValue}
        onClose={() =>
          setRenameOpen(false)
        }
        onSave={saveRename}
      />
      <DeleteModal
  open={deleteOpen}
  chatName={
    threadToDelete?.title || ""
  }
  onClose={() =>
    setDeleteOpen(false)
  }
  onDelete={confirmDelete}
/>
      </div>
    </>
  );
}