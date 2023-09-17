import TrueFalse from "./components/TrueFalse"
import MultipleChoice from "./components/MultipleChoice"
import MatchingPairs from "./components/MatchingPairs"
import { useEffect, useState } from "react"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import { QuestionTypeSchema, QuestionType } from "../../shared/validators/QuestionTypeValidator"
import { TrueFalseQuestion } from "../../shared/validators/questions/TrueFalseValidator"
import { MultipleChoiceQuestion } from "../../shared/validators/questions/MultipleChoiceValidator"
import { MatchingPairsQuestion } from "../../shared/validators/questions/MatchingPairsValidator"
import { ExtendedTopic, Topic } from "../../shared/validators/TopicValidator"
import z from "zod"

function App() {
    const [questions, setQuestions] = useState<QuestionType[]>([])

    async function getQuestionsByTopic(topic: ExtendedTopic) {
        fetchEventSource("/api/questions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([topic]),
            onmessage: (msg: any) => {
                const TopicQuestionsSchema = z.object({
                    topic: z.string(),
                    questions: z.array(QuestionTypeSchema)
                })
                type TopicQuestions = z.infer<typeof TopicQuestionsSchema>
                const data: TopicQuestions = JSON.parse(msg.data)
                setQuestions(cur => [...cur, ...data.questions])
            }
        })
    }

    return (
        <>
            <div className="flex flex-row gap-8 m-8 mt-0 pt-8">
                <button onClick={() => getQuestionsByTopic({ topic: "Test Topic", summary: "test topic", quantity: 5 })}>Get Questions</button>
                <button onClick={() => setQuestions([])}>Clear Questions</button>
            </div>
            <div className="flex flex-col flex-align-center gap-8 m-8 items-start">
                {questions.map((question, index) => {
                    if ('trueStatement' in question) {
                        return <TrueFalse question={question as TrueFalseQuestion} questionNumber={index + 1} numberOfQuestions={questions.length} onSubmit={(correct: boolean) => {
                            console.log(correct)
                        }} />
                    } else if ('incorrectAnswer1' in question) {
                        return <MultipleChoice question={question as MultipleChoiceQuestion} questionNumber={index + 1} numberOfQuestions={questions.length} onSubmit={(correct: boolean) => {
                            console.log(correct)
                        }} />
                    } else if ('prompt' in question) {
                        return <MatchingPairs question={question as MatchingPairsQuestion} questionNumber={index + 1} numberOfQuestions={questions.length} onSubmit={(correct: boolean) => {
                            console.log(correct)
                        }} />
                    }
                    return <p>{index}</p>
                })}
            </div>
        </>
    )
}

export default App