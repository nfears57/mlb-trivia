import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Question from './Questions';

describe('Question component', () => {
  const questionData = {
    id: 1,
    question: 'What is the capital of France?',
    difficulty: 'Easy',
    answers: ['Paris', 'Berlin', 'Madrid'],
  };

  test('renders question and input boxes correctly', () => {
    render(<Question {...questionData} onAnswer={() => {}} />);
    
    const questionElement = screen.getByText(questionData.question);
    expect(questionElement).toBeInTheDocument();

    const inputBoxes = screen.getAllByPlaceholderText(/Type answer \d+ here/);
    expect(inputBoxes).toHaveLength(questionData.answers.length);
  });

  test('submits answer correctly', () => {
    const onAnswerMock = jest.fn();
    render(<Question {...questionData} onAnswer={onAnswerMock} />);

    const inputBoxes = screen.getAllByPlaceholderText(/Type answer \d+ here/);
    inputBoxes.forEach((box, index) => {
      fireEvent.change(box, { target: { value: questionData.answers[index] } });
    });

    const submitButton = screen.getByText('Submit Answer');
    fireEvent.click(submitButton);

    expect(onAnswerMock).toHaveBeenCalledWith({
      question: questionData.question,
      difficulty: questionData.difficulty,
      typedAnswers: questionData.answers,
      isCorrect: true, // Adjust based on the correct answers
    });
  });
});
