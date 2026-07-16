export interface Thread {
  id: string
  title: string
}

export interface Message {
  sender: "user" | "ai"
  text: string
}