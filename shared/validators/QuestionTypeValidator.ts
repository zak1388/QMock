import z from 'zod';

const QuestionTypeSchema = z.enum(["multiple choice", "true/false", "matching"]).optional()

type QuestionType = z.infer<typeof QuestionTypeSchema>

export { QuestionTypeSchema, QuestionType };