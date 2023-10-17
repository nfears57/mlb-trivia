import React, { useState, useEffect } from 'react';
import QuestionList from './QuestionList';
import questionsData from './questions.json';

const App = () => {
  const [userAnswers, setUserAnswers] = useState([]);

  // Load user answers from localStorage on component mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem('userAnswers');
    if (savedAnswers) {
      setUserAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  // Save user answers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
  }, [userAnswers]);

  const handleAnswer = (answer) => {
    // Check if the user has already answered this question
    const hasAnswered = userAnswers.some(
      (ua) => ua.question === answer.question && ua.difficulty === answer.difficulty
    );

    if (!hasAnswered) {
      setUserAnswers([...userAnswers, answer]);
    }
  };

  return (
    <div>
      <QuestionList questionsData={questionsData} onAnswer={handleAnswer} />
    </div>
  );
};

export default App;
