import React from 'react';

const PresetQuestions = ({ questions, onQuestionClick }) => {
  return (
    <div className="mt-4 animate-fadeIn">
      <p className="text-sm text-gray-500 mb-2">You can ask me about:</p>
      <div className="space-y-2">
        {questions.map((question) => (
          <button
            key={question.id}
            onClick={() => onQuestionClick(question)}
            className="w-full text-left p-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {question.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetQuestions;