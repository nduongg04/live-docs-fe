"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const statusCode = error.digest?.split("-")[0] || "500";
    const errorMessages: { [key: string]: string } = {
        "404": "Oops! The page you're looking for can't be found.",
        "500": "Internal Server Error. We're working on fixing this.",
        default: "An unexpected error occurred. Please try again later.",
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
            <Card className="w-full max-w-md bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-center text-2xl font-bold">
                        <AlertCircle className="h-6 w-6 text-red-500" />
                        Error {statusCode}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-center">
                        {errorMessages[statusCode] || errorMessages["default"]}
                    </p>
                    {error.message && (
                        <p className="mt-2 text-center text-sm text-gray-400">
                            Details: {error.message}
                        </p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => reset()}
                        className="bg-gray-700 text-gray-100 hover:bg-gray-600"
                    >
                        Try again
                    </Button>
                    <Button asChild className="bg-blue-600 hover:bg-blue-500">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Go to Homepage
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
