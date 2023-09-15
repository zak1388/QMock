import z from "zod";

const TopicSchema = z.object({
    topic: z.string().min(1).max(100).describe("The name of a topic the module covers"),
    summary: z.string().default("").describe("A short summary of the topic in 2-3 sentences")
})

type Topic = z.infer<typeof TopicSchema>;

export { TopicSchema, Topic };