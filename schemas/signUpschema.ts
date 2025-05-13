import { date } from "drizzle-orm/mysql-core";
import * as z from "zod";

export const signUpSchema = z
    .object({
        email : z
            .string()
            .min(1, {message: "Email is Required"})
            .email({message: "Please Enter a valid email"}),
        password: z.string().min(1, {message: "Password is required"}).min(8, {message: "Password should be minimum 8 character"}),

        passwordConfirmation: z.string().min(1, {message: "Please Confirm your password"}),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "Password do not match",
        path: ["passwordCOnfirmation"],
    });
