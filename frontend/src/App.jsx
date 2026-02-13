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

  const startInterview = async () => {
    try {
      setLoading(true);
      setResult(null);

      const res = await axios.post(`${API_BASE}/api/interview/start`, {
        userId: "69731c4f7fe79112d4cdaa3d",
        domain: "frontend",
        difficulty: "easy"
      });

      setInterviewId(res.data.interviewId);
      setQuestion(res.data.question.question);
      setAnswer("");

    } catch {
      alert("Server waking up. Click again.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer) return alert("Type answer");

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE}/api/interview/answer`, {
        interviewId,
        userAnswer: answer
      });

      if (res.data.nextQuestion) {
        setQuestion(res.data.nextQuestion.question);
        setAnswer("");
        setLoading(false);
        return;
      }

      if (res.data.message === "Interview finished") {
        setQuestion("");
        await finishInterview();
      }

    } catch {
      alert("Server slow, click again");
    } finally {
      setLoading(false);
    }
  };

  const finishInterview = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/interview/finish`, {
        interviewId
      });

      const s = res.data;

      setResult(`
Interview Completed

Overall Score: ${s.overallScore}/100
Technical: ${s.technical}/25
Communication: ${s.communication}/25
Confidence: ${s.confidence}/25
      `);

    } catch {
      setResult("Score error");
    }
  };

  return (
    <div className="container">
      <h1>AI Interview Platform</h1>

      {!question && !result && (
        <button onClick={startInterview} disabled={loading}>
          {loading ? "Starting..." : "Start Interview"}
        </button>
      )}

      {question && (
        <>
          <h3>{question}</h3>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer"
          />

          <br />

          <button onClick={submitAnswer} disabled={loading}>
            {loading ? "Evaluating..." : "Submit"}
          </button>
        </>
      )}

      {result && (
        <div>
          <h2 style={{ whiteSpace: "pre-line" }}>{result}</h2>
          <button onClick={startInterview}>Try Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
