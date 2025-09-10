import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import axios from "axios";
import ChatArea from "./ChatArea";



const systemPrompt = `You are IlaroCARE Health Assistant, powered by Meta AI, designed to assist users with health-related queries within the IlaroCARE platform. You specialize in:

- Providing accurate information on health conditions (e.g., malaria, breast cancer, fever, lung cancer, prostate cancer).
- Explaining symptoms, warning signs, and preventive measures.
- Triaging symptoms to recommend when to seek medical attention (e.g., "Seek immediate care if you have chest pain").
- Offering post-discharge care advice and medication reminders.
- Supporting mental health by detecting distress and providing coping strategies.

**Guidelines**:
- Always include a disclaimer: "This information is for educational purposes only. Please consult a healthcare professional for medical advice."
- If a user describes urgent symptoms (e.g., chest pain, difficulty breathing, high fever), recommend seeking immediate medical attention.
- Provide concise, actionable advice (e.g., "Take your medication at 8 AM daily").
- Use empathetic language to support users, especially for mental health queries.`;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I’m IlaroCARE Health Assistant, powered by Meta AI. I can help with health questions, symptom triage, or post-discharge care. What’s on your mind?",
      sender: "bot",
      timestamp: new Date(),
      isMarkdown: true,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef(null);

  const presetQuestions = [
    { id: "1", text: "How can I prevent malaria?", response: null },
    { id: "2", text: "I have a fever. Should I be worried?", response: null },
    {
      id: "3",
      text: "What should I do after being discharged for surgery?",
      response: null,
    },
    { id: "4", text: "I’m feeling anxious. Can you help?", response: null },
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMessage) => {
    try {
      const response = await axios.post(
        "https://upgraded-octo-train-1.onrender.com/api/medical-chat",
        { message: userMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log('API Response:', response.data);

      let aiResponse =
        response.data.response ||
        response.data.message ||
        "I'm sorry, I couldn't process your request.";

      if (
        !aiResponse.includes(
          "This information is for educational purposes only"
        )
      ) {
        aiResponse +=
          "\n\nThis information is for educational purposes only. Please consult a healthcare professional for medical advice.";
      }

      return aiResponse;
    } catch (error) {
      // console.error('Error getting AI response:', error);
      // if (error.response) {
      //   console.log('Error Response:', error.response.data); // Log error response
      //   console.log('Error Status:', error.response.status); // Log status code
      // }
      return "I apologize, but I'm having trouble connecting to the server. Please try again later.\n\nThis information is for educational purposes only. Please consult a healthcare professional for medical advice.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    const aiResponse = await getAIResponse(inputText);

    const botResponse = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      sender: "bot",
      timestamp: new Date(),
      isMarkdown: true,
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsLoading(false);
  };

  const handlePresetQuestion = async (question) => {
    const userMessage = {
      id: Date.now().toString(),
      text: question.text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const aiResponse = await getAIResponse(question.text);

    const botResponse = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      sender: "bot",
      timestamp: new Date(),
      isMarkdown: true,
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[999]">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-[#2563EB] to-[#EF4444] rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-white animate-pulse"
        >
          <MessageCircle size={24} />
          <span className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
          <span className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping delay-150" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[1000] md:inset-auto md:bottom-5 md:right-5 md:w-96 md:h-[500px] bg-white rounded-none md:rounded-lg shadow-xl flex flex-col overflow-hidden transition-all duration-300">
          <div className="bg-gradient-to-r from-[#2563EB] to-[#EF4444] p-3 text-white flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="mr-2" size={20} />
              <h3 className="font-medium">IlaroCARE Health Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
              >
                <Minimize2 size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <ChatArea
            messages={messages}
            presetQuestions={presetQuestions}
            onPresetQuestionClick={handlePresetQuestion}
            chatEndRef={chatEndRef}
            isLoading={isLoading}
          />

          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about health conditions..."
                className="flex-1 border border-gray-300 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className={`bg-gradient-to-r from-[#2563EB] to-[#EF4444] text-white p-2 rounded-r-lg ${!inputText.trim() || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90"
                  }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;