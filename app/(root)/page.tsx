import { auth } from "@/auth";
import AddDocumentBtn from "@/components/AddDocumentBtn";
import DeleteModal from "@/components/DeleteModal";
import Header from "@/components/Header";
import Notification from "@/components/Notification";
import SignInOrProfile from "@/components/SignInOrProfile";
import { getDocuments } from "@/lib/actions/room.action";
import { dateConverter } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Home = async () => {
    const session = await auth();
    if (!session || session.error) {
        redirect("/sign-in");
        return null; // Return early to prevent further rendering
    }

    const roomDocuments = await getDocuments(session.user.email);

    return (
        <main className="home-container">
            <Header className="sticky left-0 top-0">
                <div className="flex items-center gap-2 lg:gap-4">
                    <Notification />
                    <SignInOrProfile />
                </div>
            </Header>

            {roomDocuments.data.length > 0 ? (
                <div className="document-list-container">
                    <div className="document-list-title">
                        <h3 className="text-28-semibold">All documents</h3>
                        <AddDocumentBtn
                            userId={session.user.id}
                            email={session.user.email}
                        />
                    </div>
                    <ul className="document-ul">
                        {roomDocuments.data.map(
                            ({ id, metadata, createdAt }) => (
                                <li key={id} className="document-list-item">
                                    <Link
                                        href={`/documents/${id}`}
                                        className="flex flex-1 items-center gap-4"
                                    >
                                        <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                                            <Image
                                                src="/assets/icons/doc.svg"
                                                alt="File"
                                                width={40}
                                                height={40}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="line-clamp-1 text-lg">
                                                {metadata.title}
                                            </p>
                                            <p className="text-sm font-light text-blue-100">
                                                Created at{" "}
                                                {dateConverter(createdAt)}
                                            </p>
                                        </div>
                                    </Link>
                                    <DeleteModal roomId={id} />
                                </li>
                            ),
                        )}
                    </ul>
                </div>
            ) : (
                <div className="document-list-empty">
                    <Image
                        src="/assets/icons/doc.svg"
                        alt="Document"
                        width={40}
                        height={40}
                        className="mx-auto"
                    />
                    <AddDocumentBtn
                        userId={session.user.id}
                        email={session.user.email}
                    />
                </div>
            )}
        </main>
    );
};

export default Home;
