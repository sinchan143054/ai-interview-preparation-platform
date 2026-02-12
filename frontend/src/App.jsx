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

/* =========================
START INTERVIEW
========================= */
const startInterview = async () => {
try {
setLoading(true);

const res = await axios.post(`${API_BASE}/api/interview/start`, {
    userId: "demoUser",
    domain: "frontend",
    difficulty: "easy"
  });

  setInterviewId(res.data.interviewId);
  setQuestion(res.data.question.question);
  setResult(null);
  setAnswer("");

} catch (error) {
  console.error(error);
  alert("Server waking up... wait few seconds & click again");
} finally {
  setLoading(false);
}

};

/* =========================
SUBMIT ANSWER
========================= */
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

  // NEXT QUESTION
  if (res.data.nextQuestion) {
    setQuestion(res.data.nextQuestion.question);
    setAnswer("");
    return;
  }

  // INTERVIEW FINISHED + SCORE
  if (res.data.finished) {
    const s = res.data.score;

    setResult(`
🎉 Interview Completed!

⭐ Overall Score: ${s.overallScore}

🧠 Technical: ${s.technical}
💬 Communication: ${s.communication}
🔥 Confidence: ${s.confidence}
`);

    setQuestion("");
  }

} catch (error) {
  console.error(error);
  alert("Server slow (free hosting). Please wait...");
} finally {
  setLoading(false);
}

};

return ( <div className="container"> <h1>AI Interview Platform</h1>

  {/* START BUTTON */}
  {!question && !result && (
    <button onClick={startInterview} disabled={loading}>
      {loading ? "Starting..." : "Start Interview"}
    </button>
  )}

  {/* QUESTION SECTION */}
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
        {loading ? "Evaluating..." : "Submit Answer"}
      </button>
    </>
  )}

  {/* RESULT SECTION */}
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
