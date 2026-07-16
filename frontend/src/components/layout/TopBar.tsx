import { useState, useEffect } from "react";
import logoDark from "../../assets/logo.png";
import logoLight from "../../assets/logo-light.png";

import {
  Sun,
  Moon,
  MoreVertical,
  FileText,
  FileDown,
  Share2,
} from "lucide-react";
import { exportChat } from "../../services/export";
import { exportDocx } from "../../services/exportDocx";

type TopBarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export default function TopBar({
  sidebarOpen,
  setSidebarOpen,
}: TopBarProps) {

  const [menuOpen, setMenuOpen] =
    useState(false);


  const [darkMode, setDarkMode] =
  useState(() => {

    const savedTheme =
      localStorage.getItem(
        "theme"
      );

    return savedTheme !== "light";

  });
  
  const currentLogo =
  darkMode
    ? logoDark
    : logoLight;

  useEffect(() => {

  if (darkMode) {

    document.documentElement.classList.add(
      "dark"
    );

    localStorage.setItem(
      "theme",
      "dark"
    );

  } else {

    document.documentElement.classList.remove(
      "dark"
    );

    localStorage.setItem(
      "theme",
      "light"
    );

  }

}, [darkMode]);

  const toggleTheme = () => {

    setDarkMode(
      (prev) => !prev
    );

  };

  const getIds = () => {

    const userId =
      localStorage.getItem(
        "user_id"
      ) || "";

    const threadId =
      localStorage.getItem(
        "thread_id"
      ) || "";

    return {
      userId,
      threadId,
    };

  };

  const handleExportPDF =
    async (): Promise<void> => {

      const {
        userId,
        threadId,
      } = getIds();

      if (
        !userId ||
        !threadId
      ) {

        alert(
          "No chat selected"
        );

        return;

      }

      await exportChat(
        userId,
        threadId
      );

      setMenuOpen(false);

    };

  const handleExportDOCX =
    async (): Promise<void> => {

      const {
        userId,
        threadId,
      } = getIds();

      if (
        !userId ||
        !threadId
      ) {

        alert(
          "No chat selected"
        );

        return;

      }

      await exportDocx(
        userId,
        threadId
      );

      setMenuOpen(false);

    };

  const handleShare =
    async (): Promise<void> => {

      const { threadId } =
        getIds();

      if (!threadId) {
        alert(
          "No chat selected"
        );
        setMenuOpen(false);
        return;
      }

      const url =
        `${window.location.origin}/share/${threadId}`;

      try {

        if (
          navigator.share
        ) {

          await navigator.share({
            title:
              "AI Chat App",
            url,
          });

        } else {

          await navigator.clipboard.writeText(
            url
          );

          alert(
            "Share link copied — anyone with this link can view this chat."
          );

        }

      } catch (error) {

        console.error(
          error
        );

      }

      setMenuOpen(false);

    };

  return (
  <>
    <div
      className="
  h-16
  border-b
  border-zinc-300
  dark:border-zinc-800
  bg-white
  dark:bg-zinc-900
  flex
  items-center
  justify-between
  px-4
"
    >

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <button
  onClick={() =>
    setSidebarOpen(
      !sidebarOpen
    )
  }
  className={`
  w-12
  h-12
  rounded-xl
  overflow-hidden
  flex
  items-center
  justify-center
  transition
  hover:scale-105
  ${
    darkMode
      ? "bg-[#030817] shadow-[0_0_25px_rgba(0,255,255,0.7)]"
      : "bg-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
  }
`}
>
  <img
  src={currentLogo}
  alt="AI Logo"
  className="
    w-8
    h-8
    object-contain
  "
/>
</button>

        <h1
          className="
  text-black
  dark:text-white
  font-semibold
  text-2xl
"
        >
          AI Chat App
        </h1>

      </div>

      <div
        className="
          flex
          items-center
          gap-6
        "
      >

        <span
  className="
    hidden
    md:flex
    items-center
    text-[14px]
    italic
    font-normal
  "
>
  <span className="text-zinc-500 dark:text-zinc-400">
    - Developed by
  </span>

  <span
    className="
  ml-1
  italic
  font-semibold
  text-fuchsia-600
  dark:text-fuchsia-400
  hover:text-fuchsia-500
  cursor-pointer
  transition
"
  >
    Mysa Harish Kumar
  </span>
</span>

        <button
          onClick={toggleTheme}
          className="
  bg-gray-200
  dark:bg-zinc-800
  hover:bg-gray-300
  dark:hover:bg-zinc-700
  text-black
  dark:text-white
  w-10
  h-10
  rounded-lg
  flex
  items-center
  justify-center
  transition
"
        >
          {darkMode ? (
            <Moon size={18} />
          ) : (
            <Sun size={18} />
          )}
        </button>

        <div className="relative">

          <button
            onClick={() =>
              setMenuOpen(
                !menuOpen
              )
            }
            className="
  bg-gray-200
  dark:bg-zinc-800
  hover:bg-gray-300
  dark:hover:bg-zinc-700
  text-black
  dark:text-white
  w-10
  h-10
  rounded-lg
  flex
  items-center
  justify-center
  transition
"
          >
            <MoreVertical
              size={18}
            />
          </button>

          {menuOpen && (

  <div
    className="
      absolute
      right-0
      top-12
      w-72
      bg-white
      dark:bg-zinc-900
      border
      border-zinc-300
      dark:border-zinc-700
      rounded-2xl
      shadow-2xl
      overflow-hidden
      z-50
    "
  >

              <button
                onClick={
                  handleExportPDF
                }
                className="
  flex
  items-center
  gap-3
  w-full
  px-5
  py-4
  text-left
  text-black
  dark:text-white
  hover:bg-gray-100
  dark:hover:bg-zinc-800
"
              >
                <FileText
                  size={20}
                />
                Download PDF
              </button>

              <button
                onClick={
                  handleExportDOCX
                }
                className="
  flex
  items-center
  gap-3
  w-full
  px-5
  py-4
  text-left
  text-black
  dark:text-white
  hover:bg-gray-100
  dark:hover:bg-zinc-800
"
              >
                <FileDown
                  size={20}
                />
                Download DOCX
              </button>

              <button
                onClick={
                  handleShare
                }
                className="
  flex
  items-center
  gap-3
  w-full
  px-5
  py-4
  text-left
  text-black
  dark:text-white
  hover:bg-gray-100
  dark:hover:bg-zinc-800
"
              >
                <Share2
                  size={20}
                />
                Share Chat
              </button>

            </div>

          )}

                </div>

      </div>

        </div>

  </>
);

}