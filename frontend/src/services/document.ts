import { api } from "./api"

export const uploadDocument =
  async (
    file: File,
    userId: string
  ) => {

    const formData =
      new FormData()

    formData.append(
      "file",
      file
    )

    const response =
      await api.post(
        `/document/upload?user_id=${userId}`,
        formData
      )

    return response.data

  }

export const askDocument =
  async (
    userId: string,
    question: string
  ) => {

    const response =
      await api.post(
        "/document/ask",
        {
          user_id: userId,
          question,
        }
      )

    return response.data.answer

  }