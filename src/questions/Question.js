// Question.js
import React from "react";
// import "./../styles.css";
import "./questions.css";
const Question = ({ data, onAnswer }) => {
  return (
    <div>
      <h2>{data.question}</h2>
      <ul>
        {data.answers.map((answer, index) => (
          <li key={index} onClick={() => onAnswer(answer)}>
            {answer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
