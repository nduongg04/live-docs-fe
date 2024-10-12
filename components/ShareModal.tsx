import { useSelf } from "@liveblocks/react/suspense";
import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import UserTypeSelector from "./UserTypeSelector";
import Collaborator from "./Collaborator";
import { updateDocumentAccess } from "@/lib/actions/room.action";
import { getUsers } from "@/lib/actions/user.action";

const ShareModal = ({
    roomId,
    collaborators,
    creatorId,
    currentUserType,
}: ShareDocumentDialogProps) => {
    const user = useSelf();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [userType, setUserType] = useState<UserType>("viewer");
	const [error, setError] = useState("");

    const shareDocumentHandler = async () => {
		setLoading(true);
		const user = await getUsers([email]);
		if (user.length === 0) {
			setLoading(false);
			setError("User not found");
			return;
		}
        await updateDocumentAccess({
            roomId,
            email,
            userType: userType,
            updatedBy: user.info,
        });

        setLoading(false);
	};

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger disabled={currentUserType !== "editor"}>
                <Button
                    className="gradient-blue flex h-9 gap-1 px-4"
                    disabled={currentUserType !== "editor"}
                >
                    <Image
                        src="/assets/icons/share.svg"
                        alt="share"
                        width={20}
                        height={20}
                        className="min-w-4 md:size-5"
                    />
                    <p className="mr-1 hidden sm:block">Share</p>
                </Button>
            </DialogTrigger>
            <DialogContent className="shad-dialog">
                <DialogHeader>
                    <DialogTitle>Manage who can view this document</DialogTitle>
                    <DialogDescription>
                        Select which users can view and edit this document
                    </DialogDescription>
                </DialogHeader>
                <Label htmlFor="email" className="mt-6 text-blue-100 flex gap-2 flex-col">
                    Email address
				{error !== "" && <p className="text-red-500">{error}</p>}
                </Label>
                <div className="flex items-center gap-3">
                    <div className="flex flex-1 rounded-md bg-dark-400">
                        <Input
                            id="email"
                            placeholder="Enter email address"
                            value={email}
                            className="share-input"
                            onChange={(e) => {
								setError("");
								setEmail(e.target.value);
							}}
                        />
                        <UserTypeSelector
                            userType={userType}
                            setUserType={setUserType}
                        />
                    </div>
                    <Button
                        type="submit"
                        onClick={shareDocumentHandler}
                        className="gradient-blue flex h-full gap-1 px-5"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Invite"}
                    </Button>
                </div>

                <div className="my-2 space-y-2">
                    <ul className="flex flex-col">
                        {collaborators.map((collaborator) => (
                            <Collaborator
                                key={collaborator.id}
                                roomId={roomId}
                                creatorId={creatorId}
                                email={collaborator.email}
                                collaborator={collaborator}
                                user={user.info}
                            />
                        ))}
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareModal;
