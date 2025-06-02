import ConversationItem from "@/Components/App/ConversationItem";
import TextInput from "@/Components/TextInput";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

function ChatLayout({ children }) {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});

    const isUserOnline = (userId) => onlineUsers[userId];
    // console.log("conversations:", conversations);
    // console.log("selected conversations:", selectedConversation);

    const onSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return conversation.name?.toLowerCase().includes(searchTerm);
            }),
        );
    };

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.blocked_at && b.blocked_at)
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                else if (a.blocked_at)
                    return 1; // a is blocked, b is not
                else if (b.blocked_at) return -1; // b is blocked, a is not

                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(
                        a.last_message_date,
                    );
                } else if (a.last_message_date) {
                    return -1; // a has a last message date, b does not
                } else if (b.last_message_date) {
                    return 1; // b has a last message date, a does not
                } else {
                    return 0; // neither has a last message date
                }
            }),
        );
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    useEffect(() => {
        // Add a small delay to ensure Echo is initialized
        const timer = setTimeout(() => {
            const channel = Echo.join("online");

            channel
                .here((users) => {
                    // console.log("Users currently online in chat:", users);
                    const onlineUsers = Object.fromEntries(
                        users.map((user) => [user.id, user]),
                    );
                    setOnlineUsers((prevOnlineUsers) => {
                        return {
                            ...prevOnlineUsers,
                            ...onlineUsers,
                        };
                    });
                })
                .joining((user) => {
                    // console.log("User joined chat:", user);
                    setOnlineUsers((prevUsers) => ({
                        ...prevUsers,
                        [user.id]: user,
                    }));
                })
                .leaving((user) => {
                    setOnlineUsers((prevUsers) => {
                        const updatedUsers = { ...prevUsers };
                        delete updatedUsers[user.id];
                        return updatedUsers;
                    });
                    // console.log("User left chat:", user);
                })
                .error((error) => {
                    console.error("Error joining chat channel:", error);
                });

            // Cleanup on unmount
            return () => {
                channel.leave();
            };
        }, 1000); // 1 second delay

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="flex w-full flex-1 overflow-hidden">
                <div
                    className={`flex w-full flex-col overflow-hidden bg-slate-800 transition-all sm:w-[220px] md:w-[300px] ${
                        selectedConversation ? "-ml-[100%] sm:ml-0" : ""
                    }`}
                >
                    <div className="flex items-center justify-between px-3 py-2 text-xl font-medium text-gray-200">
                        My conversations
                        <div
                            className="tooltip tooltip-left"
                            data-tip="Create new Group"
                        >
                            <button className="text-gray-400 hover:text-gray-200">
                                <PencilSquareIcon className="ml-2 inline-block h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder="filter users and groups"
                            className="w-full"
                        />
                    </div>
                    <div className="flex-1 overflow-auto">
                        {sortedConversations &&
                            sortedConversations.map((conversation) => (
                                <ConversationItem
                                    key={`${
                                        conversation.is_group
                                            ? "group_"
                                            : "user_"
                                    }${conversation.id}`}
                                    conversation={conversation}
                                    online={!!isUserOnline(conversation.id)}
                                    selectedConversation={selectedConversation}
                                />
                            ))}
                    </div>
                </div>
                <div className="flex flex-1 flex-col overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    );
}

export default ChatLayout;
