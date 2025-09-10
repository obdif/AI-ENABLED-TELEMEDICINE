import React from "react";
import ReactMarkdown from "react-markdown"; 

const ChatMessageItem = ({ message }) => {
  const formattedTime = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (message.sender === "bot") {
    return (
      <div className="flex items-start animate-fadeIn">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 flex items-center justify-center text-white">
          <span className="text-xs font-bold">AI</span>
        </div>
        <div className="ml-2 bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[80%]">
          {message.isMarkdown ? (
            <ReactMarkdown>{message.text}</ReactMarkdown>
          ) : (
            <div className="text-sm">{message.text}</div>
          )}
          <div className="text-right mt-1 text-xs text-gray-400">
            {formattedTime}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-start justify-end animate-fadeIn">
        <div className="mr-2 bg-gradient-to-r from-teal-400 to-indigo-500 text-white rounded-lg rounded-tr-none p-3 shadow-sm max-w-[80%]">
          <div className="text-sm">{message.text}</div>
          <div className="text-right mt-1 text-xs text-white/70">
            {formattedTime}
          </div>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-600">You</span>
        </div>
      </div>
    );
  }
};

export default ChatMessageItem;