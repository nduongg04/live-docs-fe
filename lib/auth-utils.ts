"use server";

import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginWithCredentials(credentials: {
    email: string;
    password: string;
}) {
    try {
        await signIn("credentials", {
            email: credentials.email,
            password: credentials.password,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            console.log(error.message);
            switch (error.type) {
                case "CredentialsSignin":
                    return { message: "Invalid credentials" };
                default:
                    return { message: "An error occurred" };
            }
        }
    }
}