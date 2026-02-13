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

  /* ================= START INTERVIEW ================= */
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

    } catch (error) {
      alert("⏳ Server waking up (free hosting). Click again in 10 sec.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBMIT ANSWER ================= */
  const submitAnswer = async () => {
    if (!answer) {
      alert("Type answer first");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE}/api/interview/answer`, {
        interviewId,
        userAnswer: answer
      });

      // next question
      if (res.data.nextQuestion) {
        setQuestion(res.data.nextQuestion.question);
        setAnswer("");
        setLoading(false);
        return;
      }

      // finished interview
      if (res.data.message === "Interview finished") {
        setQuestion("");
        await finishInterview();
      }

    } catch (err) {
      alert("Server slow 😅 wait 5 sec & click again");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GET FINAL SCORE ================= */
  const finishInterview = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/interview/finish`, {
        interviewId
      });

      const score = res.data;

      setResult(`
🎉 Interview Completed!

⭐ Overall Score: ${score.overallScore}/100

🧠 Technical: ${score.technical}/25
💬 Communication: ${score.communication}/25
🔥 Confidence: ${score.confidence}/25
      `);

    } catch (err) {
      setResult("Interview finished but score error");
    }
  };

  return (
    <div className="container">
      <h1>🎤 AI Interview Platform</h1>

      {/* START BUTTON */}
      {!question && !result && (
        <button onClick={startInterview} disabled={loading}>
          {loading ? "⏳ Starting Interview..." : "Start Interview"}
        </button>
      )}

      {/* QUESTION */}
      {question && (
        <>
          <h3>{question}</h3>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />

          <br />

          <button onClick={submitAnswer} disabled={loading}>
            {loading ? "⏳ Evaluating..." : "Submit Answer"}
          </button>
        </>
      )}

      {/* RESULT */}
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
