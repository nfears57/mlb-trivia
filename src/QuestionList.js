// QuestionList.js
import React, { useState, useEffect } from 'react';
import Questions from './Questions';
import StarsPopup from './StarsPopup';
import questionsData from './questions.json';
import './QuestionList.css';

const QuestionList = ({ onAnswer }) => {
  const localStorageKey = 'selectedQuestions';
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [allQuestionsCompleted, setAllQuestionsCompleted] = useState(false);

  useEffect(() => {
    const selectQuestions = () => {
      const selectedEasy = getRandomQuestion('Easy');
      const selectedMedium = getRandomQuestion('Medium');
      const selectedHard = getRandomQuestion('Hard');

      const newSelectedQuestions = [selectedEasy, selectedMedium, selectedHard];

      // Save the selected questions to local storage
      localStorage.setItem(localStorageKey, JSON.stringify(newSelectedQuestions));

      setSelectedQuestions(newSelectedQuestions);
      setCorrectAnswers(0);
      setAllQuestionsCompleted(false);
    };

    // Check if there are previously selected questions in local storage
    const storedQuestions = localStorage.getItem(localStorageKey);

    if (storedQuestions) {
      setSelectedQuestions(JSON.parse(storedQuestions));
    } else {
      // If no stored questions, select new questions
      selectQuestions();
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
      selectQuestions();
    };

    // Set timeout for the next daily reset
    const resetTimeout = setTimeout(resetQuestions, timeUntilReset);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(resetTimeout);
  }, []); // Empty dependency array ensures this effect runs once on mount

  const getRandomQuestion = (difficulty) => {
    const filteredQuestions = questionsData.filter((q) => q.difficulty === difficulty);
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    return filteredQuestions[randomIndex];
  };

  const handleAnswer = (answer) => {
    onAnswer(answer);

    // Check if the answer is correct
    const isCorrect = answer.isCorrect;

    // Increment the correct answers count if the answer is correct
    if (isCorrect) {
      setCorrectAnswers((prevCorrectAnswers) => prevCorrectAnswers + 1);
    }

    // Check if all questions are completed
    if (correctAnswers + 1 === selectedQuestions.length) {
      setAllQuestionsCompleted(true);
    }
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
      {allQuestionsCompleted && (
        <StarsPopup
          totalQuestions={selectedQuestions.length}
          correctAnswers={correctAnswers}
        />
      )}
    </div>
  );
};

export default QuestionList;

