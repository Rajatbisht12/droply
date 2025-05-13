import * as z from "zod";

export const signInSchema = z.object({
    identifier: z.string().min(1, {message: "Email is Required"}).email({message: "Please enter a valid email"}),
    password: z.string().min(1, {message: "Password id required"}).min(8, {message: "Password must have 8 characcters"})
})