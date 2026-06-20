import z from "zod"


export const foodCreateSchema = z.object({
    name:z.string(),
    calories:z.number(),
    carbo:z.number(),
    protein:z.number(),
    fat:z.number(),
    baseGrams:z.number()
})

