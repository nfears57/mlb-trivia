// Questions.js
import React, { useState } from 'react';
import './Questions.css';

const Question = ({ id, question, difficulty, answers: answers, onAnswer }) => {
  // Ensure that answer is always an array
  const answersArray = Array.isArray(answers) ? answers : [answers];

  const [typedAnswers, setTypedAnswers] = useState(Array(answersArray.length).fill(''));
  const [isCorrect, setIsCorrect] = useState(Array(answersArray.length).fill(null));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswer = () => {
    console.log(answers)
    if (!answersArray || !typedAnswers) {
      console.error('Answers or typedAnswers are undefined.');
      return;
    }

    const areAnswersCorrect = typedAnswers.map((typedAnswer, index) => {
      const correctAnswer = answersArray[index];
      return (
        correctAnswer &&
        typedAnswer.toLowerCase() === correctAnswer.toLowerCase()
      );
    });

    setIsCorrect(areAnswersCorrect);
    onAnswer({
      question,
      difficulty,
      typedAnswers,
      isCorrect: areAnswersCorrect.includes(true),
    });
    setIsSubmitted(true);
  };

  const handleInputChange = (index, value) => {
    setTypedAnswers((prevTypedAnswers) => {
      const newTypedAnswers = [...prevTypedAnswers];
      newTypedAnswers[index] = value;
      return newTypedAnswers;
    });

    // Reset the correctness indicator when typing
    setIsCorrect((prevIsCorrect) => {
      const newIsCorrect = [...prevIsCorrect];
      newIsCorrect[index] = null;
      return newIsCorrect;
    });
  };

  return (
    <div>
      <h3>{question}</h3>
      <div>
        {answersArray.map((_, index) => (
          <div key={index}>
            <input
              type="text"
              value={typedAnswers[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder={`Type answer ${index + 1} here`}
              disabled={isSubmitted}
            />
          </div>
        ))}
      </div>
      <button onClick={handleAnswer} disabled={isSubmitted}>
        Submit Answer
      </button>
      {isSubmitted &&
        isCorrect.includes(true) ? (
          <div className="correct-banner">Correct!</div>
        ) : (
          isCorrect.includes(false) && (
            <div className="incorrect-banner">Incorrect!</div>
          )
        )}
    </div>
  );
};

export default Question;

