"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getMessage } from "@/lib/utils";
import { loginWithCredentials } from "@/lib/auth-utils";
import { formSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";

const SignInForm = () => {
    const [isShowed, setIsShowed] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const delay = (ms: number) =>
        new Promise((resolve) =>
            setTimeout(() => {
                resolve(123);
                console.log("done waiting");
            }, ms),
        );

    async function onSubmit(formData: z.infer<typeof formSchema>) {
        setIsPending(true);
        await delay(3000);
        try {
            const error = await loginWithCredentials(formData);
            if (error) {
                throw new Error(error.message);
            }
        } catch (error) {
            console.log(error);
            const message = getMessage(error);
            form.setError("root", {
                type: "manual",
                message,
            });
        } finally {
            setIsPending(false);
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

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
                {form.formState.errors.root && (
                    <FormMessage className="text-red-500">
                        {form.formState.errors.root.message}
                    </FormMessage>
                )}
                <Button disabled={isPending} className={`mt-3`} type="submit">
                    {isPending ? "Loading..." : "Sign in"}
                </Button>
            </form>
        </Form>
    );
};
export default SignInForm;
