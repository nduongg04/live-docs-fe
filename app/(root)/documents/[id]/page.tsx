import { auth } from "@/auth";
import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.action";
import { getUsers } from "@/lib/actions/user.action";
import { useRemoveReaction } from "@liveblocks/react/suspense";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

const Document = async ({ params: { id } }: SearchParamProps) => {
    const session = await auth();
    if (!session || session.error) {
        redirect("/sign-in");
    }

    const room = await getDocument({ roomId: id, userId: session.user.email });

    if (!room) {
        redirect("/");
    }

    // TODO: Assess the permissions of the user to access the document
    const userIds = Object.keys(room.usersAccesses);
    const users = await getUsers(userIds);

    const usersData = users.map((user: User) => ({
        ...user,
        userType: room.usersAccesses[user.email]?.includes("room:write")
            ? "editor"
            : "viewer",
    }));

    const currentUserType = room.usersAccesses[session.user.email]?.includes(
        "room:write",
    )
        ? "editor"
        : "viewer";

    return (
            <main className="flex w-full flex-col items-center">
                <CollaborativeRoom
                    roomId={id}
                    roomMetadata={room.metadata}
                    users={usersData}
                    currentUserType={currentUserType}
                />
            </main>
    );
};

export default Document;
