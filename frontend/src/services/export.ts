import { api } from "./api"

export const exportChat = async (
  userId: string,
  threadId: string
): Promise<void> => {

  const response =
    await api.get(
      `/export/${userId}/${threadId}`,
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
    "chat.pdf"

  document.body.appendChild(
    link
  )

  link.click()

  link.remove()

  window.URL.revokeObjectURL(
    url
  )

}