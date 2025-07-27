import { Send } from "lucide-react";
import React, { useState } from "react";

interface Message {
  mainText: string;
  time: string;
  author: string;
}
interface Messageprops {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onclick: (message: Message) => void;
  person: string;
}

const ChatWindow = (props: Messageprops) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const newMessage = {
      mainText: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      author: props.person,
    };
    props.setMessages((prev) => [...prev, newMessage]);
    setInput("");
    props.onclick(newMessage);
  };

  return (
    <div className="flex flex-col h-[90%] w-full bg-white">
      {/* Messages container */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {props.messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] p-3 rounded-lg ${
              msg.author === "me"
                ? "bg-blue-600 text-white self-end"
                : "bg-gray-100 text-gray-900 self-start"
            }`}
          >
            <p className="text-sm">{msg.mainText}</p>
            <p
              className={`text-xs mt-1 ${
                msg.author === "me" ? "text-blue-200" : "text-gray-500"
              }`}
            ></p>
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
