import { MatchingPairsQuestion } from "../../../shared/validators/questions/MatchingPairsValidator";
import { useState } from "react";

export default function MatchingPairs({ question, questionNumber, numberOfQuestions, onSubmit }: {
    question: MatchingPairsQuestion,
    questionNumber: number,
    numberOfQuestions: number,
    onSubmit: (correct: boolean) => void
}) {

    const [columns, setColumns] = useState<{
        left: {
            id: string,
            item: string,
            selected: boolean,
            paired: boolean
        }[],
        right: {
            id: string,
            item: string,
            selected: boolean,
            paired: boolean
        }[]
    }>({
        left: question.pairs.map((pair) => pair.left).sort(() => Math.random() - 0.5).map((item, index) => ({ item, selected: false, paired: false, id: (index + 1).toString() })),
        right: question.pairs.map((pair) => pair.right).sort(() => Math.random() - 0.5).map((item, index) => ({ item, selected: false, paired: false, id: "ABCDEFGH"[index] }))
    });
    
    function selectItem(column: "left" | "right", index: number) {
        const newColumns = {
            left: [...columns.left],
            right: [...columns.right]
        };

        // If the item is already selected, deselect it
        if (newColumns[column][index].selected) {
            newColumns[column][index].selected = false;
            setColumns(newColumns);
            return;
        }

        // if the item is already paired, do nothing
        if (newColumns[column][index].paired) {
            return;
        }

        // Otherwise, if an item on the other column is already selected, pair them
        const otherColumn = column === "left" ? "right" : "left";
        const otherColumnIndex = newColumns[otherColumn].findIndex((item) => item.selected);
        if (otherColumnIndex !== -1) {
            newColumns[column][index].selected = false;
            newColumns[column][index].paired = true;
            newColumns[otherColumn][otherColumnIndex].paired = true;
            newColumns[otherColumn][otherColumnIndex].selected = false;
            // put the 2 paired items at the top of their respective columns
            newColumns[column].unshift(newColumns[column].splice(index, 1)[0]);
            newColumns[otherColumn].unshift(newColumns[otherColumn].splice(otherColumnIndex, 1)[0]);
            setColumns(newColumns);
        } else {
            // Otherwise, check if there is a selected item on the same column, and deselect it and select the new item
            const sameColumnIndex = newColumns[column].findIndex((item) => item.selected);
            if (sameColumnIndex !== -1) {
                newColumns[column][sameColumnIndex].selected = false;
                newColumns[column][index].selected = true;
                setColumns(newColumns);
            } else {
                // Otherwise, just select the new item
                newColumns[column][index].selected = true;
                setColumns(newColumns);
            }
        }
    }

    return (
        <div className="w-fit flex flex-col gap-4">
            <div className="border-slate-700 flex flex-row items-center gap-8 border rounded-xl p-4 text-xl font-bold">
                <div className="divide-y text-2xl font-black">
                    <p className="text-slate-200">{questionNumber}</p>
                    <p className="text-slate-500 font-bold">{numberOfQuestions}</p>
                </div>
                <h1 className="text-slate-400">{question.prompt}</h1>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {[...Array(columns.left.length)].map((_, index) => (
                    <>
                        {[columns.left[index], columns.right[index]].map((item, idx) => (
                            <button onClick={() => selectItem(idx ? "right" : "left", index)} className={`border-slate-700 flex flex-row items-center border rounded-xl text-lg font-bold overflow-hidden ${item.selected && "bg-purple-500/10"} ${item.paired && "bg-blue-600/10"}`}>
                                    <div className={`bg-slate-700 h-full py-4 px-2 font-medium flex items-center ${item.selected && "bg-purple-500"} ${item.paired && "bg-blue-600"}`}>{item.id}</div>
                                    <h1 className="text-slate-400 p-4 text-left">{item.item}</h1>
                            </button>  
                        ))}
                    </>
                ))}
            </div>
        </div>
    )
}