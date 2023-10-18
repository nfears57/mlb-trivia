import React, { useState, useEffect } from 'react';
import QuestionList from './QuestionList';
import questionsData from './questions.json';
import './App.css';
import './AppLight.css'; // Import light mode styles
import './AppDark.css'; // Import dark mode styles

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  useEffect(() => {
    // Apply the dark mode styles dynamically
    const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');
    if (darkModeStylesheet) {
      darkModeStylesheet.disabled = !isDarkMode;
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <div className="title-container">
        <div className="title">MLB Trivia</div>
        <div className="subtitle">The Daily Trivia Game</div>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {isDarkMode ? '🌞' : '🌜'}
        </button>
      </div>
      <QuestionList questionsData={questionsData} onAnswer={handleAnswer} />
    </div>
  );
};

export default App;
