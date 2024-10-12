"use server";

import { auth } from "@/auth";
import { liveblocks } from "../liveblocks";
import { parseStringify } from "../utils";

export const getUsers = async (userIds: string[]) => {
    const session = await auth();
    if (!session || session.error) {
        return {
            message: "Unauthorized",
        };
    }
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/find/emails`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ emails: userIds }),
            },
        );
        const data = await response.json();
        const users = data.map((user: any) => ({
            id: user._id,
            name: user.displayName,
            avatar: user.avatar,
            email: user.email,
        }));

        const sortedUsers = userIds
            .map((email) => {
                const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase().trim());
                if (!user) {
                    console.warn(`No user found for email: ${email}`);
                }
                return user;
            })
            .filter(Boolean);
        return parseStringify(sortedUsers);
    } catch (error) {
        console.error("Error fetching users", error);
    }
};

export const getDocumentUsers = async ({
    roomId,
    currentUser,
    text,
}: {
    roomId: string;
    currentUser: string;
    text: string;
}) => {
    try {
        const room = await liveblocks.getRoom(roomId);
        const users = Object.keys(room.usersAccesses).filter(
            (email) => email !== currentUser,
        );
        if (text.length) {
            const lowerCaseText = text.toLowerCase();

            const filteredUsers = users.filter((email: string) =>
                email.toLowerCase().includes(lowerCaseText),
            );

            return parseStringify(filteredUsers);
        }
        return parseStringify(users);
    } catch (error) {}
};
