import React, { useState, useEffect } from 'react';
import QuestionList from './QuestionList';
import questionsData from './questions.json';
import './App.css'
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
      <div class="title-container">
        <div class="title">MLB Trivia</div>
        <div class="subtitle">The Daily Trivia Game</div>
      </div>
      <QuestionList questionsData={questionsData} onAnswer={handleAnswer} />
    </div>
  );
};

export default App;
