import TrueFalse from "./components/TrueFalse"
import MultipleChoice from "./components/MultipleChoice"

function App() {
    return (
        <div className="flex flex-col gap-8 m-8">
            <TrueFalse question={{
                "trueStatement": "Converting a decimal number to binary always results in a unique binary representation.",
                "falseStatement": "Multiple decimal numbers can have the same binary representation."
            }} questionNumber={1} numberOfQuestions={2} onSubmit={(correct: boolean) => {
                console.log(correct)
            }} />

            <MultipleChoice question={{
                "question": "What is the binary representation of 5?",
                "correctAnswer": "101",
                "incorrectAnswer1": "100",
                "incorrectAnswer2": "111",
                "incorrectAnswer3": "110"
            }} questionNumber={2} numberOfQuestions={2} onSubmit={(correct: boolean) => {
                console.log(correct)
            }} />
        </div>
    )
}

export default App