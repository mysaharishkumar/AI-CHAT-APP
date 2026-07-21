import { api } from "./api"

type ApiError = {
  response?: {
    data?: {
      detail?: string
    }
  }
  code?: string
  message?: string
}

const extractError = (error: unknown): Error => {

  const err = error as ApiError

  const detail = err?.response?.data?.detail

  if (typeof detail === "string") {
    return new Error(detail)
  }

  if (err?.code === "ECONNABORTED") {
    return new Error(
      "The server is taking a while to respond — if it's been idle, it may just be waking up. Please try again in a moment."
    )
  }

  if (err?.message === "Network Error") {
    return new Error(
      "Can't reach the server. Is the backend running?"
    )
  }

  return new Error("Something went wrong. Please try again.")

}

export const sendChatMessage = async (
  message: string,
  userId: string,
  threadId: string
) => {

  try {

    const response =
      await api.post(
        "/chat",
        {
          user_id: userId,
          thread_id: threadId,
          message: message
        }
      )

    return response.data.reply

  } catch (error) {

    throw extractError(error)

  }

}

export const sendGuestChatMessage = async (
  message: string
) => {

  // Uses the same /chat endpoint as logged-in users, just with
  // empty user_id/thread_id — the backend treats that as a guest
  // request and skips saving anything.
  return sendChatMessage(message, "", "")

}