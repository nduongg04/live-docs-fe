import { auth } from "@/auth";
import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
    // Get the current user from your database
    const session = await auth();
    if (!session || session.error) {
        redirect("/sign-in");
    }
    const {id, displayName, email, avatar} = session.user;

	const user = {
		id, 
		info: {
			id, 
			name: displayName,
			email,
			avatar,
			color: getUserColor(id),
		}
	}


    // Identify the user and return the result
    const { status, body } = await liveblocks.identifyUser(
        {
            userId: user.info.email,
            groupIds: []
        },
        { userInfo: user.info },
    );

    return new Response(body, { status });
}
