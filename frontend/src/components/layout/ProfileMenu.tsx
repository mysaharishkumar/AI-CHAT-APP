import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Settings,
  LogOut,
  ChevronRight,
  LogIn,
} from "lucide-react";

import ProfileModal from "../profile/ProfileModal";

export default function ProfileMenu() {
  const navigate = useNavigate();

  const [open, setOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const userId =
    localStorage.getItem("user_id");

  const displayName =
    localStorage.getItem(
      "display_name"
    ) ||
    (
      localStorage.getItem(
        "email"
      ) || ""
    ).split("@")[0];

  const profilePhoto =
    localStorage.getItem(
      "profile_photo"
    ) || "";

  const logout = (): void => {
    localStorage.clear();

    window.location.href =
      "/";
  };

  if (!userId) {
    return (
      <button
        onClick={() =>
          navigate("/login")
        }
        className="
          w-full
          flex
          items-center
          gap-3
          p-3
          rounded-xl
          text-black
          dark:text-white
          bg-gray-200
          dark:bg-zinc-900
          hover:bg-gray-300
          dark:hover:bg-zinc-800
          transition
          font-medium
        "
      >
        <div
          className="
            w-10
            h-10
            rounded-full
            bg-gray-300
            dark:bg-zinc-700
            flex
            items-center
            justify-center
          "
        >
          <LogIn size={18} />
        </div>

        <span className="flex-1 text-left">
          Sign In
        </span>

        <ChevronRight
          size={18}
          className="text-zinc-600 dark:text-zinc-400"
        />
      </button>
    );
  }

  return (
    <>
      <div className="relative">

        <button
          onClick={() =>
            setOpen(!open)
          }
          className="
  w-full
  flex
  items-center
  gap-3
  p-3
  rounded-xl
  hover:bg-gray-200
  dark:hover:bg-zinc-800
  transition
"
        >

          {profilePhoto ? (

            <img
              src={profilePhoto}
              alt=""
              className="
                w-10
                h-10
                rounded-full
                object-cover
              "
            />

          ) : (

            <div
  className="
    w-10
    h-10
    rounded-full
    bg-gray-300
    dark:bg-zinc-600
    flex
    items-center
    justify-center
    text-black
    dark:text-white
    font-semibold
  "
>
              {displayName
                .charAt(0)
                .toUpperCase()}
            </div>

          )}

          <div className="flex-1 text-left">

            <p
  className="
    text-black
    dark:text-white
    font-medium
    truncate
  "
>
  {displayName}
</p>

          </div>

          <ChevronRight
            size={18}
            className="text-zinc-600 dark:text-zinc-400"
          />

        </button>

        {open && (

          <div
            className="
              absolute
              left-0
              top-full
              mt-2
              w-full
              bg-white
dark:bg-zinc-900
              border
              border-zinc-300
dark:border-zinc-800
              rounded-2xl
              shadow-xl
              overflow-hidden
              z-50
            "
          >

            <button
              onClick={() => {

                setProfileOpen(
                  true
                );

                setOpen(false);

              }}
              className="
  w-full
  flex
  items-center
  gap-3
  px-4
  py-3
  text-black
  dark:text-white
  hover:bg-gray-200
  dark:hover:bg-zinc-800
"
            >
              <User size={18} />
              My Profile
            </button>

            <button
              onClick={() => {

                alert(
                  "Settings Coming Soon"
                );

                setOpen(false);

              }}
              className="
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                text-black
dark:text-white
hover:bg-gray-200
dark:hover:bg-zinc-800
              "
            >
              <Settings size={18} />
              Settings
            </button>

            <div className="border-t border-zinc-300 dark:border-zinc-800" />

            <button
              onClick={logout}
              className="
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                text-red-500
dark:text-red-400
hover:bg-gray-200
dark:hover:bg-zinc-800
              "
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>

        )}

      </div>

      <ProfileModal
        isOpen={profileOpen}
        onClose={() =>
          setProfileOpen(
            false
          )
        }
      />
    </>
  );
}
