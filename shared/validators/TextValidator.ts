import z from 'zod';

const TextSchema = z.object({
    text: z.string().min(1).max(10000)
})

type Text = z.infer<typeof TextSchema>
 
export { TextSchema, Text };