"use client";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";

export default function SignUpForm() {
    const [isShowed, setIsShowed] = useState(false);

    const formSchema = z.object({
        email: z.string().email({
            message: "Invalid email",
        }),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        //TODO Do something with the form values.
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                },
            );
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                // router.replace("/");
                console.log("Sign up successful");
            } else if (data.message === "Email is already registered.") {
                form.setError("email", {
                    message: data.message,
                });
            }
        } catch (error) {
            console.log(error);
            form.setError("root", {
                message: "Something went wrong. Please try again.",
            });
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-slate-900">
                                Email address
                            </FormLabel>
                            <FormControl className="shadow shadow-black/5">
                                <Input
                                    className="h-fit text-black focus-visible:ring-offset-0"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-black">
                                Password
                            </FormLabel>
                            <FormControl className="shadow shadow-black/5">
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={isShowed ? "text" : "password"}
                                        className="h-fit text-black focus-visible:ring-offset-0"
                                    />
                                    <Button
                                        onClick={() =>
                                            setIsShowed((prev) => !prev)
                                        }
                                        type="button"
                                        className="absolute inset-y-0 end-0 z-20 flex cursor-pointer items-center rounded-e-md bg-transparent px-3 text-gray-400 hover:bg-transparent focus:text-blue-600 focus:outline-none dark:text-neutral-600 dark:focus:text-blue-500"
                                    >
                                        <svg
                                            className="size-3.5 shrink-0"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path
                                                className={
                                                    isShowed
                                                        ? "hidden"
                                                        : "block"
                                                }
                                                d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                                            ></path>
                                            <path
                                                className={
                                                    isShowed
                                                        ? "hidden"
                                                        : "block"
                                                }
                                                d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                                            ></path>
                                            <path
                                                className={
                                                    isShowed
                                                        ? "hidden"
                                                        : "block"
                                                }
                                                d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                                            ></path>
                                            <line
                                                className={
                                                    isShowed
                                                        ? "hidden"
                                                        : "block"
                                                }
                                                x1="2"
                                                x2="22"
                                                y1="2"
                                                y2="22"
                                            ></line>
                                            <path
                                                className={
                                                    isShowed
                                                        ? "block"
                                                        : "hidden"
                                                }
                                                d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                                            ></path>
                                            <circle
                                                className={
                                                    isShowed
                                                        ? "block"
                                                        : "hidden"
                                                }
                                                cx="12"
                                                cy="12"
                                                r="3"
                                            ></circle>
                                        </svg>
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="mt-3" type="submit">
                    Sign up
                </Button>
            </form>
        </Form>
    );
}
