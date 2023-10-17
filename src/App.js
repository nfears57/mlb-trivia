import React, { useState, useEffect } from 'react';
import QuestionList from './QuestionList';
import questionsData from './questions.json';

const App = () => {
  const localStorageKey = 'userAnswers';
  const [userAnswers, setUserAnswers] = useState(() => {
    // Load user answers from localStorage on component mount
    const savedAnswers = localStorage.getItem(localStorageKey);
    return savedAnswers ? JSON.parse(savedAnswers) : [];
  });

  // Save user answers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(userAnswers));
  }, [userAnswers]);

  const handleAnswer = (answer) => {
    const hasAnswered = userAnswers.some(
      (ua) => ua.question === answer.question && ua.difficulty === answer.difficulty
    );

    if (!hasAnswered) {
      setUserAnswers((prevAnswers) => [...prevAnswers, answer]);
    }
  };

  return (
    <div>
      <QuestionList questionsData={questionsData} onAnswer={handleAnswer} />
    </div>
  );
};

export default App;
