import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { api } from "../services/api";

type SharedMessage = {
  user_message: string;
  ai_response: string;
};

export default function SharedChat() {
  const { threadId } = useParams();

  const [title, setTitle] =
    useState("Shared Chat");

  const [messages, setMessages] =
    useState<SharedMessage[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    const load = async (): Promise<void> => {

      try {

        setLoading(true);

        const response =
          await api.get(
            `/share/${threadId}`
          );

        setTitle(
          response.data.title || "Shared Chat"
        );

        setMessages(
          response.data.messages || []
        );

      } catch (err) {

        console.error(err);

        setError(
          "This chat couldn't be found. The link may be invalid or the chat was deleted."
        );

      } finally {

        setLoading(false);

      }

    };

    void load();

  }, [threadId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex flex-col">

      <div
        className="
          h-16
          border-b
          border-zinc-300
          dark:border-zinc-800
          bg-white
          dark:bg-zinc-950
          flex
          items-center
          justify-between
          px-4
        "
      >
        <h1 className="text-black dark:text-white font-semibold text-lg truncate">
          {title}
        </h1>

        <Link
          to="/"
          className="
            text-sm
            px-4
            py-2
            rounded-lg
            bg-gray-200
            dark:bg-zinc-800
            text-black
            dark:text-white
            hover:bg-gray-300
            dark:hover:bg-zinc-700
            transition
          "
        >
          Open AI Chat App
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-3">

          {loading && (
            <p className="text-center text-zinc-500 dark:text-zinc-400">
              Loading chat...
            </p>
          )}

          {!loading && error && (
            <p className="text-center text-red-500">
              {error}
            </p>
          )}

          {!loading && !error && messages.length === 0 && (
            <p className="text-center text-zinc-500 dark:text-zinc-400">
              This chat is empty.
            </p>
          )}

          {messages.map((msg, index) => (
            <div key={index} className="space-y-3">

              <div className="flex justify-end">
                <div className="max-w-[75%] rounded-2xl bg-blue-600 text-white px-4 py-3">
                  <p className="whitespace-pre-wrap break-words text-[15px] leading-6">
                    {msg.user_message}
                  </p>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-2xl bg-gray-200 dark:bg-zinc-800 text-black dark:text-white px-4 py-3">
                  <p className="whitespace-pre-wrap break-words text-[15px] leading-6">
                    {msg.ai_response}
                  </p>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>

      <div className="text-center text-xs text-zinc-500 dark:text-zinc-600 py-3">
        🔒 Read-only shared chat — powered by AI Chat App
      </div>

    </div>
  );
}
