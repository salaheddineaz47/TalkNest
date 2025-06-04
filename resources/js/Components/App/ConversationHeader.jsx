import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Link } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";

function ConversationHeader({ selectedConversation }) {
    // console.log("selectedConversation header:", selectedConversation);
    return (
        <>
            {selectedConversation && (
                <div className="flex items-center justify-between border-b border-slate-700 p-3">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("dashboard")}
                            className="inline-block sm:hidden"
                        >
                            <ArrowLeftIcon className="w-6" />
                        </Link>

                        {selectedConversation.is_user && (
                            <UserAvatar user={selectedConversation} />
                        )}
                        {selectedConversation.is_group && <GroupAvatar />}
                        <div>
                            <h3>{selectedConversation.name}</h3>
                            {selectedConversation.is_group && (
                                <p className="☐text-gray-500 text-xs">
                                    {selectedConversation?.user_ids?.length}{" "}
                                    members
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ConversationHeader;
