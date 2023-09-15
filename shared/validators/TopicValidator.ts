import z from "zod";
import { QuestionEnumSchema } from "./QuestionTypeValidator";

const TopicSchema = z.object({
    topic: z.string().min(1).max(100).describe("The name of a topic the module covers"),
    summary: z.string().default("").describe("A short summary of the topic in 2-3 sentences")
})

const ExtendedTopicSchema = TopicSchema.extend({
    quantity: z.number().int().min(1).max(10).default(1),
    type: QuestionEnumSchema
})

type Topic = z.infer<typeof TopicSchema>;

type ExtendedTopic = z.infer<typeof ExtendedTopicSchema>;

export { TopicSchema, Topic, ExtendedTopicSchema, ExtendedTopic };