import React, { useState } from 'react';
import './App.css';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function App() {
  const [quizData, setQuizData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      const jsonData = JSON.parse(content);
      setQuizData(shuffleArray(jsonData)); // Shuffle the questions
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
        <Quizlet quizData={quizData} onRedoQuiz={handleRedoQuiz} onCancelQuiz={() => setQuizData(null)} />
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

function Quizlet({ quizData, onRedoQuiz, onCancelQuiz }) {
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
      <h2 style={{color: 'white'}}>Quiz</h2>
      {currentQuestionIndex < quizData.length ? (
        <div className="quizlet">
          <div style={{color: 'white'}} className="question">{quizData[currentQuestionIndex].question}</div>
          <br/>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your answer"
          />
          <button onClick={handleSubmitAnswer}>Submit Answer</button>
          <button onClick={onCancelQuiz}>Cancel Quiz</button>
          <a style={{color: 'white'}}>score: {score}</a>
        </div>
      ) : (
        <div className="quizlet">
          <h3 style={{color: 'white'}}>Quiz Completed</h3>
          <p style={{color: 'white'}}>Your score: {score}/{quizData.length}</p>
          <button onClick={onRedoQuiz}>Redo Quiz / Upload Different file</button>
        </div>
      )}
    </div>
  );
}

export default App;
