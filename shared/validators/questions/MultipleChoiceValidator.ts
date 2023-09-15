import z from 'zod';

const MultipleChoiceSchema = z.object({
    question: z.string().describe("The question to be asked to the student in the form of multiple sentences or paragraphs"),
    correctAnswer: z.string().describe("The correct answer to the question"),
    incorrectAnswer1: z.string().describe("An incorrect answer to the question"),
    incorrectAnswer2: z.string().describe("An incorrect answer to the question"),
    incorrectAnswer3: z.string().describe("An incorrect answer to the question")
})

type MultipleChoiceQuestion = z.infer<typeof MultipleChoiceSchema>;

export { MultipleChoiceSchema, MultipleChoiceQuestion };