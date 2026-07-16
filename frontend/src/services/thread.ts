import { api } from "./api"

export type Thread = {
  id: string
  title: string
  empty?: boolean
}

export const getThreads = async (
  userId: string
): Promise<Thread[]> => {

  const response =
    await api.get(
      `/threads/${userId}`
    )

  return response.data

}

export const createThread = async (
  userId: string
): Promise<Thread> => {

  const response =
    await api.post(
      "/thread/create",
      {
        user_id: userId,
      }
    )

  return response.data

}

export const deleteThread = async (
  threadId: string
): Promise<void> => {

  await api.delete(
    `/thread/${threadId}`
  )

}