import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "https://ai-interview-preparation-platform.onrender.com";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [interviewId, setInterviewId] = useState(null);
  const [result, setResult] = useState(null);

  const startInterview = async () => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/interview/start`,
        {
          userId: "demoUser123",
          domain: "mern",
          difficulty: "easy"
        }
      );

      setInterviewId(res.data.interviewId);
      setQuestion(res.data.question.question);
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
        `${API_BASE}/api/interview/answer`,
        {
          interviewId,
          userAnswer: answer
        }
      );

      if (res.data.nextQuestion) {
        setQuestion(res.data.nextQuestion.question);
        setAnswer("");
      } else {
        setResult("Interview Finished");
        setQuestion("");
      }

    } catch (error) {
      console.error(error);
      alert("Error submitting answer");
    }
  };

  return (
    <div className="container">
      <h1>AI Interview Platform</h1>

      {!question && !result && (
        <button onClick={startInterview}>
          Start Interview
        </button>
      )}

      {question && (
        <>
          <h3>{question}</h3>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />
          <br />
          <button onClick={submitAnswer}>
            Submit Answer
          </button>
        </>
      )}

      {result && (
        <div>
          <h2>{result}</h2>
          <button onClick={startInterview}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
