import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "https://ai-interview-preparation-platform.onrender.com";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  const startInterview = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/interview/start`);
      setQuestion(res.data.question);
      setResult(null);
      setAnswer("");
    } catch (error) {
      console.error(error);
      alert("Error starting interview");
    }
  };

  const submitAnswer = async () => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/interview/submit`,
        { answer }
      );
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Error submitting answer");
    }
  };

  return (
    <div className="container">
      <h1>AI Interview Platform</h1>

      {!question && (
        <button onClick={startInterview}>Start Interview</button>
      )}

      {question && !result && (
        <>
          <h3>{question}</h3>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />
          <br />
          <button onClick={submitAnswer}>Submit Answer</button>
        </>
      )}

      {result && (
        <div className="result">
          <h2>Score: {result.score}</h2>
          <p>Feedback: {result.feedback}</p>
          <button onClick={startInterview}>Try Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
