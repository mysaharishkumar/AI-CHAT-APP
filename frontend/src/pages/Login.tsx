import {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  signInWithPopup,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../firebase";

import { api } from "../services/api";

import logo from "../assets/logo.png";

export default function Login() {
  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

    const [errorMessage, setErrorMessage] =
  useState("");

  useEffect(() => {
    const userId =
      localStorage.getItem(
        "user_id"
      );

    if (userId) {
      navigate("/");
    }
  }, [navigate]);

  const sendOtp =
  async (): Promise<void> => {

    if (!email.trim()) {

      setErrorMessage(
        "Please enter email"
      );

      return;

    }

    try {

      setLoading(true);

      setErrorMessage("");

      await api.post(
        "/auth/send-otp",
        {
          email,
        }
      );

      setOtpSent(true);

    } catch (error: unknown) {

      const err = error as {
        response?: {
          data?: {
            detail?: string;
          };
        };
        code?: string;
        message?: string;
      };

      const detail =
        err?.response?.data?.detail;

      if (typeof detail === "string") {

        setErrorMessage(detail);

      } else if (err?.code === "ECONNABORTED") {

        setErrorMessage(
          "The server took too long to respond. If it's been idle (e.g. a free-tier host waking up), please try again in a moment — otherwise check the backend logs."
        );

      } else if (err?.message === "Network Error") {

        setErrorMessage(
          "Can't reach the server. Is the backend running?"
        );

      } else {

        setErrorMessage(
          "Failed to send OTP"
        );

      }

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const verifyOtp =
  async (): Promise<void> => {

    if (!otp.trim()) {

      setErrorMessage(
        "Please enter OTP"
      );

      return;
    }

    try {

      setLoading(true);

      setErrorMessage("");

      const response =
        await api.post(
          "/auth/verify-otp",
          {
            email,
            otp,
          }
        );

      localStorage.setItem(
        "user_id",
        response.data.user_id
      );

      localStorage.setItem(
        "email",
        response.data.email
      );

      navigate("/");

    } catch {

  setErrorMessage(
    "Invalid OTP"
  );

} finally {

      setLoading(false);

    }

  };

  const loginWithGoogle =
  async (): Promise<void> => {

    try {

      const result =
        await signInWithPopup(
          auth,
          googleProvider
        );

      const user =
        result.user;

      localStorage.setItem(
        "user_id",
        user.uid
      );

      localStorage.setItem(
        "email",
        user.email || ""
      );

      navigate("/");

    } catch (error) {

      console.error(error);

      setErrorMessage(
        "Google Login Failed"
      );

    }

  };

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-4
        relative
        overflow-hidden
        bg-cover
        bg-center
        bg-no-repeat
      "
      style={{
        backgroundImage:
          "url('/background.png')",
      }}
    >
      {/* Dark Overlay */}

      <div
        className="
          absolute
          inset-0
          bg-[#020617]/60
        "
      />

      {/* Card */}

      <div
        className="
  relative
  z-10
  w-full
  max-w-[420px]
  rounded-[32px]
  p-5
  bg-[#050b25]/90
  backdrop-blur-xl
  border
  border-cyan-400/40
  overflow-hidden
  shadow-[0_0_80px_rgba(0,255,255,0.55),0_0_180px_rgba(217,70,239,0.45)]
"
      >
        {/* Neon Border */}

        <div
  className="
    absolute
    -inset-[2px]
    rounded-[34px]
    pointer-events-none
    border
    border-cyan-400/60
    shadow-[0_0_40px_rgba(0,255,255,1),0_0_80px_rgba(0,255,255,0.9),0_0_160px_rgba(217,70,239,0.8),0_0_260px_rgba(217,70,239,0.6)]
  "
/>

        {/* Logo */}

        <div className="flex justify-center">
          <div
            className="
              p-3
              rounded-3xl
              bg-[#030817]
              shadow-[0_0_60px_rgba(0,255,255,0.8)]
            "
          >
            <img
              src={logo}
              alt="AI Logo"
              className="
                w-20
                h-20
                object-contain
              "
            />
          </div>
        </div>

        {/* Title */}

        <h1
          className="
            text-center
            text-4xl
            font-bold
            text-white
            mt-5
          "
        >
          AI Chat App
        </h1>

        <p
  className="
    text-center
    text-zinc-400
    mt-2
    mb-6
    text-lg
  "
>
  Smart AI Assistant
</p>


        {!otpSent ? (
          <>
            <input
  type="email"
  placeholder="Enter Email"
  value={email}
  onChange={(e) =>
    setEmail(
      e.target.value
    )
  }
  onKeyDown={(e) => {

    if (e.key === "Enter") {

      void sendOtp();

    }

  }}
  className="
    w-full
    h-12
    px-5
    rounded-2xl
    bg-[#0b132d]
    border
    border-cyan-500/20
    text-white
    placeholder:text-zinc-500
    outline-none
    focus:border-cyan-400
    shadow-[0_0_15px_rgba(0,255,255,0.08)]
  "
/>
{errorMessage && (
  <div
    className="
      mt-3
      px-4
      py-3
      rounded-xl
      bg-red-500/10
      border
      border-red-500/30
      text-red-400
      text-sm
      font-medium
    "
  >
    {errorMessage}
  </div>
)}

            <button
              onClick={sendOtp}
              disabled={loading}
              className="
                w-full
                h-14
                mt-6
                rounded-2xl
                text-lg
                font-semibold
                text-white
                bg-gradient-to-r
                from-cyan-500
                via-blue-500
                to-fuchsia-500
                shadow-[0_0_30px_rgba(59,130,246,0.6)]
                hover:scale-[1.02]
                transition-all
              "
            >
              {loading
                ? "Sending..."
                : "Send OTP"}
            </button>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-zinc-700" />
              <span className="text-zinc-500">
                OR
              </span>
              <div className="flex-1 h-px bg-zinc-700" />
            </div>

            <button
  onClick={loginWithGoogle}
  className="
    w-full
    h-14
    rounded-2xl
    bg-white
    text-black
    font-semibold
    hover:bg-gray-100
    transition
  "
>
  Continue with Google
</button>
          </>
        ) : (
          <>
            <h2
              className="
                text-white
                text-2xl
                font-semibold
                mb-3
              "
            >
              Verify OTP
            </h2>

            <p
              className="
                text-zinc-400
                mb-5
              "
            >
              OTP sent to {email}
            </p>

            <input
  type="text"
  value={otp}
  onChange={(e) =>
    setOtp(
      e.target.value
    )
  }
  onKeyDown={(e) => {

    if (e.key === "Enter") {

      void verifyOtp();

    }

  }}
  placeholder="Enter OTP"
  className="
    w-full
    h-14
    px-5
    rounded-2xl
    bg-[#0b132d]
    border
    border-cyan-500/20
    text-white
    placeholder:text-zinc-500
    outline-none
  "
/>

{errorMessage && (
  <div
    className="
      mt-3
      px-4
      py-3
      rounded-xl
      bg-red-500/10
      border
      border-red-500/30
      text-red-400
      text-sm
      font-medium
    "
  >
    {errorMessage}
  </div>
)}

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="
                w-full
                h-14
                mt-6
                rounded-2xl
                text-lg
                font-semibold
                text-white
                bg-gradient-to-r
                from-green-500
                to-cyan-500
                shadow-[0_0_25px_rgba(34,197,94,0.5)]
              "
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>
          </>
        )}

        <p
          className="
            text-center
            text-zinc-500
            mt-7
            text-sm
          "
        >
          🔒 Your data is secure and encrypted
        </p>
      </div>
    </div>
  );
}