<<<<<<< HEAD
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import os

app = FastAPI(title="AI Interview Evaluation Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EvaluationRequest(BaseModel):
    userAnswer: str
    modelAnswer: str
    difficulty: str = "medium"

class EvaluationResponse(BaseModel):
    aiScore: int
    technical: int
    communication: int
    confidence: int
    sentiment: str
    feedback: str

@app.get("/")
def home():
    return {"message": "AI Evaluation Service Running", "status": "active"}

@app.post("/evaluate", response_model=EvaluationResponse)
def evaluate(data: EvaluationRequest):
    try:
        user_answer = data.userAnswer.strip()
        model_answer = data.modelAnswer.strip()
        difficulty = data.difficulty

        if not user_answer:
            return EvaluationResponse(
                aiScore=0,
                technical=0,
                communication=0,
                confidence=0,
                sentiment="neutral",
                feedback="No answer provided"
            )

        # Clean text
        user_clean = user_answer.lower()
        model_clean = model_answer.lower()

        # ========== TECHNICAL SCORE (Based on Similarity) ==========
        vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        vectors = vectorizer.fit_transform([user_clean, model_clean])
        similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
        knowledge_score = similarity * 100

        # Adjust based on difficulty
        if difficulty == "easy":
            technical = min(int((knowledge_score / 100) * 25), 25)
        elif difficulty == "hard":
            technical = int((knowledge_score / 100) * 22)  # Slightly harder threshold
        else:  # medium
            technical = int((knowledge_score / 100) * 25)

        # ========== COMMUNICATION SCORE (Clarity & Structure) ==========
        word_count = len(user_answer.split())
        sentences = len(re.findall(r'[.!?]', user_answer))

        communication = 5  # Base score

        # Sentence structure bonus
        if sentences >= 4:
            communication += 8
        elif sentences >= 2:
            communication += 5

        # Word count bonus (depth of answer)
        if word_count > 100:
            communication += 7
        elif word_count > 50:
            communication += 5
        elif word_count > 20:
            communication += 3

        # Grammar indicators (basic)
        if user_answer[0].isupper() and sentences > 0:
            communication += 2  # Capitalization

        # Connector words (shows structured thinking)
        connectors = ['however', 'therefore', 'additionally', 'furthermore', 'because', 'since', 'while']
        for word in connectors:
            if word in user_clean:
                communication += 1

        communication = min(communication, 25)

        # ========== CONFIDENCE SCORE (Tone Analysis) ==========
        confident_words = [
            'definitely', 'clearly', 'important', 'ensures', 'helps', 'improves',
            'always', 'never', 'must', 'will', 'should', 'essential', 'critical',
            'precisely', 'exactly', 'certainly', 'obviously', 'absolutely', 'indeed'
        ]
        hesitation_words = [
            'maybe', 'i think', 'not sure', 'probably', 'guess', 'might',
            'perhaps', 'possibly', 'kind of', 'sort of', 'i believe', 'i feel',
            'idk', "i don't know", 'dunno', 'umm', 'uh', 'like', 'you know'
        ]

        confidence = 10  # Base score
        
        # Check for very short or meaningless answers
        if word_count < 10:
            confidence = 2
        # Check if answer is just variations of "idk"
        elif any(word in user_clean for word in ['idk', "don't know", 'dunno', 'no idea']):
            confidence = 1  # Very low confidence for "idk" type answers
        else:
            for word in confident_words:
                if word in user_clean:
                    confidence += 2

            for word in hesitation_words:
                if word in user_clean:
                    confidence -= 4  # Increased penalty

            # Length confidence (longer detailed answers show confidence)
            if word_count > 80:
                confidence += 5
            elif word_count > 40:
                confidence += 3

        confidence = max(min(confidence, 25), 1)  # Between 1 and 25

        # ========== OVERALL SCORE ==========
        overall = min(technical + communication + confidence, 100)

        # ========== SENTIMENT ANALYSIS ==========
        if overall >= 70:
            sentiment = "positive"
        elif overall >= 50:
            sentiment = "neutral"
        else:
            sentiment = "needs_improvement"

        # ========== FEEDBACK GENERATION ==========
        feedback_parts = []

        if technical >= 18:
            feedback_parts.append("Strong technical understanding.")
        elif technical >= 12:
            feedback_parts.append("Good grasp of concepts.")
        else:
            feedback_parts.append("Review core concepts.")

        if communication >= 18:
            feedback_parts.append("Well-structured answer.")
        elif communication >= 12:
            feedback_parts.append("Clear communication.")
        else:
            feedback_parts.append("Work on clarity and structure.")

        if confidence >= 18:
            feedback_parts.append("Confident delivery.")
        elif confidence >= 12:
            feedback_parts.append("Good confidence level.")
        else:
            feedback_parts.append("Practice to build confidence.")

        feedback = " ".join(feedback_parts)

        return EvaluationResponse(
            aiScore=overall,
            technical=technical,
            communication=communication,
            confidence=confidence,
            sentiment=sentiment,
            feedback=feedback
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("AI_SERVICE_PORT", 8002))
    uvicorn.run(app, host="0.0.0.0", port=port)
=======
from fastapi import FastAPI
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import uvicorn

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Evaluation Service Running"}

@app.post("/evaluate")
def evaluate(data: dict):
    user = data["userAnswer"]
    model = data["modelAnswer"]

    # ---------- CLEAN TEXT ----------
    user_clean = user.lower()
    model_clean = model.lower()

    # ---------- SIMILARITY (KNOWLEDGE CHECK) ----------
    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([user_clean, model_clean])
    similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    knowledge_score = similarity * 100

    # ---------- LENGTH CHECK (DEPTH) ----------
    word_count = len(user.split())

    if word_count > 120:
        depth = 25
    elif word_count > 60:
        depth = 18
    elif word_count > 30:
        depth = 12
    else:
        depth = 5

    # ---------- COMMUNICATION ----------
    sentences = len(re.findall(r'[.!?]', user))
    if sentences >= 4:
        communication = 25
    elif sentences >= 2:
        communication = 18
    else:
        communication = 10

    # ---------- CONFIDENCE ----------
    confident_words = ["definitely","clearly","important","ensures","helps","improves"]
    hesitation_words = ["maybe","i think","not sure","probably","guess"]

    conf = 10
    for w in confident_words:
        if w in user_clean:
            conf += 3

    for w in hesitation_words:
        if w in user_clean:
            conf -= 2

    confidence = max(min(conf,25),5)

    # ---------- TECH SCORE ----------
    technical = int((knowledge_score/100)*25)

    overall = technical + communication + confidence + depth
    overall = min(overall,100)

    sentiment = "positive" if overall > 60 else "neutral"

    return {
        "aiScore": overall,
        "technical": technical,
        "communication": communication,
        "confidence": confidence,
        "sentiment": sentiment
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)
>>>>>>> 8003e494214bb2133a2047589e7457e31cba5851
