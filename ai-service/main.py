from fastapi import FastAPI
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import uvicorn

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Evaluation Service Running 🚀"}


# ===== CLEAN TEXT =====
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    return text


# ===== KEYWORD EXTRACTION =====
def get_keywords(text):
    words = clean_text(text).split()
    stopwords = {
        "is","the","a","an","and","or","to","of","for","in","on","with",
        "this","that","it","as","are","be","by","from","at","was","were"
    }
    return [w for w in words if w not in stopwords and len(w) > 2]


# ===== CONFIDENCE CHECK =====
def confidence_score(answer):
    confident_words = ["definitely","clearly","sure","confident","always","will"]
    hesitant_words = ["maybe","not sure","guess","probably","think"]

    score = 15

    for w in confident_words:
        if w in answer.lower():
            score += 5

    for w in hesitant_words:
        if w in answer.lower():
            score -= 5

    return max(min(score,25),5)


@app.post("/evaluate")
def evaluate(data: dict):
    user = data["userAnswer"]
    model = data["modelAnswer"]

    user_clean = clean_text(user)
    model_clean = clean_text(model)

    # ===== TF-IDF similarity =====
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([user_clean, model_clean])
    similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    similarity_score = int(similarity * 100)

    # ===== keyword matching =====
    model_keywords = set(get_keywords(model_clean))
    user_keywords = set(get_keywords(user_clean))

    if len(model_keywords) == 0:
        keyword_score = 0
    else:
        matched = model_keywords.intersection(user_keywords)
        keyword_score = int((len(matched) / len(model_keywords)) * 100)

    # ===== completeness (length check) =====
    length_score = min(len(user.split()) * 2, 100)

    # ===== final AI score =====
    final_score = int((similarity_score * 0.4) + (keyword_score * 0.4) + (length_score * 0.2))

    # ===== skill scoring =====
    technical = min(final_score // 4, 25)
    communication = min(len(user.split()) // 2, 25)
    confidence = confidence_score(user)

    sentiment = "positive" if final_score > 60 else "neutral"

    return {
        "aiScore": final_score,
        "technical": technical,
        "communication": communication,
        "confidence": confidence,
        "sentiment": sentiment
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)
