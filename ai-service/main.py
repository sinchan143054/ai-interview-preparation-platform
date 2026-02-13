from fastapi import FastAPI
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import uvicorn

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Advanced AI Evaluation Running 🚀"}


@app.post("/evaluate")
def evaluate(data: dict):
    user = data["userAnswer"].lower()
    model = data["modelAnswer"].lower()

    # ========= 1. Similarity score =========
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([user, model])
    similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    similarity_score = similarity * 100

    # ========= 2. Keyword match =========
    model_keywords = list(set(re.findall(r'\b\w+\b', model)))
    user_keywords = list(set(re.findall(r'\b\w+\b', user)))

    match_count = len(set(model_keywords) & set(user_keywords))
    keyword_score = (match_count / (len(model_keywords)+1)) * 100

    # ========= 3. Length score =========
    length_score = min(len(user.split()) * 2, 100)

    # ========= 4. Confidence detection =========
    confidence_words = ["definitely", "clearly", "used", "helps", "important"]
    confidence_score = 0
    for w in confidence_words:
        if w in user:
            confidence_score += 10
    confidence_score = min(confidence_score, 100)

    # ========= FINAL AI SCORE =========
    final_score = (
        similarity_score * 0.4 +
        keyword_score * 0.2 +
        length_score * 0.2 +
        confidence_score * 0.2
    )

    final_score = int(final_score)

    return {
        "aiScore": final_score,
        "technical": min(final_score // 4, 25),
        "communication": min(len(user.split()), 25),
        "confidence": min(confidence_score // 4, 25),
        "sentiment": "positive" if final_score > 50 else "neutral"
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)
