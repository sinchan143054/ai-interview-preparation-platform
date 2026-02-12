function evaluateAnswer(userAnswer, modelAnswer) {
const user = userAnswer.toLowerCase();
const model = modelAnswer.toLowerCase();

// keyword matching (basic NLP)
const userWords = new Set(user.split(" "));
const modelWords = new Set(model.split(" "));

let matchCount = 0;
modelWords.forEach(word => {
if (userWords.has(word)) matchCount++;
});

const relevanceScore = Math.min(
Math.round((matchCount / modelWords.size) * 100),
100
);

// confidence detection
const confidenceWords = ["confident", "clearly", "definitely", "sure"];
let confidenceScore = 0;
confidenceWords.forEach(w => {
if (user.includes(w)) confidenceScore += 20;
});
confidenceScore = Math.min(confidenceScore, 100);

// sentiment
let sentiment = "neutral";
if (confidenceScore > 40) sentiment = "positive";

return {
score: relevanceScore,
sentiment: sentiment,
feedback:
relevanceScore > 70
? "Strong answer with good clarity"
: "Answer needs more detail and structure"
};
}

module.exports = evaluateAnswer;
