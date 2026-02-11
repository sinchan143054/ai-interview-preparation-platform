import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "https://ai-interview-preparation-platform.onrender.com";

function App() {
  const [interviewId, setInterviewId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [finished, setFinished] = useState(false);

  const startInterview = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/interview/start`, {
        userId: "demoUser",
        domain: "mern",
        difficulty: "easy"
      });

      setInterviewId(res.data.interviewId);
      setQuestion(res.data.question.question);
      setFinished(false);
      setAnswer("");
    } catch (error) {
      console.error(error);
      alert("Error starting interview");
    }
  };

  const submitAnswer = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/interview/answer`, {
        interviewId,
        userAnswer: answer
      });

      if (res.data.message === "Interview finished") {
        setFinished(true);
        setQuestion("");
      } else {
        setQuestion(res.data.nextQuestion.question);
      }

      setAnswer("");
    } catch (error) {
      console.error(error);
      alert("Error submitting answer");
    }
  };

  return (
    <div className="container">
      <h1>AI Interview Platform</h1>

      {!question && !finished && (
        <button onClick={startInterview}>Start Interview</button>
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
          <button onClick={submitAnswer}>Submit Answer</button>
        </>
      )}

      {finished && (
        <div>
          <h2>Interview Completed 🎉</h2>
          <button onClick={startInterview}>Try Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
