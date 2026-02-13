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
