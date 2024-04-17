import React, { useState } from 'react';
import './App.css';

function App() {
  const [quizData, setQuizData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      const jsonData = JSON.parse(content);
      setQuizData(jsonData);
    };

    reader.readAsText(file);
  };

  const handleRedoQuiz = () => {
    setQuizData(null);
  };

  return (
    <div className="app-container">
      {!quizData ? (
        <FileUploader onFileUpload={handleFileUpload} />
      ) : (
        <Quizlet quizData={quizData} onRedoQuiz={handleRedoQuiz} />
      )}
    </div>
  );
}

function FileUploader({ onFileUpload }) {
  return (
    <div className="file-uploader">
      <input id="file-upload" type="file" accept=".json" onChange={onFileUpload} />
      <label htmlFor="file-upload" className="file-upload-label">Upload note/JSON File</label>
    </div>
  );
}

function Quizlet({ quizData, onRedoQuiz }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);

  const handleSubmitAnswer = () => {
    if (userAnswer.toLowerCase() === quizData[currentQuestionIndex].answer.toLowerCase()) {
      setScore(score + 1);
    } else {
      alert('Incorrect! Correct Answer: ' + quizData[currentQuestionIndex].answer.toLowerCase());
    }

    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setUserAnswer('');
  };

  return (
    <div className="quizlet-container">
      <h2>Quiz</h2>
      {currentQuestionIndex < quizData.length ? (
        <div className="quizlet">
          <div className="question">{quizData[currentQuestionIndex].question}</div>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your answer"
          />
          <button onClick={handleSubmitAnswer}>Submit Answer</button>
          <a>score: {score}</a>
        </div>
      ) : (
        <div className="quizlet">
          <h3>Quiz Completed</h3>
          <p>Your score: {score}/{quizData.length}</p>
          <button onClick={onRedoQuiz}>Redo Quiz</button>
          <button onClick={() => onRedoQuiz()}>Upload Different note/JSON</button>
        </div>
      )}
    </div>
  );
}

export default App;
