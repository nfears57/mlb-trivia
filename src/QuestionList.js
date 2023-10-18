import React, { useState, useEffect } from 'react';
import Questions from './Questions';
import questionsData from './questions.json';
import './QuestionList.css';

const QuestionList = ({ onAnswer }) => {
  const localStorageKey = 'selectedQuestions';
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);

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
    if (answer.isCorrect) {
      setCorrectAnswers((prevCorrectAnswers) => prevCorrectAnswers + 1);
    }
  };

  return (
    <div>
      {selectedQuestions.map((selectedQuestion) => (
        <Questions
          key={selectedQuestion.id}
          {...selectedQuestion}
          onAnswer={(answer) => {
            onAnswer(answer);
            handleAnswer(answer);
          }}
        />
      ))}
      {correctAnswers === selectedQuestions.length && (
        <div className="score-banner">{`You got ${correctAnswers}/${selectedQuestions.length} correct!`}</div>
      )}
    </div>
  );
};

export default QuestionList;