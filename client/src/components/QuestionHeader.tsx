export default function QuestionHeader({questionNumber, numberOfQuestions, questionPrompt}: {
    questionNumber: number,
    numberOfQuestions: number,
    questionPrompt: string,
}) {
    return (
        <div className="border-qm-500 flex flex-row items-center gap-8 border rounded-xl p-4 text-xl font-bold">
            <div className="divide-y divide-qm-300 text-2xl font-black">
                <p className="text-qm-500">{questionNumber}</p>
                <p className="text-qm-700 font-bold">{numberOfQuestions}</p>
            </div>
            <h1 className="text-qm-700">{questionPrompt}</h1>
        </div>
    )
}
