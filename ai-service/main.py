from fastapi import FastAPI
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import uvicorn

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Evaluation Service Running 🚀"}

@app.post("/evaluate")
def evaluate(data: dict):
    user = data["userAnswer"]
    model = data["modelAnswer"]

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([user, model])

    similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    score = int(similarity * 100)

    return {
        "aiScore": score,
        "technical": min(score // 4, 25),
        "communication": min(score // 4, 25),
        "confidence": min(score // 4, 25),
        "sentiment": "positive" if score > 40 else "neutral"
    }

# IMPORTANT: correct indentation
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)
