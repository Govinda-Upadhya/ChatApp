import { Send } from "lucide-react";
import React, { useState } from "react";

interface Message {
  text: string;
  time: string;
  sender: "me" | "other";
}

const messagesMock: Message[] = [
  {
    text: "Hey! Are we still on for dinner tonight?",
    time: "2:45 PM",
    sender: "other",
  },
  {
    text: "Hey! Are we still on for dinner tonight?",
    time: "2:45 PM",
    sender: "other",
  },
  {
    text: "Hey! Are we still on for dinner tonight?",
    time: "2:45 PM",
    sender: "other",
  },
  {
    text: "Yes! Looking forward to it. How about 7 PM at that new Italian place?",
    time: "2:47 PM",
    sender: "me",
  },
  {
    text: "Perfect! I'll make a reservation. Can't wait to catch up!",
    time: "2:48 PM",
    sender: "other",
  },
];

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>(messagesMock);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        {
          text: input.trim(),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sender: "me",
        },
      ]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-[90%] w-full bg-white">
      {/* Messages container */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] p-3 rounded-lg ${
              msg.sender === "me"
                ? "bg-blue-600 text-white self-end"
                : "bg-gray-100 text-gray-900 self-start"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
            <p
              className={`text-xs mt-1 ${
                msg.sender === "me" ? "text-blue-200" : "text-gray-500"
              }`}
            >
              {msg.time}
            </p>
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="border-t p-3 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 bg-gray-100 px-4 py-2 rounded-full text-sm outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export { ChatWindow };
