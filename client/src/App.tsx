import TrueFalse from "./components/TrueFalse"

function App() {
    return (
        <>
            <TrueFalse question={{
                trueStatement: "The binary number 1011 is equal to the decimal number 11.",
                falseStatement: "The binary number 1011 is equal to the decimal number 10."
            }} questionNumber={2} numberOfQuestions={4} />
        </>
    )
}

export default App