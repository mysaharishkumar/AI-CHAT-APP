import { api } from "./api"

export const exportDocx =
  async (
    userId: string,
    threadId: string
  ) => {

    const response =
      await api.get(
        `/export-docx/${userId}/${threadId}`,
        {
          responseType: "blob",
        }
      )

    const url =
      window.URL.createObjectURL(
        response.data
      )

    const link =
      document.createElement("a")

    link.href = url

    link.download =
      "chat.docx"

    document.body.appendChild(
      link
    )

    link.click()

    link.remove()

    window.URL.revokeObjectURL(
      url
    )

  }