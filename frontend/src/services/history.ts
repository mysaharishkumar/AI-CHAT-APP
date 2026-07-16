import { api } from "./api"

export const getChatHistory = async (
  userId: string,
  threadId: string
) => {

  const response = await api.get(
    `/chat/history/${userId}/${threadId}`
  )

  return response.data
}