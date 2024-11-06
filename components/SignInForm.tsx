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
import { formSchema } from "@/lib/schemas";
import { getMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";
import { AuthError } from "next-auth";

const SignInForm = () => {
  const [isShowed, setIsShowed] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    setIsPending(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        switch (result.error) {
          case "CredentialsSignin":
            throw new Error("Invalid credentials");

          default:
            console.log(result.error);
            throw new Error("An error occurred");
        }
      }

      router.push("/");
      router.refresh(); // This will update the session on the client-side
    } catch (error) {
      const message = getMessage(error);
      form.setError("root", {
        type: "manual",
        message,
      });
    } finally {
      setIsPending(false);
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
              <FormLabel className="text-slate-900">Email address</FormLabel>
              <FormControl className="shadow shadow-black/5">
                <Input
                  className="h-fit text-black focus-visible:ring-offset-0"
                  {...field}
                  disabled={isPending}
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
              <FormLabel className="text-black">Password</FormLabel>
              <FormControl className="shadow shadow-black/5">
                <div className="relative">
                  <Input
                    disabled={isPending}
                    {...field}
                    type={isShowed ? "text" : "password"}
                    className="h-fit text-black focus-visible:ring-offset-0"
                  />
                  <Button
                    onClick={() => setIsShowed((prev) => !prev)}
                    type="button"
                    className="absolute inset-y-0 end-0 z-20 flex cursor-pointer items-center rounded-e-md bg-transparent px-3 text-gray-400 hover:bg-transparent focus:text-blue-600 focus:outline-none dark:text-neutral-600 dark:focus:text-blue-500"
                  >
                    {isShowed ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {isShowed ? "Hide password" : "Show password"}
                    </span>
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
