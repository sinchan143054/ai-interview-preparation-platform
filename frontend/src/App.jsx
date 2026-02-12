import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "https://ai-interview-preparation-platform-2.onrender.com";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [interviewId, setInterviewId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔵 START INTERVIEW
  const startInterview = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE}/api/interview/start`,
        {
          userId: "69731c4f7fe79112d4cdaa3d",
          domain: "frontend",
          difficulty: "easy"
        }
      );

      setInterviewId(res.data.interviewId);
      setQuestion(res.data.question.question);
      setResult(null);
      setAnswer("");

    } catch (error) {
      console.error(error);
      alert("Server waking up... wait 30 sec and click again");
    } finally {
      setLoading(false);
    }
  };

  // 🟣 SUBMIT ANSWER
  const submitAnswer = async () => {
    try {
      setLoading(true);

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
        setResult("Interview Finished 🎉");
        setQuestion("");
      }

    } catch (error) {
      console.error(error);
      alert("Server slow (free hosting). Wait few seconds.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Interview Platform</h1>

      {loading && <p>⏳ Loading... please wait (free server waking)</p>}

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
