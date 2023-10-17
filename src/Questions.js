import React, { useState } from 'react';
import './Questions.css';

const Question = ({ id, question, difficulty, answer, onAnswer }) => {
  // Ensure that answer is always an array
  const answersArray = Array.isArray(answer) ? answer : [answer];

  const [typedAnswers, setTypedAnswers] = useState(Array(answersArray.length).fill(''));
  const [isCorrect, setIsCorrect] = useState(Array(answersArray.length).fill(null));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswer = () => {
    const areAnswersCorrect = typedAnswers.map((typedAnswer, index) =>
      typedAnswer.toLowerCase() === answersArray[index].toLowerCase()
    );

    setIsCorrect(areAnswersCorrect);
    onAnswer({ question, difficulty, typedAnswers, isCorrect: areAnswersCorrect });
    setIsSubmitted(true);
  };

  const handleInputChange = (index, value) => {
    setTypedAnswers((prevTypedAnswers) => {
      const newTypedAnswers = [...prevTypedAnswers];
      newTypedAnswers[index] = value;
      return newTypedAnswers;
    });
  };

  return (
    <div>
      <h3>{question}</h3>
      <div>
        {/* Render input boxes for each possible answer */}
        {answersArray.map((_, index) => (
          <div key={index}>
            <input
              type="text"
              value={typedAnswers[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder={`Type answer ${index + 1} here`}
              disabled={isSubmitted} // Disable input after answering
            />
          </div>
        ))}
      </div>
      <button onClick={handleAnswer} disabled={isSubmitted}>
        Submit Answer
      </button>
      {isSubmitted &&
        (isCorrect.every((correct) => correct) ? (
          <div className="correct-banner">Correct!</div>
        ) : (
          <div className="incorrect-banner">Incorrect!</div>
        ))}
    </div>
  );
};

export default Question;

