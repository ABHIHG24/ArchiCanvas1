import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, MessageCircle } from "lucide-react";

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `
You are "Archi," an expert and friendly guide for the ArchiCanvas digital art platform.

Rules:
1. ONLY answer questions related to ArchiCanvas, its features, and traditional Indian art.
2. If asked about anything else, politely refuse and redirect back to ArchiCanvas.
3. Be concise, supportive, and artist-friendly.
`;

const ArchiChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello! I am Archi, your guide to the ArchiCanvas platform. How can I help you explore traditional art today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Convert chat history into Gemini format
      const contents = [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        ...updatedMessages.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        })),
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
      });

      setMessages((prev) => [
        ...prev,
        { role: "model", text: response.text },
      ]);
    } catch (error) {
      console.error("Gemini error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Sorry, I’m having trouble right now. Please try again shortly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-base-100 rounded-xl shadow-lg border flex flex-col min-h-[600px]">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-center">
          Chat with Archi
        </h2>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 mb-4 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "model" && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                  <Bot size={18} />
                </div>
              )}

              <div
                className={`max-w-[80%] p-3 rounded-xl ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-slate-200 text-slate-800"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-white">
                  <User size={18} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="text-center text-slate-500">Archi is thinking…</div>
        )}
      </div>

      <form
        onSubmit={sendMessage}
        className="p-4 border-t flex gap-2"
      >
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Ask about ArchiCanvas…"
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="btn btn-primary btn-square"
        >
          <motion.div
            animate={{ rotate: isLoading ? 360 : 0 }}
            transition={{ repeat: isLoading ? Infinity : 0, duration: 1 }}
          >
            <Send size={20} />
          </motion.div>
        </button>
      </form>
    </div>
  );
};

export default ArchiChat;
