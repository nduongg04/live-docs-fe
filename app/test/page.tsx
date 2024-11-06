"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Upload, Github } from "lucide-react";
import { Icons } from "@/components/Icons";

const formSchema = z
  .object({
    avatar: z.instanceof(File).optional(),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function SignUpForm() {
  const [isPasswordShowed, setIsPasswordShowed] = useState(false);
  const [isConfirmPasswordShowed, setIsConfirmPasswordShowed] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      if (values.avatar) {
        formData.append("avatar", values.avatar);
      }

      const response = await fetch(
        `${process.env.BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Handle successful sign up (e.g., redirect or show success message)
      } else if (data.message === "Email is already registered.") {
        form.setError("email", { message: data.message });
      }
    } catch (error) {
      console.error(error);
      form.setError("root", {
        message: "Something went wrong. Please try again.",
      });
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

  const handleSocialSignUp = (provider: string) => {
    // Implement social sign-up logic here
    console.log(`Sign up with ${provider}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 p-4">
      <Card className="w-full max-w-md overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-white px-6 pb-4 pt-6">
          <CardTitle className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-2xl font-bold text-transparent">
            Create an account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 bg-white p-6">
          <Button
            variant="outline"
            className="w-full bg-gray-200 transition-colors hover:bg-white"
            onClick={() => handleSocialSignUp("GitHub")}
          >
            <Icons.Github className="mr-2 h-4 w-4" />
            Sign up with GitHub
          </Button>
          <Button
            variant="outline"
            className="w-full bg-gray-200 transition-colors hover:bg-white"
            onClick={() => handleSocialSignUp("Google")}
          >
            <Icons.Google className="mr-2 h-4 w-4" />
            Sign up with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="group cursor-pointer">
                        <Avatar className="h-16 w-16 border-2 border-gray-200 transition-colors group-hover:border-blue-500">
                          <AvatarImage
                            src={avatarPreview || ""}
                            alt="Avatar preview"
                          />
                          <AvatarFallback className="bg-gray-100 text-gray-400 transition-colors group-hover:text-blue-500">
                            <Upload className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex-1 space-y-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Name"
                            className="border-gray-300 transition-colors focus:border-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            placeholder="Email address"
                            className="border-gray-300 transition-colors focus:border-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isPasswordShowed ? "text" : "password"}
                          {...field}
                          placeholder="Password"
                          className="border-gray-300 pr-10 transition-colors focus:border-blue-500"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:bg-transparent hover:text-gray-600"
                          onClick={() => setIsPasswordShowed((prev) => !prev)}
                        >
                          {isPasswordShowed ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
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
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isConfirmPasswordShowed ? "text" : "password"}
                          {...field}
                          placeholder="Confirm Password"
                          className="border-gray-300 pr-10 transition-colors focus:border-blue-500"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:bg-transparent hover:text-gray-600"
                          onClick={() =>
                            setIsConfirmPasswordShowed((prev) => !prev)
                          }
                        >
                          {isConfirmPasswordShowed ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-500 text-white transition-colors hover:bg-blue-600"
              >
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
