import z from 'zod';
import { MatchingPairsSchema } from './questions/MatchingPairsValidator';
import { MultipleChoiceSchema } from './questions/MultipleChoiceValidator';
import { TrueFalseSchema } from './questions/TrueFalseValidator';

const QuestionEnumSchema = z.enum(["multiple choice", "true/false", "matching"]).optional()
const QuestionTypeSchema = MatchingPairsSchema.or(MultipleChoiceSchema).or(TrueFalseSchema)

type QuestionEnum = z.infer<typeof QuestionEnumSchema>
type QuestionType = z.infer<typeof QuestionTypeSchema>

export { QuestionEnum, QuestionEnumSchema, QuestionType, QuestionTypeSchema };