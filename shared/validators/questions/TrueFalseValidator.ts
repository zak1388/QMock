import z from 'zod';

const TrueFalseSchema = z.object({
    trueStatement: z.string().describe("The true statement to be asked to the student in the form of multiple sentences or paragraphs"),
    falseStatement: z.string().describe("A false or twisted version of the true statement")
})

type TrueFalseQuestion = z.infer<typeof TrueFalseSchema>;

export { TrueFalseSchema, TrueFalseQuestion };