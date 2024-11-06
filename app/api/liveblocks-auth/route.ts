import { auth } from "@/auth";
import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
    // Get the current user from your database
    const session = await auth();
    if (!session || session.error || !session.user) {
        redirect("/sign-in");
    }
	console.log(session);
    const {id, displayName, email, avatar} = session.user;

	const user = {
		id, 
		info: {
			id, 
			name: displayName,
			email,
			avatar,
			color: getUserColor(id!),
		}
	}


    // Identify the user and return the result
    const { status, body } = await liveblocks.identifyUser(
        {
            userId: user.info.email!,
            groupIds: []
        },
        { userInfo: {
			id: user.info.id!,
			name: user.info.name!,
			email: user.info.email!,
			avatar: user.info.avatar!,
			color: user.info.color!,
		} },
    );

    return new Response(body, { status });
}
