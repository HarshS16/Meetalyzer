import { z } from "zod";

export const agentsInsertSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(100),
    instructions: z.string().min(1, { message: "Instructions must be at least 1 character long" }).max(500),
});

export const agentsUpdateSchema = agentsInsertSchema.extend({
    id: z.string().min(1, { message: "Id is required" }),
})