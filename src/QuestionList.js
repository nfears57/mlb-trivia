// QuestionList.js
import React, { useState, useEffect } from 'react';
import Questions from './Questions';
import StarsPopup from './StarsPopup';
import questionsData from './questions.json';
import './QuestionList.css';

const getRandomQuestion = (difficulty) => {
  const filteredQuestions = questionsData.filter((q) => q.difficulty === difficulty);
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  return filteredQuestions[randomIndex];
};

const selectQuestions = () => {
  const selectedEasy = getRandomQuestion('Easy');
  const selectedMedium = getRandomQuestion('Medium');
  const selectedHard = getRandomQuestion('Hard');

  return [selectedEasy, selectedMedium, selectedHard];
};

const QuestionList = ({ onAnswer }) => {
  const localStorageKey = 'selectedQuestions';
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [showStarsPopup, setShowStarsPopup] = useState(false);

  useEffect(() => {
    // Check if there are previously selected questions in local storage
    const storedQuestions = localStorage.getItem(localStorageKey);

    if (storedQuestions) {
      setSelectedQuestions(JSON.parse(storedQuestions));
    } else {
      // If no stored questions, select new questions
      const newSelectedQuestions = selectQuestions();
      // Save the selected questions to local storage
      localStorage.setItem(localStorageKey, JSON.stringify(newSelectedQuestions));
      setSelectedQuestions(newSelectedQuestions);
    }

    // Schedule a daily reset at 8:00 AM EST
    const now = new Date();
    const nextResetTime = new Date(now);
    nextResetTime.setHours(8, 0, 0, 0);
    if (now.getHours() >= 8) {
      nextResetTime.setDate(nextResetTime.getDate() + 1);
    }

    const timeUntilReset = nextResetTime - now;

    const resetQuestions = () => {
      const newSelectedQuestions = selectQuestions();
      // Save the selected questions to local storage
      localStorage.setItem(localStorageKey, JSON.stringify(newSelectedQuestions));
      setSelectedQuestions(newSelectedQuestions);
      setCorrectAnswers(0);
      setQuestionsCompleted(0);
      setShowStarsPopup(false);
    };

    // Set timeout for the next daily reset
    const resetTimeout = setTimeout(resetQuestions, timeUntilReset);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(resetTimeout);
  }, []); // Empty dependency array ensures this effect runs once on mount

  const handleAnswer = (answer) => {
    onAnswer(answer);

    // Check if the answer is correct
    const isCorrect = answer.isCorrect;

    // Increment the correct answers count if the answer is correct
    if (isCorrect) {
      setCorrectAnswers((prevCorrectAnswers) => prevCorrectAnswers + 1);
    }

    // Increment the questions completed count
    setQuestionsCompleted((prevQuestionsCompleted) => prevQuestionsCompleted + 1);

    // If all questions are completed, show the StarsPopup
    if (questionsCompleted === selectedQuestions.length) {
      setShowStarsPopup(true);
    }
  };

  const handleStarsPopupClose = () => {
    // Reset states and select new questions
    setShowStarsPopup(false);
    const newSelectedQuestions = selectQuestions();
    // Save the selected questions to local storage
    localStorage.setItem(localStorageKey, JSON.stringify(newSelectedQuestions));
    setSelectedQuestions(newSelectedQuestions);
    setCorrectAnswers(0);
    setQuestionsCompleted(0);
  };

  return (
    <div>
      {selectedQuestions.map((selectedQuestion) => (
        <Questions
          key={selectedQuestion.id}
          {...selectedQuestion}
          onAnswer={(answer) => {
            handleAnswer(answer);
          }}
        />
      ))}
      {showStarsPopup && (
        <StarsPopup
          totalQuestions={selectedQuestions.length}
          correctAnswers={correctAnswers}
          onClose={handleStarsPopupClose}
        />
      )}
    </div>
  );
};

export default QuestionList;



