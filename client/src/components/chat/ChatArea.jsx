import React from 'react';
import ChatMessageItem from './ChatMessageItem';
import PresetQuestions from './PresetQuestions';

const ChatArea = ({ messages, presetQuestions, onPresetQuestionClick, chatEndRef, isLoading }) => {
  const showPresetQuestions = messages.length === 1 || 
    (messages.length > 1 && messages[messages.length - 1].sender === 'bot');

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex items-start animate-pulse">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-red-500 flex items-center justify-center text-white">
              <span className="text-xs font-bold">AI</span>
            </div>
            <div className="ml-2 bg-white rounded-lg rounded-tl-none p-3 shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
            </div>
          </div>
        )}
        
        {showPresetQuestions && !isLoading && (
          <PresetQuestions 
            questions={presetQuestions} 
            onQuestionClick={onPresetQuestionClick} 
          />
        )}
        
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

export default ChatArea;