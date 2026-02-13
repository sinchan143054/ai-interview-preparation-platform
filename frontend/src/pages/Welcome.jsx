import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={{
      height: "100vh",
      background: "#f5f7fb",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial"
    }}>
      <div style={{
        background: "white",
        padding: "50px",
        borderRadius: "12px",
        width: "500px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{marginBottom:"10px"}}>AI Interview Platform</h1>
        <p style={{color:"gray"}}>
          Practice real interview with AI evaluation and performance report
        </p>

        <button
          onClick={()=>navigate("/role")}
          style={{
            marginTop:"30px",
            padding:"12px 30px",
            fontSize:"16px",
            background:"#2563eb",
            color:"white",
            border:"none",
            borderRadius:"8px",
            cursor:"pointer"
          }}
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}
