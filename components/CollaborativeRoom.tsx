"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { useEffect, useRef, useState } from "react";
import ActiveCollaborators from "./ActiveCollaborators";
import { Editor } from "./editor/Editor";
import Header from "./Header";
import SignInOrProfile from "./SignInOrProfile";
import { Input } from "./ui/input";
import Image from "next/image";
import { updateDocumentTitle } from "@/lib/actions/room.action";
import Loader from "./Loader";
import ShareModal from "./ShareModal";

const CollaborativeRoom = ({
    roomId,
    roomMetadata,
    users,
    currentUserType,
}: CollaborativeRoomProps) => {
    const [loading, setLoading] = useState(false);
    const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
    const [editing, setEditing] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const updateTitleHandler = async (
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === "Enter") {
            setLoading(true);
            try {
                if (documentTitle !== roomMetadata.title) {
                    const updatedDocument = await updateDocumentTitle(
                        roomId,
                        documentTitle,
                    );
                    if (updatedDocument) {
                        setEditing(false);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setEditing(false);
                updateDocumentTitle(roomId, documentTitle);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [documentTitle, roomId]);

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader />}>
                <div className="collaborative-room">
                    <Header>
                        <div
                            ref={containerRef}
                            className="flex w-fit items-center justify-center gap-2"
                        >
                            {editing && !loading ? (
                                <Input
                                    ref={inputRef}
                                    type="text"
                                    value={documentTitle}
                                    onChange={(e) =>
                                        setDocumentTitle(e.target.value)
                                    }
                                    placeholder="Untitled"
                                    onKeyDown={updateTitleHandler}
                                    disabled={!editing}
                                    className="document-title-input"
                                />
                            ) : (
                                <p className="document-title">
                                    {documentTitle}
                                </p>
                            )}

                            {currentUserType === "editor" && !editing && (
                                <Image
                                    src="/assets/icons/edit.svg"
                                    alt="Edit"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer"
                                    onClick={() => setEditing(true)}
                                />
                            )}

                            {currentUserType !== "editor" && !editing && (
                                <p className="view-only-tag">View only</p>
                            )}

                            {loading && (
                                <p className="text-sm text-gray-400">
                                    Saving...
                                </p>
                            )}
                        </div>
                        <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
                            <ActiveCollaborators />
                            <ShareModal
                                roomId={roomId}
                                collaborators={users}
                                creatorId={roomMetadata.creatorId}
                                currentUserType={currentUserType}
                            />
                            <SignInOrProfile />
                        </div>
                    </Header>
                    <Editor roomId={roomId} currentUserType={currentUserType} />
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    );
};
export default CollaborativeRoom;
