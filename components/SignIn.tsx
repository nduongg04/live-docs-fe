import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { Button } from "./ui/button";

import SignInForm from "./SignInForm";

export const formSchema = z.object({
    email: z.string().email({
        message: "Invalid email",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});

export default async function SignIn() {
    return (
        <div className="rounded-xl bg-gray-100">
            <div className="flex flex-col gap-8 rounded-b-lg rounded-t-xl bg-[#ffffff] bg-clip-padding px-12 py-8 shadow">
                <header className="flex flex-col items-center justify-center gap-1">
                    <Image
                        src="assets/icons/logo-icon.svg"
                        height={50}
                        width={50}
                        alt="Live Docs Logo"
                    />
                    <h1 className="text-center font-semibold text-dark-300">
                        Sign into Live Docs
                    </h1>
                    <span className="font-normal text-gray-600">
                        Welcome back! Please sign in to continue.
                    </span>
                </header>
                <div className="grid grid-flow-col justify-stretch gap-2">
                    <Button className="rounded-md border bg-white text-base font-medium text-black shadow-sm shadow-gray-200 transition-all duration-300 ease-in-out hover:bg-slate-700 hover:text-white">
                        <Image
                            src="assets/icons/google.svg"
                            alt="Google"
                            width={20}
                            height={20}
                            className="mr-2"
                        />
                        Google
                    </Button>
                    <Button className="rounded-md border bg-white text-base font-medium text-black shadow-sm shadow-gray-200 transition-all duration-300 ease-in-out hover:bg-slate-700 hover:text-white">
                        <Image
                            src="assets/icons/facebook.svg"
                            alt="Facebook"
                            width={20}
                            height={20}
                            className="mr-2"
                        />
                        Facebook
                    </Button>
                </div>
                <div className="relative">
                    <hr />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+1px)] bg-white px-3 py-0.5 font-normal text-slate-500">
                        or
                    </span>
                </div>
                <SignInForm />
            </div>

            <div className="py-4 text-center text-base font-normal text-gray-500">
                Don&apos;t have an account?
                <span> </span>
                <Link
                    className="cursor-pointer font-semibold text-dark-300 hover:underline"
                    href="/sign-up"
                >
                    Sign up
                </Link>
            </div>
        </div>
    );
}
