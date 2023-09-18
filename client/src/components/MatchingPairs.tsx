import { MatchingPairsQuestion } from "../../../shared/validators/questions/MatchingPairsValidator";
import { useState } from "react";
import QuestionHeader from "./QuestionHeader";

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
            <QuestionHeader questionNumber={questionNumber} numberOfQuestions={numberOfQuestions} questionPrompt={question.prompt} />

            <div className="grid grid-cols-2 gap-4">
                {[...Array(columns.left.length)].map((_, index) => (
                    <>
                        {[columns.left[index], columns.right[index]].map((item, idx) => (
                            <button onClick={() => selectItem(idx ? "right" : "left", index)} className={`border-qm-700 flex flex-row items-center border rounded-xl text-lg font-bold overflow-hidden ${item.selected && "bg-pink-500"} ${item.paired && "bg-qm-500"}`}>
                                    <div className={`bg-qm-700 h-full py-4 px-2 font-medium text-qm-100 flex items-center ${item.selected && "bg-purple-500"}`}>{item.id} </div>
                                    <h1 className={`${(item.paired || item.selected) && "text-qm-100"} text-qm-700 p-4 text-left bg-inherit`}>{item.item}</h1>
                            </button>  
                        ))}
                    </>
                ))}
            </div>
        </div>
    )
}
