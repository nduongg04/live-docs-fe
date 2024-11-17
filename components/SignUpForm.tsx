"use client";

import { Icons } from "@/components/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signUp } from "@/lib/actions/auth.action";
import { getMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z
    .object({
        avatar: z.instanceof(File).optional(),
        email: z.string().email({ message: "Invalid email address" }),
        displayName: z
            .string()
            .min(2, { message: "Display name must be at least 2 characters" }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export default function SignUpForm() {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const { toast } = useToast();
    const { update } = useSession();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            displayName: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const formData = new FormData();
            formData.append("email", values.email);
            formData.append("displayName", values.displayName);
            formData.append("password", values.password);
            if (values.avatar) {
                formData.append("avatar", values.avatar);
            }

            const data = await signUp(formData);
            console.log(data);

            if (data?.error) {
                console.log("error");
                throw new Error(data.message || "Registration failed");
            } else {
                toast({
                    title: "Account created successfully",
                    description: "You can now log in with your new account.",
                });
                router.push("/sign-in");
            }
        } catch (error) {
            toast({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred",
                variant: "destructive",
            });
            form.setError("root", { message: getMessage(error) });
        }
    }

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            form.setValue("avatar", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 text-black"
            >
                <div className="flex items-center space-x-4">
                    <FormField
                        control={form.control}
                        name="avatar"
                        render={() => (
                            <FormItem>
                                <FormLabel className="cursor-pointer">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage
                                            src={avatarPreview || undefined}
                                            alt="Avatar preview"
                                        />
                                        <AvatarFallback>
                                            {avatarPreview ? null : (
                                                <Icons.Upload className="h-8 w-8" />
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                        aria-label="Upload avatar"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your display name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email"
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
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Confirm your password"
                                    {...field}
                                />
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
                <Button type="submit" className="w-full">
                    Sign Up
                </Button>
            </form>
        </Form>
    );
}
