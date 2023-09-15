import MultipleChoice from "./components/MultipleChoice"

function App() {
    return (
        <MultipleChoice question={{
            "question": "What is the binary representation of the decimal number 12?",
            "correctAnswer": "1100",
            "incorrectAnswer1": "1001",
            "incorrectAnswer2": "1010",
            "incorrectAnswer3": "1111"
        }} questionNumber={1} numberOfQuestions={4} />
    )
}

export default App