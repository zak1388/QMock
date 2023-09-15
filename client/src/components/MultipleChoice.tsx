import { MultipleChoiceQuestion } from "../../../shared/validators/questions/MultipleChoiceValidator";
import { useState } from "react";

export default function MultipleChoice({ question, questionNumber, numberOfQuestions }: {
    question: MultipleChoiceQuestion,
    questionNumber: number,
    numberOfQuestions: number
}) {

    const [selectedIdx, setSelectedIdx] = useState<number>(-1);

    function setSelectedIndex(idx: number) {
        if (selectedIdx === idx) {
            setSelectedIdx(-1);
            return;
        }
        setSelectedIdx(idx);
    }

    return (
        <div className="w-fit flex flex-col gap-4">
            <div className="border-slate-700 flex flex-row items-center gap-8 justify-between border rounded-xl p-4 text-xl font-bold w-fit">
                <div className="divide-y text-2xl font-black">
                    <p className="text-slate-200">{questionNumber}</p>
                    <p className="text-slate-500 font-bold">{numberOfQuestions}</p>
                </div>
                <h1 className="text-slate-400">{question.question}</h1>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {[question.correctAnswer, question.incorrectAnswer1, question.incorrectAnswer2, question.incorrectAnswer3].map((answer, i) => (
                    <button key={i} onClick={() => setSelectedIndex(i)} className={`bg-slate-500 rounded-xl p-4 text-slate-950 font-medium text-lg border border-slate-500 ${selectedIdx === i && "bg-transparent border-slate-700 text-inherit"}`}>{answer}</button>
                ))}
            </div>
        </div>
    )
}