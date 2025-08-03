import { Send } from "lucide-react";
import React, { useState } from "react";

interface Message {
  message: string;
  time: string;
  sender: string;
  receiver: string;
  id?: number;
}
interface Messageprops {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onclick: (message: Message) => void;
  person: string;
  friend: string;
}

const ChatWindow = (props: Messageprops) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      message: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      receiver: props.friend,
      sender: props.person,
    };
    props.setMessages((prev) => [...prev, newMessage]);
    setInput("");
    props.onclick(newMessage);
  };

  return (
    <div className="flex flex-col h-[90%] w-full bg-white">
      {/* Messages container */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {props.messages.map((msg, i) => {
          const isSender = msg.sender === props.person;
          return (
            <div
              key={i}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg break-words whitespace-pre-wrap ${
                  isSender
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    isSender ? "text-blue-200" : "text-gray-500"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}
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
