"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, Bot, User } from "lucide-react"

type Message = {
  id: string
  text: string
  sender: "user" | "bot"
  redirect?: string
}

export default function AssistantClient() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      text: "Hi! I'm your assistant. Try: \"show defaulter list\", \"new admission\", \"fee vouchers\", \"attendance report\", \"exams\", \"student list\".",
      sender: "bot",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })
      const data = await res.json()
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Sorry, something went wrong.",
        sender: "bot",
        redirect: data.redirect,
      }
      setMessages(prev => [...prev, botMsg])

      // If a redirect is provided, offer to navigate
      if (data.redirect) {
        setTimeout(() => {
          if (window.confirm(`Would you like to go to ${data.redirect}?`)) {
            router.push(data.redirect)
          }
        }, 500)
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: "Failed to reach assistant.", sender: "bot" },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>
      <div className="border rounded-lg p-4 h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {msg.sender === "bot" ? <Bot size={16} /> : <User size={16} />}
                  <span className="text-xs font-semibold">
                    {msg.sender === "bot" ? "Assistant" : "You"}
                  </span>
                </div>
                <p className="text-sm">{msg.text}</p>
                {msg.redirect && (
                  <button
                    onClick={() => router.push(msg.redirect!)}
                    className="mt-1 text-xs underline text-blue-300"
                  >
                    Go now
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Ask something..."
            className="flex-1 border p-2 rounded"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "..." : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  )
}