"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

const SignUp = () => {
    const handleSocialLogin = (provider: string) => {
        signIn(provider, { callbackUrl: "/" });
    };

    return (
        <div className="mx-auto w-full max-w-md rounded-xl bg-gray-100">
            <div className="flex flex-col gap-6 rounded-xl bg-white px-6 py-8 shadow sm:px-8">
                <header className="text-center">
                    <Image
                        src="/assets/icons/logo-icon.svg"
                        height={40}
                        width={40}
                        alt="Live Docs Logo"
                        className="mx-auto mb-2"
                    />
                    <h1 className="text-xl font-semibold text-dark-300">
                        Create your account
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Welcome! Please create your account to continue.
                    </p>
                </header>
                <Button
                    className="w-full border bg-white text-black shadow-sm hover:bg-gray-100"
                    onClick={() => handleSocialLogin("google")}
                >
                    <Image
                        src="/assets/icons/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                        className="mr-2"
                    />
                    Continue with Google
                </Button>
                <div className="relative">
                    <hr />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                        or
                    </span>
                </div>
                <SignUpForm />
            </div>
            <div className="py-4 text-center text-sm text-gray-500">
                Already have an account?
                <Link
                    className="ml-1 font-semibold text-dark-300 hover:underline"
                    href="/sign-in"
                >
                    Sign in
                </Link>
            </div>
        </div>
    );
};

export default SignUp;
