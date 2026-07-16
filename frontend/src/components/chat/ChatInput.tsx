import { useState, useRef } from "react";

import {
  Plus,
  Mic,
  ArrowUp,
} from "lucide-react";

type Props = {
  active: boolean;
  onSend: (
    text: string,
    file?: File | null
  ) => void;
};

interface SpeechRecognitionResultEvent
  extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface RecognitionInstance {
  lang: string;
  start: () => void;
  onresult:
    | ((
        event: SpeechRecognitionResultEvent
      ) => void)
    | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

interface CustomWindow
  extends Window {
  SpeechRecognition?: {
    new (): RecognitionInstance;
  };
  webkitSpeechRecognition?: {
    new (): RecognitionInstance;
  };
}

export default function ChatInput({
  active,
  onSend,
}: Props) {

  const [message, setMessage] =
    useState("");

  const [listening, setListening] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

    if (!active) {
  return null;
}

  const sendMessage = (): void => {

    if (
      !message.trim() &&
      !selectedFile
    ) {
      return;
    }

    onSend(
      message,
      selectedFile
    );

    setMessage("");
    setSelectedFile(null);

    if (textareaRef.current) {
      textareaRef.current.style.height =
        "48px";
    }

  };

  const handleChange = (
  e: React.ChangeEvent<HTMLTextAreaElement>
): void => {

  setMessage(
    e.target.value
  );

  e.target.style.height =
    "auto";

  const newHeight =
    Math.min(
      e.target.scrollHeight,
      180
    );

  e.target.style.height =
    `${newHeight}px`;

};

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      sendMessage();

    }

  };

  const startVoiceInput = (): void => {

    const customWindow =
      window as CustomWindow;

    const SpeechRecognitionAPI =
      customWindow.SpeechRecognition ||
      customWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {

      alert(
        "Speech Recognition not supported"
      );

      return;

    }

    const recognition =
      new SpeechRecognitionAPI();

    recognition.lang = "en-US";

    recognition.start();

    setListening(true);

    recognition.onresult = (
      event
    ) => {

      const transcript =
        event.results[0][0]
          .transcript;

      setMessage(
        transcript
      );

    };

    recognition.onerror = () =>
      setListening(false);

    recognition.onend = () =>
      setListening(false);

  };

  return (

    <div
  className="
    sticky
    bottom-0
    bg-white
    dark:bg-zinc-900
    border-t
    border-zinc-300
    dark:border-zinc-800
    p-3
  "
>

      <div
        className="
          max-w-4xl
          mx-auto
        "
      >

        {selectedFile && (

          <div
            className="
              mb-3
              flex
              flex-wrap
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                bg-zinc-800
                text-white
                px-3
                py-2
                rounded-full
                text-sm
              "
            >

              📄

              <span
                className="
                  max-w-[200px]
                  truncate
                "
              >
                {selectedFile.name}
              </span>

              <button
                onClick={() =>
                  setSelectedFile(
                    null
                  )
                }
                className="
                  text-red-400
                  hover:text-red-300
                "
              >
                ✕
              </button>

            </div>

          </div>

        )}

        <div
  className="
    flex
    flex-col
    gap-1

    bg-white
    dark:bg-zinc-900

    border
    border-zinc-300
    dark:border-zinc-700

    rounded-[28px]

    px-4
    py-3

    shadow-sm
  "
>

          <textarea
  ref={textareaRef}
  value={message}
  onChange={handleChange}
  onKeyDown={handleKeyDown}
  rows={1}
  placeholder="Message AI..."
  className="
    w-full
    resize-none
    bg-transparent
    text-black
    dark:text-white
    outline-none

    min-h-[24px]
    max-h-[180px]

    overflow-y-auto

    leading-6

    placeholder:text-zinc-400
  "
/>

          <div
  className="
    flex
    items-center
    justify-between
  "
>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              hidden
              onChange={(e) => {

                const file =
                  e.target.files?.[0] ||
                  null;

                setSelectedFile(
                  file
                );

              }}
            />

            <button
  onClick={() =>
    fileInputRef.current?.click()
  }
  className="
    p-2
    rounded-full
    text-zinc-600
    dark:text-zinc-400
    hover:bg-gray-200
    dark:hover:bg-zinc-800
  "
>
  <Plus size={20} />
</button>

            <div
  className="
    flex
    items-center
    gap-1
  "
>

              <button
  onClick={startVoiceInput}
  className={`
    p-2
    rounded-full
    hover:bg-gray-200
    dark:hover:bg-zinc-800
    ${
      listening
        ? "text-red-500 animate-pulse"
        : "text-zinc-600 dark:text-zinc-400"
    }
  `}
>
  <Mic size={20} />
</button>

              <button
  onClick={sendMessage}
  className="
    w-9
    h-9

    rounded-full

    bg-black
    dark:bg-white

    text-white
    dark:text-black

    flex
    items-center
    justify-center

    shrink-0
  "
>
  <ArrowUp size={18} />
</button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}