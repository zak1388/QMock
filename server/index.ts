import { OpenAIChatApi } from "llm-api"
import { completion } from "zod-gpt"
import z from "zod"
import express from 'express'

import { ExtendedTopicSchema, ExtendedTopic, TopicSchema, Topic } from "../shared/validators/TopicValidator"
import { TrueFalseSchema, TrueFalseQuestion } from "../shared/validators/questions/TrueFalseValidator"
import { MultipleChoiceSchema, MultipleChoiceQuestion } from "../shared/validators/questions/MultipleChoiceValidator"
import { MatchingPairsSchema, MatchingPairsQuestion } from "../shared/validators/questions/MatchingPairsValidator"
import { Text, TextSchema } from "../shared/validators/TextValidator"

import dotenv from 'dotenv'
import { QuestionType, QuestionEnum } from "../shared/validators/QuestionTypeValidator"
dotenv.config()

const app = express()
app.use(express.json())

app.post('/api/topics', async (req, res) => {
    try {
        const text: Text = TextSchema.parse(req.body)
        const topics = await getTopics(openai, text.text)
        return res.status(200).json(topics)
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.message })
        } else {
            res.status(500).json({ error: (error as Error).message })
        }
    }
})

app.post('/api/questions', async (req, res) => {
    try {
        const TopicsSchema = z.array(ExtendedTopicSchema).max(20)
        const topics: ExtendedTopic[] = TopicsSchema.parse(req.body)
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        const promises = Promise.allSettled(topics.map(async topic => {
            const topicQuestions = await getQuestions(openai, topic, topic.quantity, topic.type);
            res.write(`event: topic questions\n`)
            res.write(`data: ${JSON.stringify({ topic: topic.topic, questions: topicQuestions })}\n\n`)
        }))

        await Promise.race([promises, new Promise((resolve, reject) => setTimeout(resolve, 30000)).then(() => {
            res.write(`event: timeout\n`)
            res.write(`data: ${JSON.stringify({ error: "Timed out after 30 seconds" })}\n\n`)
        })])

        res.end()
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.message })
        } else {
            res.status(500).json({ error: (error as Error).message })
        }
    }
})

app.listen(3000, () => console.log('Server running on port 3000...'))

async function getTopics(openai: OpenAIChatApi, text: string): Promise<Topic[]> {
    return (await completion(openai, `"""${text}"""

    Produce a list of all the topics covered in the above university module, summarizing each topic in a minimum of 2-3 sentences.
    Each topic in the list you provide should be atomic, i.e. it should not be a list of topics and should represent a single topic.
    Please note that the above text was taken from a past exam paper and is not exhaustive; therefore, you SHOULD generate a list of topics that is not limited to the above text.
    `, {
        schema: z.object({
            topics: z.array(TopicSchema).describe("A list of topics covered in the module"),
        })
    })).data.topics
}``

async function getTrueFalseQuestions(openai: OpenAIChatApi, topic: Topic, quantity: number): Promise<TrueFalseQuestion[]> {
    return (await completion(openai, `"""${JSON.stringify(topic)}"""
   
    Generate ${quantity} university-level, hard true/false questions for the topic provided above.
    Statements should be multiple sentences, or paragraphs and should be difficult.
    ${[...Array(quantity)].map((_, i) => `For question ${i + 1}, you must provide both a TRUE and a FALSE variation of a statement.`).join("\n")}
    `, {
        schema: z.object({
            questions: z.array(TrueFalseSchema).describe("A list of true/false questions for the topic"),
        })
    })).data.questions
}

async function getMultipleChoiceQuestions(openai: OpenAIChatApi, topic: Topic, quantity: number): Promise<MultipleChoiceQuestion[]> {
    return (await completion(openai, `"""${JSON.stringify(topic)}"""
    
    Generate ${quantity} university-level, hard multiple-choice questions for the topic provided above.
    You MUST provide 1 correct answer and 3 incorrect answers for each question, and each question should be difficult, aimed at ONLY the highest-performing university students.
    ${[...Array(quantity)].map((_, i) => `For question ${i + 1}, you must provide 1 correct answer and 3 incorrect answers.`).join("\n")}
    `, {
        schema: z.object({
            questions: z.array(MultipleChoiceSchema).describe("A list of multiple-choice questions for the topic"),
        })
    })).data.questions
}

async function getMatchingColumnsQuestions(openai: OpenAIChatApi, topic: Topic, quantity: number): Promise<MatchingPairsQuestion[]> {
    return (await completion(openai, `"""${JSON.stringify(topic)}"""
    
    Generate ${quantity} university-level, hard matching-pairs questions for the topic provided above.
    ${[...Array(quantity)].map((_, i) => `For question ${i + 1}, you must provide a list of 4 matching-pairs.`)}

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

    Example 3: """${JSON.stringify({
    "question": "Match the programming terms with their definitions:",
    "pairs": [
        { "left": "Algorithm", "right": "A step-by-step procedure to solve a specific problem or perform a task in programming" },
        { "left": "Syntax", "right": "The set of rules that dictate how programs in a particular language are written" },
        { "left": "Variable", "right": "A named storage location in a program that holds data or values" },
        { "left": "Function", "right": "A reusable block of code that performs a specific task" }
    ]
    })}"""
    `, {
        schema: z.object({
            questions: z.array(MatchingPairsSchema).describe("A list of matching columns questions for the topic")
        })
    })).data.questions
}

async function getQuestions(openai: OpenAIChatApi, topic: Topic, quantity: number, type?: QuestionEnum) {
    switch (type) {
        case "multiple choice":
            return await getMultipleChoiceQuestions(openai, topic, quantity);
        case "true/false":
            return await getTrueFalseQuestions(openai, topic, quantity);
        case "matching":
            return await getMatchingColumnsQuestions(openai, topic, quantity);
        default:
            let promises: Promise<any>[] = [];

            const numMcq = Math.ceil(quantity / 3);
            const numTF = Math.round(quantity / 3);
            const numMatching = quantity - numMcq - numTF;

            promises.push(getMultipleChoiceQuestions(openai, topic, numMcq));
            if (numTF > 0) promises.push(getTrueFalseQuestions(openai, topic, numTF));
            if (numMatching > 0) promises.push(getMatchingColumnsQuestions(openai, topic, numMatching));

            return Promise.allSettled(promises).then(results => {
                const fulfilled = results.filter(p => p.status === "fulfilled");
                return fulfilled.map(p => (p as PromiseFulfilledResult<QuestionType[]>).value).flat();
            })
    }
}

const openai = new OpenAIChatApi({ apiKey: process.env.OPENAI_API_KEY }, { model: 'gpt-3.5-turbo' });