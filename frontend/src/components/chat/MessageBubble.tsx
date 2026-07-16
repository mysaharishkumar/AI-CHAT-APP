import { useState, useRef, useEffect } from "react";

import {
  Copy,
  Volume2,
  Square,
  Loader2,
  Languages,
  Share2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { fetchSpeechAudio } from "../../services/voice";
import type { VoiceLang } from "../../services/voice";

type MessageProps = {
  id: number;
  text: string;
  sender: "user" | "ai";
  time: string;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

export default function MessageBubble({
  id,
  text,
  sender,
  time,
  onDelete,
}: MessageProps) {
  const [menuOpen, setMenuOpen] =
    useState(false);

    const [showDeleteModal, setShowDeleteModal] =
  useState(false);

  const [speaking, setSpeaking] =
    useState(false);

  const [speechLoading, setSpeechLoading] =
    useState(false);

  const [voiceLang, setVoiceLang] =
    useState<VoiceLang>("en");

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const modeRef =
    useRef<"audio" | "speech">("audio");

  useEffect(() => {

    return () => {

      if (audioRef.current) {
        audioRef.current.pause();
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

    };

  }, []);

  const copyMessage =
    async (): Promise<void> => {
      try {
        await navigator.clipboard.writeText(
          text
        );
      } catch (error) {
        console.error(error);
      }
    };

  const shareMessage =
    async (): Promise<void> => {
      try {
        if (navigator.share) {
          await navigator.share({
            text,
          });
        } else {
          await navigator.clipboard.writeText(
            text
          );

          alert(
            "Message copied"
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

  const deleteMessage =
  (): void => {

    onDelete(id);

    setShowDeleteModal(false);

    setMenuOpen(false);

  };

  const stopSpeaking = (): void => {

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);

  };

  const speakMessage =
    async (): Promise<void> => {

      // Already speaking -> button acts as Stop
      if (speaking) {
        stopSpeaking();
        return;
      }

      setSpeechLoading(true);

      try {

        const audioUrl =
          await fetchSpeechAudio(
            text,
            voiceLang
          );

        if (audioRef.current) {
          audioRef.current.pause();
        }

        const audio =
          new Audio(audioUrl);

        audioRef.current = audio;
        modeRef.current = "audio";

        audio.onended = () => {
          setSpeaking(false);
        };

        audio.onerror = () => {
          setSpeaking(false);
        };

        await audio.play();

        setSpeaking(true);

      } catch (backendError) {

        console.error(
          "Backend voice failed, falling back to browser voice:",
          backendError
        );

        // Fallback: the browser's own speech engine.
        // Works fully offline, so this keeps voice output
        // usable even if the server/network has issues.
        if (!("speechSynthesis" in window)) {

          alert(
            "Voice output isn't available right now, and this browser doesn't support offline speech either."
          );

          setSpeechLoading(false);

          return;

        }

        try {

          window.speechSynthesis.cancel();

          const utterance =
            new SpeechSynthesisUtterance(
              text
            );

          utterance.lang =
            voiceLang === "te"
              ? "te-IN"
              : "en-US";

          utterance.onend = () => {
            setSpeaking(false);
          };

          utterance.onerror = () => {
            setSpeaking(false);
          };

          modeRef.current = "speech";

          window.speechSynthesis.speak(
            utterance
          );

          setSpeaking(true);

        } catch (fallbackError) {

          console.error(fallbackError);

          alert(
            "Couldn't play voice output. Please try again."
          );

        }

      } finally {

        setSpeechLoading(false);

      }

    };

  const toggleLang = (): void => {

    // Switching language stops any current playback
    // to avoid mismatched audio.
    if (speaking) {
      stopSpeaking();
    }

    setVoiceLang(
      (prev) =>
        prev === "en" ? "te" : "en"
    );

  };

  return (
    <div
      className={`group mb-3 flex flex-col ${
        sender === "user"
          ? "items-end"
          : "items-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl shadow-sm ${
          sender === "user"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-zinc-800 text-black dark:text-white"
        }`}
      >
        <div className="px-4 pt-3 pb-1">
          <p
            className="
              whitespace-pre-wrap
              break-words
              text-[15px]
              leading-6
            "
          >
            {text}
          </p>

          <div
            className="
              flex
              justify-end
              mt-1
            "
          >
            <span
              className="
                text-[11px]
                opacity-70
              "
            >
              {time}
            </span>
          </div>
        </div>
      </div>

      {/* AI Buttons Always Visible */}

      {sender === "ai" && (
        <div
          className="
            flex
            items-center
            gap-1
            mt-1
            text-zinc-600 dark:text-zinc-400
          "
        >
          <button
            onClick={copyMessage}
            className="
              p-2
              rounded-md
              hover:bg-gray-200 dark:hover:bg-zinc-800
            "
          >
            <Copy size={16} />
          </button>

          <button
  onClick={speakMessage}
  disabled={speechLoading}
  title={
    speaking
      ? "Stop voice output"
      : `Speak (${voiceLang === "en" ? "English" : "Telugu"})`
  }
  className={`
    p-2
    rounded-md
    hover:bg-gray-200
    dark:hover:bg-zinc-800
    ${
      speaking
        ? "text-red-500"
        : "text-zinc-600 dark:text-zinc-400"
    }
  `}
>
  {speechLoading ? (
    <Loader2 size={16} className="animate-spin" />
  ) : speaking ? (
    <Square size={16} />
  ) : (
    <Volume2 size={16} />
  )}
</button>

          <button
  onClick={toggleLang}
  title={
    voiceLang === "en"
      ? "Switch voice to Telugu"
      : "Switch voice to English"
  }
  className="
    p-2
    rounded-md
    text-[11px]
    font-semibold
    flex
    items-center
    gap-1
    hover:bg-gray-200
    dark:hover:bg-zinc-800
    text-zinc-600
    dark:text-zinc-400
  "
>
  <Languages size={16} />
  {voiceLang === "en" ? "EN" : "TE"}
</button>

          <div className="relative">
            <button
  onClick={() =>
    setMenuOpen(!menuOpen)
  }
  className="
    p-2
    rounded-md
    hover:bg-gray-200
    dark:hover:bg-zinc-800
  "
>
  <MoreHorizontal
    size={16}
    className="
      text-zinc-600
      dark:text-zinc-400
    "
  />
</button>

            {menuOpen && (
              <div
                className="
                  absolute
                  left-0
                  top-9
                  w-32
                  bg-white
dark:bg-zinc-900
border-zinc-300
dark:border-zinc-700
                  border
                  rounded-lg
                  shadow-lg
                  z-50
                "
              >
                <button
  onClick={shareMessage}
  className="
    w-full
    flex
    items-center
    gap-2
    px-3
    py-2
    text-left
    text-black
    dark:text-white
    hover:bg-gray-200
    dark:hover:bg-zinc-800
  "
>
  <Share2
    size={16}
    className="
      text-zinc-600
      dark:text-zinc-400
    "
  />
  Share
</button>

                <button
  onClick={() => {
    setShowDeleteModal(true);
    setMenuOpen(false);
  }}
  className="
    w-full
    flex
    items-center
    gap-2
    px-3
    py-2
    text-left
    text-red-500
    dark:text-red-400
    hover:bg-gray-200
    dark:hover:bg-zinc-800
  "
>
  <Trash2 size={16} />
  Delete
</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Buttons On Hover */}

      {sender === "user" && (
  <div
    className="
      opacity-0
      group-hover:opacity-100
      transition-all
      duration-200
      flex
      items-center
      gap-1
      mt-1
    "
  >
          <button
  onClick={copyMessage}
  className="
    p-2
    rounded-md
    text-zinc-600
    dark:text-zinc-300
    hover:bg-gray-200
    dark:hover:bg-zinc-800
  "
>
  <Copy size={16} />
</button>

          <button
  onClick={() =>
    setShowDeleteModal(true)
  }
  className="
    p-2
    rounded-md
    hover:bg-gray-200
    dark:hover:bg-zinc-800
  "
>
  <Trash2
    size={16}
    className="
      text-red-500
      dark:text-red-400
    "
  />
</button>
        </div>
      )}

      {showDeleteModal && (
  <div
    className="
      fixed
      inset-0
      bg-black/50
      flex
      items-center
      justify-center
      z-[9999]
    "
  >
    <div
      className="
        w-[360px]
        bg-white
        dark:bg-zinc-900
        rounded-2xl
        border
        border-zinc-300
        dark:border-zinc-700
        p-6
      "
    >
      <h3
        className="
          text-lg
          font-semibold
          text-black
          dark:text-white
        "
      >
        Delete Message
      </h3>

      <p
        className="
          mt-2
          text-zinc-600
          dark:text-zinc-400
        "
      >
        Are you sure you want to delete this message?
      </p>

      <div
        className="
          flex
          justify-end
          gap-3
          mt-6
        "
      >
        <button
          onClick={() =>
            setShowDeleteModal(false)
          }
          className="
            px-4
            py-2
            rounded-lg
            bg-zinc-200
            dark:bg-zinc-800
            text-black
            dark:text-white
          "
        >
          Cancel
        </button>

        <button
          onClick={deleteMessage}
          className="
            px-4
            py-2
            rounded-lg
            bg-red-500
            text-white
          "
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
