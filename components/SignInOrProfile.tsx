"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { auth } from "@/auth";

export default function SignInOrProfile() {
    const session = useSession();

    return (
        <div>
            {session.data ? (
                <Image
                    src={session.data.user.avatar}
                    alt="User avatar"
                    width={200}
                    height={200}
                    className="rounded-full object-cover"
                    style={{ width: '40px', height: '40px' }}
                />
            ) : (
                <Link href="/api/auth/sign-in">Sign out</Link>
            )}
        </div>
    );
}
