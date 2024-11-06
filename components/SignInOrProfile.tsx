"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { changeUserInfo, updatePassword } from "@/lib/actions/user.action";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

const accountFormSchema = z.object({
  avatar: z.string(),
  name: z.string(),
});

const passwordFormSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    repeat: z.string(),
  })
  .refine((data) => data.password === data.repeat, {
    path: ["repeat"],
    message: "Repeat password does not match",
  });

export default function SignInOrProfile() {
  let { data: session, update } = useSession();
  const [isShownPassword, setIsShownPassword] = useState(false);
  const [isShownRepeat, setIsShownRepeat] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      avatar: session?.user.avatar || "",
      name: session?.user.displayName || "",
    },
  });

  const resetForm = useCallback(
    (sessionData: any) => {
      accountForm.reset({
        avatar: sessionData?.user.avatar || "",
        name: sessionData?.user.displayName || "",
      });
    },
    [accountForm],
  );

  useEffect(() => {
    if (session) {
      resetForm(session);
    }
  }, [session, resetForm]);

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      repeat: "",
    },
  });

  const accountOnSubmit = async (values: z.infer<typeof accountFormSchema>) => {
    setIsLoading(true);
    const formData = new FormData();
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    if (values.name !== session?.user.displayName && values.name !== "") {
      formData.append("displayName", values.name);
    }
    if (!formData.get("avatar") && !formData.get("displayName")) {
      accountForm.setError("root", {
        message: "No changes made",
      });
      setIsLoading(false);
      return;
    }

    try {
      const responseData = await changeUserInfo(formData);
      if (typeof responseData !== "string") {
        setIsSuccessDialogOpen(true);
        let updatedSession = { ...session } as typeof session;
        if (formData.get("avatar")) {
          updatedSession!.user!.avatar = responseData.avatar;
        }
        if (formData.get("displayName")) {
          updatedSession!.user!.displayName = responseData.displayName;
        }
        await update(updatedSession);
        session = updatedSession;
        accountForm.reset({
          avatar: updatedSession!.user!.avatar!,
          name: updatedSession!.user!.displayName!,
        });
      } else {
        console.error("Failed to update profile");
        accountForm.setError("root", {
          message: "Failed to update profile. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      accountForm.setError("root", {
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordOnSubmit = async (
    values: z.infer<typeof passwordFormSchema>,
  ) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("password", values.password);
    try {
      const responseData = await updatePassword(formData);
      if (typeof responseData !== "string") {
        setIsSuccessDialogOpen(true);
      } else {
        console.error("Failed to update password");
      }
    } catch (error: any) {
      console.error("Error updating password:", error.message);
      passwordForm.setError("root", {
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          accountForm.setValue("avatar", event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    signOut();
  };

  const PasswordToggleButton = ({
    isShown,
    onClick,
  }: {
    isShown: boolean;
    onClick: () => void;
  }) => (
    <Button
      onClick={onClick}
      type="button"
      className="absolute right-0 top-0 z-20 flex cursor-pointer items-center rounded-e-md bg-transparent text-gray-400 hover:bg-transparent focus:text-blue-600 focus:outline-none dark:text-neutral-600 dark:focus:text-blue-500"
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
          className={isShown ? "hidden" : "block"}
          d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
        ></path>
        <path
          className={isShown ? "hidden" : "block"}
          d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
        ></path>
        <path
          className={isShown ? "hidden" : "block"}
          d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
        ></path>
        <line
          className={isShown ? "hidden" : "block"}
          x1="2"
          x2="22"
          y1="2"
          y2="22"
        ></line>
        <path
          className={isShown ? "block" : "hidden"}
          d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
        ></path>
        <circle
          className={isShown ? "block" : "hidden"}
          cx="12"
          cy="12"
          r="3"
        ></circle>
      </svg>
    </Button>
  );

  if (!session) {
    return (
      <Button>
        <Link href="/sign-in">Sign in</Link>
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="group focus:outline-none">
          <div className="text-gray flex items-center gap-3 font-medium outline-none">
            <Image
              src={session.user.avatar}
              alt="User avatar"
              width={40}
              height={40}
              className="h-[40px] w-[40px] rounded-full object-cover"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="px-2 py-4">
          <DropdownMenuLabel className="text-base">
            My Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Dialog
            onOpenChange={() => {
              accountForm.reset();
              passwordForm.reset();
              setAvatarFile(null);
            }}
          >
            <DialogTrigger asChild>
              <DropdownMenuItem
                className="flex min-w-32 cursor-pointer items-center gap-3 py-3 pr-32 text-base"
                onSelect={(e) => e.preventDefault()}
              >
                <Image
                  src="/assets/icons/profile-circle.svg"
                  alt="profile"
                  width={20}
                  height={20}
                />
                Profile
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent
              className="border border-slate-700 bg-[#09090B] sm:max-w-[425px]"
              autoFocus={false}
            >
              <DialogHeader>
                <DialogTitle>{}</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="account" className="bg-[#09090B]">
                <TabsList className="grid w-full grid-cols-2 bg-zinc-700 text-zinc-400">
                  <TabsTrigger
                    value="account"
                    className="rounded-md data-[state=active]:bg-[#09090B] data-[state=active]:text-white"
                  >
                    Account
                  </TabsTrigger>
                  <TabsTrigger
                    value="password"
                    className="rounded-md data-[state=active]:bg-[#09090B] data-[state=active]:text-white"
                  >
                    Password
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="bg-inherit">
                  <Card className="border-gray-700 bg-inherit text-white">
                    <CardHeader>
                      <CardTitle>Account</CardTitle>
                      <CardDescription>
                        Make changes to your account here. Click save when
                        you&apos;re done.
                      </CardDescription>
                    </CardHeader>
                    <Form {...accountForm}>
                      <form
                        onSubmit={accountForm.handleSubmit(accountOnSubmit)}
                      >
                        <CardContent className="space-y-2">
                          <div className="grid gap-4 py-4">
                            <FormField
                              control={accountForm.control}
                              name="avatar"
                              render={({
                                field: { value, onChange, ...rest },
                              }) => (
                                <FormItem className="flex flex-col">
                                  <div className="flex gap-4">
                                    <Image
                                      src={value}
                                      alt="User avatar"
                                      width={80}
                                      height={80}
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                    <div>
                                      <Input
                                        type="file"
                                        onChange={handleFileChange}
                                        {...rest}
                                        className="hidden"
                                        id="avatar"
                                        accept="image/*"
                                      />
                                      <Button
                                        type="button"
                                        className="gradient-blue hover:opacity-80"
                                        onClick={() =>
                                          document
                                            .getElementById("avatar")
                                            ?.click()
                                        }
                                      >
                                        Change
                                      </Button>
                                    </div>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={accountForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="name"
                                      className="flex items-center gap-2"
                                    >
                                      <Image
                                        src="/assets/icons/avatar.svg"
                                        alt="User"
                                        width={20}
                                        height={20}
                                      />
                                      Name
                                    </Label>
                                    <Input
                                      id="name"
                                      className="col-span-3 border border-slate-700 bg-transparent text-white"
                                      {...field}
                                    />
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          {accountForm.formState.errors.root && (
                            <FormMessage className="text-red-500">
                              {accountForm.formState.errors.root.message}
                            </FormMessage>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button
                            type="submit"
                            className="gradient-blue hover:opacity-80"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save changes"
                            )}
                          </Button>
                        </CardFooter>
                      </form>
                    </Form>
                  </Card>
                </TabsContent>
                <TabsContent value="password" className="bg-inherit">
                  <Card className="border-gray-700 bg-inherit text-white">
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>
                        Change your password here. After saving, you&apos;ll be
                        logged out.
                      </CardDescription>
                    </CardHeader>
                    <Form {...passwordForm}>
                      <form
                        onSubmit={passwordForm.handleSubmit(passwordOnSubmit)}
                      >
                        <CardContent className="space-y-2">
                          <div className="grid gap-4 py-4">
                            {["password", "repeat"].map((field) => (
                              <FormField
                                key={field}
                                control={passwordForm.control}
                                name={field as "password" | "repeat"}
                                render={({ field: { onChange, ...rest } }) => (
                                  <FormItem className="flex flex-col">
                                    <div className="grid grid-cols-5 items-center">
                                      <Label
                                        htmlFor={field}
                                        className="col-span-2 flex items-center gap-2"
                                      >
                                        <Image
                                          src="/assets/icons/password.svg"
                                          alt="User"
                                          width={20}
                                          height={20}
                                        />
                                        {field.charAt(0).toUpperCase() +
                                          field.slice(1)}
                                      </Label>
                                      <div className="relative col-span-3">
                                        <Input
                                          id={field}
                                          type={
                                            field === "password"
                                              ? isShownPassword
                                                ? "text"
                                                : "password"
                                              : isShownRepeat
                                                ? "text"
                                                : "password"
                                          }
                                          placeholder="********"
                                          className="border border-slate-700 bg-transparent text-white"
                                          onChange={onChange}
                                          {...rest}
                                        />
                                        <PasswordToggleButton
                                          isShown={
                                            field === "password"
                                              ? isShownPassword
                                              : isShownRepeat
                                          }
                                          onClick={() =>
                                            field === "password"
                                              ? setIsShownPassword(
                                                  (prev) => !prev,
                                                )
                                              : setIsShownRepeat(
                                                  (prev) => !prev,
                                                )
                                          }
                                        />
                                      </div>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button
                            type="submit"
                            className="gradient-blue hover:opacity-80"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save password"
                            )}
                          </Button>
                        </CardFooter>
                      </form>
                    </Form>
                  </Card>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          <DropdownMenuItem className="flex min-w-32 cursor-pointer items-center gap-3 py-3 pr-32 text-base" onClick={handleLogout}>
            <Image
              src="/assets/icons/logout-circle.svg"
              alt="logout"
              width={20}
              height={20}
            />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="border border-slate-700 bg-[#09090B] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-white">Profile Updated</DialogTitle>
          </DialogHeader>
          <p className="text-white">
            Your profile has been successfully updated.
          </p>
          <Button
            onClick={() => setIsSuccessDialogOpen(false)}
            className="gradient-blue hover:opacity-80"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
