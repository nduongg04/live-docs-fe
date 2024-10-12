"use client";

import { auth } from "@/auth";
import Loader from "@/components/Loader";
import { getDocumentUsers, getUsers } from "@/lib/actions/user.action";
import {
    ClientSideSuspense,
    LiveblocksProvider,
} from "@liveblocks/react/suspense";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

const Provider = ({ children }: { children: React.ReactNode }) => {
	const session = useSession();
	
    return (
        <LiveblocksProvider
            resolveUsers={async ({ userIds }) => {
                const users = await getUsers(userIds);
                return users;
            }}
			resolveMentionSuggestions={async ({text, roomId}) => {
				const roomUsers = await getDocumentUsers({roomId, currentUser: session.data?.user?.email || "", text})
				return roomUsers;
			}}
            authEndpoint="/api/liveblocks-auth"
        >
            <ClientSideSuspense fallback={<Loader />}>
                {children}
            </ClientSideSuspense>
        </LiveblocksProvider>
    );
};

export default Provider;