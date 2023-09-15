"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const llm_api_1 = require("llm-api");
const zod_gpt_1 = require("zod-gpt");
const zod_1 = __importDefault(require("zod"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/api/topics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const TextSchema = zod_1.default.object({
            text: zod_1.default.string().min(1).max(10000)
        });
        const text = TextSchema.parse(req.body);
        const topics = yield getTopics(openai, text.text);
        return res.status(200).json(topics);
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: error.message });
        }
    }
}));
app.post('/api/questions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const TopicSchema = zod_1.default.object({
            topic: zod_1.default.string().min(1).max(100),
            summary: zod_1.default.string().default(""),
            quantity: zod_1.default.number().int().min(1).max(10).default(1),
            type: zod_1.default.enum(["multiple choice", "true/false", "matching"]).optional()
        });
        const TopicsSchema = zod_1.default.array(TopicSchema).max(20);
        const topics = TopicsSchema.parse(req.body);
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        const promises = Promise.allSettled(topics.map((topic) => __awaiter(void 0, void 0, void 0, function* () {
            const topicQuestions = yield getQuestions(openai, topic, topic.quantity, topic.type);
            res.write(`event: topic questions\n`);
            res.write(`data: ${JSON.stringify({ topic: topic.topic, questions: topicQuestions })}\n\n`);
        })));
        yield Promise.race([promises, new Promise((resolve, reject) => setTimeout(resolve, 30000)).then(() => {
                res.write(`event: timeout\n`);
                res.write(`data: ${JSON.stringify({ error: "Timed out after 30 seconds" })}\n\n`);
            })]);
        res.end();
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: error.message });
        }
    }
}));
app.listen(3000, () => console.log('Server running on port 3000...'));
function getTopics(openai, text) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield (0, zod_gpt_1.completion)(openai, `"""${text}"""

    Produce a list of all the topics covered in the above university module, summarizing each topic in a minimum of 2-3 sentences.
    Each topic in the list you provide should be atomic, i.e. it should not be a list of topics and should represent a single topic.
    Please note that the above text was taken from a past exam paper and is not exhaustive; therefore, you SHOULD generate a list of topics that is not limited to the above text.
    `, {
            schema: zod_1.default.object({
                topics: zod_1.default.array(zod_1.default.object({
                    topic: zod_1.default.string().describe("The name of a topic the module covers"),
                    summary: zod_1.default.string().describe("A short summary of the topic in 2-3 sentences"),
                })).describe("A list of topics covered in the module"),
            })
        })).data.topics;
    });
}
``;
function getTrueFalseQuestions(openai, topic, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield (0, zod_gpt_1.completion)(openai, `"""${JSON.stringify(topic)}"""
   
    Generate ${quantity} university-level, hard true/false questions for the topic provided above.
    Statements should be multiple sentences, or paragraphs and should be difficult.
    ${[...Array(quantity)].map((_, i) => `For question ${i + 1}, you must provide both a TRUE and a FALSE variation of a statement.`).join("\n")}
    `, {
            schema: zod_1.default.object({
                questions: zod_1.default.array(zod_1.default.object({
                    trueStatement: zod_1.default.string().describe("The true statement to be asked to the student in the form of multiple sentences or paragraphs"),
                    falseStatement: zod_1.default.string().describe("A false or twisted version of the true statement"),
                })).describe("A list of true/false questions for the topic"),
            })
        })).data.questions;
    });
}
function getMultipleChoiceQuestions(openai, topic, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield (0, zod_gpt_1.completion)(openai, `"""${JSON.stringify(topic)}"""
    
    Generate ${quantity} university-level, hard multiple-choice questions for the topic provided above.
    You MUST provide 1 correct answer and 3 incorrect answers for each question, and each question should be difficult, aimed at ONLY the highest-performing university students.
    ${[...Array(quantity)].map((_, i) => `For question ${i + 1}, you must provide 1 correct answer and 3 incorrect answers.`).join("\n")}
    `, {
            schema: zod_1.default.object({
                questions: zod_1.default.array(zod_1.default.object({
                    question: zod_1.default.string().describe("The question to be asked to the student in the form of multiple sentences or paragraphs"),
                    correctAnswer: zod_1.default.string().describe("The correct answer to the question"),
                    incorrectAnswer1: zod_1.default.string().describe("An incorrect answer to the question"),
                    incorrectAnswer2: zod_1.default.string().describe("An incorrect answer to the question"),
                    incorrectAnswer3: zod_1.default.string().describe("An incorrect answer to the question")
                })).describe("A list of multiple-choice questions for the topic"),
            })
        })).data.questions;
    });
}
function getMatchingColumnsQuestions(openai, topic, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield (0, zod_gpt_1.completion)(openai, `"""${JSON.stringify(topic)}"""
    
    Generate ${quantity} university-level, hard matching columns questions for the topic provided above.
    ${[...Array(quantity)].map((_, i) => `For question ${i + 1}, you must provide a list of 4 matching pairs.`)}
    
    Example 1: """${JSON.stringify({
            "question": "Match the programming languages with their paradigms:",
            "pairs": [
                { "left": "Java", "right": "Object-Oriented" },
                { "left": "Python", "right": "Multi-Paradigm" },
                { "left": "Haskell", "right": "Functional" },
                { "left": "SQL", "right": "Query Language" }
            ]
        })}"""
    Example 2: """${JSON.stringify({
            "question": "Match the words with their definitions:",
            "pairs": [
                { "left": "Database", "right": "A collection of data" },
                { "left": "Normalisation", "right": "The process of eliminating data redundancy and optimising data in a database" },
                { "left": "SQL", "right": "A query language used to retrieve data from a database" },
                { "left": "Data", "right": "A collection of facts or information" }
            ]
        })}"""
    `, {
            schema: zod_1.default.object({
                questions: zod_1.default.array(zod_1.default.object({
                    prompt: zod_1.default.string().describe("The prompt to be asked to the student describing how to match the columns"),
                    context: zod_1.default.string().describe("The context of the question, i.e., any database tables or functions that are required to answer the question"),
                    pairs: zod_1.default.array(zod_1.default.object({
                        left: zod_1.default.string().describe("The left column of the matching columns question"),
                        right: zod_1.default.string().describe("The right column of the matching columns question")
                    })).describe("A list of matching columns questions for the topic")
                })).describe("A list of matching columns questions for the topic")
            })
        })).data.questions;
    });
}
function getQuestions(openai, topic, quantity, type) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (type) {
            case "multiple choice":
                return yield getMultipleChoiceQuestions(openai, topic, quantity);
            case "true/false":
                return yield getTrueFalseQuestions(openai, topic, quantity);
            case "matching":
                return yield getMatchingColumnsQuestions(openai, topic, quantity);
            default:
                let promises = [];
                const numMcq = Math.ceil(quantity / 3);
                const numTF = Math.round(quantity / 3);
                const numMatching = quantity - numMcq - numTF;
                promises.push(getMultipleChoiceQuestions(openai, topic, numMcq));
                if (numTF > 0)
                    promises.push(getTrueFalseQuestions(openai, topic, numTF));
                if (numMatching > 0)
                    promises.push(getMatchingColumnsQuestions(openai, topic, numMatching));
                return Promise.allSettled(promises).then(results => {
                    const fulfilled = results.filter(p => p.status === "fulfilled");
                    return fulfilled.map(p => p.value).flat();
                });
        }
    });
}
const openai = new llm_api_1.OpenAIChatApi({ apiKey: process.env.OPENAI_API_KEY }, { model: 'gpt-3.5-turbo' });
