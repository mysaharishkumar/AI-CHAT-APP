import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ProfileModal({
  isOpen,
  onClose,
}: Props) {
  const email =
    localStorage.getItem(
      "email"
    ) || "";

  const [displayName, setDisplayName] =
    useState(
      localStorage.getItem(
        "display_name"
      ) ||
        email.split("@")[0]
    );

  const [photo, setPhoto] =
    useState<string>(
      localStorage.getItem(
        "profile_photo"
      ) || ""
    );

  if (!isOpen) {
    return null;
  }

  const saveProfile = (): void => {
    localStorage.setItem(
      "display_name",
      displayName
    );

    localStorage.setItem(
      "profile_photo",
      photo
    );

    window.location.reload();
  };

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/60
        flex
        items-center
        justify-center
        z-[100]
      "
    >
      <div
  className="
    w-[650px]
    bg-white
    dark:bg-zinc-900
    rounded-3xl
    p-6
    border
    border-zinc-300
    dark:border-zinc-800
  "
>
        <h2
          className="
            text-black dark:text-white
            text-2xl
            font-semibold
            mb-8
          "
        >
          Edit Profile
        </h2>

        <div className="flex justify-center mb-8">
          <div className="relative">
            {photo ? (
              <img
                src={photo}
                alt=""
                className="
                  w-40
                  h-40
                  rounded-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  w-40
                  h-40
                  rounded-full
                  bg-gray-300 dark:bg-zinc-600
                  flex
                  items-center
                  justify-center
                  text-black dark:text-white
                  text-5xl
                "
              >
                {displayName
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              id="photo-upload"
              hidden
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

                if (!file) {
                  return;
                }

                const reader =
                  new FileReader();

                reader.onload =
                  () => {
                    setPhoto(
                      String(
                        reader.result
                      )
                    );
                  };

                reader.readAsDataURL(
                  file
                );
              }}
            />

            <label
              htmlFor="photo-upload"
              className="
                absolute
                bottom-2
                right-2
                w-10
                h-10
                rounded-full
                bg-white
                text-black
                flex
                items-center
                justify-center
                cursor-pointer
              "
            >
              📷
            </label>
          </div>
        </div>

        <div className="space-y-4">

          <div
  className="
    border
    border-zinc-300
    dark:border-zinc-700
    rounded-xl
    p-4
  "
>
            <p
              className="
  text-zinc-600
  dark:text-zinc-400
  text-sm
  mb-1
"
            >
              Display Name
            </p>

            <input
              value={displayName}
              onChange={(e) =>
                setDisplayName(
                  e.target.value
                )
              }
              className="
                bg-transparent
                outline-none
                text-black dark:text-white
                w-full
                text-lg
              "
            />
          </div>

          <div
  className="
    border
    border-zinc-300
    dark:border-zinc-700
    rounded-xl
    p-4
  "
>
            <p
              className="
                text-zinc-600 dark:text-zinc-400
                text-sm
                mb-1
              "
            >
              Email
            </p>

            <p className="text-black dark:text-white">
              {email}
            </p>
          </div>

        </div>

        <div
          className="
            flex
            justify-end
            gap-3
            mt-8
          "
        >
          <button
            onClick={onClose}
            className="
              px-5
              py-2
              rounded-full
              border
              border-zinc-300 dark:border-zinc-700
              text-black dark:text-white
            "
          >
            Cancel
          </button>

          <button
            onClick={saveProfile}
            className="
              px-5
              py-2
              rounded-full
              bg-zinc-900
dark:bg-white
text-white
dark:text-black
              font-medium
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}