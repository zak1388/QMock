import z from 'zod';

const MatchingPairsSchema = z.object({
    prompt: z.string().describe("The prompt to be asked to the student describing how to match the columns"),
    context: z.string().describe("The context of the question, i.e., any database tables or functions that are required to answer the question"),
    pairs: z.array(z.object({
        left: z.string().describe("The left column of the matching columns question"),
        right: z.string().describe("The right column of the matching columns question")
    })).describe("A list of matching columns questions for the topic")
})

type MatchingPairsQuestion = z.infer<typeof MatchingPairsSchema>;

export { MatchingPairsSchema, MatchingPairsQuestion };