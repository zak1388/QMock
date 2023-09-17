import { TrueFalseQuestion } from "../../../shared/validators/questions/TrueFalseValidator";
import { useState, useRef } from "react";

export default function TrueFalse({ question, questionNumber, numberOfQuestions, onSubmit }: {
    question: TrueFalseQuestion,
    questionNumber: number,
    numberOfQuestions: number,
    onSubmit: (correct: boolean) => void
}) {

    const [selectedIdx, setSelectedIdx] = useState<number>(-1);
    const isTrueStatement = useRef(Math.random() > 0.5 ? true : false);

    function setSelectedIndex(idx: number) {
        if (selectedIdx === idx) {
            setSelectedIdx(-1);
            return;
        }
        setSelectedIdx(idx);
    }

    return (
        <div className="flex flex-col items-center gap-4"> 
            <div className="w-fit flex flex-col gap-4">
                <div className="border-qm-700 flex flex-row items-center gap-8 border rounded-xl p-4 text-xl font-bold">
                    <div className="divide-y divide-qm-500 text-2xl font-black">
                        <p className="text-qm-200">{questionNumber}</p>
                        <p className="text-qm-700 font-bold">{numberOfQuestions}</p>
                    </div>
                    <h1 className="text-qm-700">{isTrueStatement.current ? question.trueStatement : question.falseStatement}</h1>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {["True", "False"].map((answer, i) => (
                        <button key={i} onClick={() => setSelectedIndex(i)} className={`rounded-xl p-4  font-medium text-lg border border-qm-500 ${selectedIdx !== i && "bg-qm-200 text-qm-700"} ${selectedIdx === i && "bg-qm-700 border-qm-700 text-qm-200"}`}>{answer}</button>
                    ))}
                </div>
            </div>
            <button className="border-qm-700 px-4 py-2 border rounded-xl text-lg font-bold" onClick={() => selectedIdx !== -1 && onSubmit(selectedIdx === (isTrueStatement.current ? 0 : 1))}>Submit</button>
        </div>
    )
}
