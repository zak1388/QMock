import TrueFalse from "./components/TrueFalse"
import MatchingPairs from "./components/MatchingPairs"

function App() {
    return (
        <>
            <MatchingPairs question={{
            "prompt": "Match the decimal numbers with their binary representations:",
            "context": "Digital Representation of Data",
            "pairs": [
                {
                    "left": "10",
                    "right": "1010"
                },
                {
                    "left": "7",
                    "right": "111"
                },
                {
                    "left": "13",
                    "right": "1101"
                },
                {
                    "left": "27",
                    "right": "11011"
                }
            ]
        }} questionNumber={1} numberOfQuestions={4} />
        </>
    )
}

export default App