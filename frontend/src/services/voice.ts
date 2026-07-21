import { api } from "./api"

export type VoiceLang = "en" | "te"

export const fetchSpeechAudio = async (
  text: string,
  lang: VoiceLang
): Promise<string> => {

  try {

    const response = await api.post(
      "/voice/speak",
      { text, lang },
      { responseType: "blob" }
    )

    return URL.createObjectURL(response.data)

  } catch (error: unknown) {

    // With responseType "blob", axios also puts error bodies
    // into a Blob — unwrap it to get the real backend message.
    const err = error as {
      response?: { data?: unknown }
    }

    const data = err?.response?.data

    if (data instanceof Blob) {

      try {

        const text = await data.text()
        const parsed = JSON.parse(text)

        throw new Error(
          parsed.detail || "Voice output failed",
          { cause: error }
        )

      } catch (innerError: unknown) {

        throw new Error("Voice output failed", {
          cause: innerError,
        })

      }

    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error("Voice output failed", {
      cause: error,
    })

  }

}