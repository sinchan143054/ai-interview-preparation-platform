import { useState } from "react";

function App() {
  const [interviewId, setInterviewId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  const startInterview = async () => {
    const res = await fetch("http://localhost:5000/api/interview/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "67962ace9a8f495171d3f0db",
        domain: "frontend",
        difficulty: "easy"
      })
    });

    const data = await res.json();
    setInterviewId(data.interviewId);
    setQuestion(data.question);
  };

  const submitAnswer = async () => {
  const res = await fetch("http://localhost:5000/api/interview/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interviewId, userAnswer: answer })
  });

  const data = await res.json();
  setAnswer("");

  if (data.nextQuestion) {
    setQuestion(data.nextQuestion);
  } else if (data.message) {
    finishInterview();
  }
};


  const finishInterview = async () => {
    const res = await fetch("http://localhost:5000/api/interview/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interviewId })
    });

    const data = await res.json();
    setQuestion(null);
    setResult(data);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>AI Interview Platform</h1>

      {!interviewId && <button onClick={startInterview}>Start Interview</button>}

      {question && (
        <>
          <h3>{question.question}</h3>
          <textarea
            rows="5"
            cols="60"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <br /><br />
          <button onClick={submitAnswer}>Submit Answer</button>
        </>
      )}

      {result && (
        <>
          <h2>Interview Result</h2>
          <p>Overall: {result.overallScore}</p>
         <p>Technical: {result.skillSummary?.technical ?? 0}</p>
<p>Communication: {result.skillSummary?.communication ?? 0}</p>
<p>Confidence: {result.skillSummary?.confidence ?? 0}</p>

        </>
      )}
    </div>
  );
}

export default App;
