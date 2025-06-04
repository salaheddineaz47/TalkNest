import ConversationItem from "@/Components/App/ConversationItem";
import TextInput from "@/Components/TextInput";
import { useEventBus } from "@/contexts/EventBusContext";
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
    const { on } = useEventBus();

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
        const messageCreated = (message) => {
            setLocalConversations((prevConversations) => {
                return prevConversations.map((conv) => {
                    // Create a new conversation object to trigger re-render
                    let updatedConv = { ...conv };

                    // If the message is for user
                    if (
                        message.receiver_id &&
                        !updatedConv.is_group &&
                        (updatedConv.id == message.receiver_id ||
                            updatedConv.id == message.sender_id)
                    ) {
                        updatedConv.last_message_date = message.created_at;
                        updatedConv.last_message = message.message;
                        console.log("Message created for user:", updatedConv);
                        return updatedConv;
                    }

                    // If the message is for group
                    if (
                        message.group_id &&
                        updatedConv.is_group &&
                        updatedConv.id == message.group_id
                    ) {
                        updatedConv.last_message_date = message.created_at;
                        updatedConv.last_message = message.message;
                        console.log("Message created for group:", updatedConv);
                        return updatedConv;
                    }
                    return updatedConv;
                });
            });
        };
        // const messageCreated = (message) => {
        //     console.log("=== MESSAGE EVENT RECEIVED ===");
        //     console.log("Full message object:", message);
        //     console.log("Message text:", message.message);
        //     console.log("Message created_at:", message.created_at);
        //     console.log("Message receiver_id:", message.receiver_id);
        //     console.log("Message sender_id:", message.sender_id);
        //     console.log("Message group_id:", message.group_id);
        //     console.log("================================");

        //     setLocalConversations((prevConversations) => {
        //         console.log(
        //             "Previous conversations before update:",
        //             prevConversations,
        //         );

        //         const updatedConversations = prevConversations.map((conv) => {
        //             // If the message is for user conversation
        //             if (
        //                 message.receiver_id &&
        //                 !conv.is_group &&
        //                 (conv.id == message.receiver_id ||
        //                     conv.id == message.sender_id)
        //             ) {
        //                 console.log(
        //                     `MATCH FOUND: Updating user conversation ${conv.id}`,
        //                 );
        //                 console.log(`Old message: "${conv.last_message}"`);
        //                 console.log(`New message: "${message.message}"`);
        //                 console.log(`Old date: ${conv.last_message_date}`);
        //                 console.log(`New date: ${message.created_at}`);

        //                 const updated = {
        //                     ...conv,
        //                     last_message_date: message.created_at,
        //                     last_message: message.message,
        //                 };
        //                 console.log("Updated conversation object:", updated);
        //                 return updated;
        //             }

        //             // If the message is for group conversation
        //             if (
        //                 message.group_id &&
        //                 conv.is_group &&
        //                 conv.id == message.group_id
        //             ) {
        //                 console.log(
        //                     `MATCH FOUND: Updating group conversation ${conv.id}`,
        //                 );
        //                 console.log(`Old message: "${conv.last_message}"`);
        //                 console.log(`New message: "${message.message}"`);

        //                 const updated = {
        //                     ...conv,
        //                     last_message_date: message.created_at,
        //                     last_message: message.message,
        //                 };
        //                 console.log("Updated conversation object:", updated);
        //                 return updated;
        //             }

        //             // Return unchanged if message is not for this conversation
        //             return conv;
        //         });

        //         console.log(
        //             "Final updated conversations:",
        //             updatedConversations,
        //         );
        //         return updatedConversations;
        //     });
        // };
        const offCreated = on("message.created", messageCreated);
        return () => {
            offCreated();
        };
    }, [on]);

    useEffect(() => {
        setSortedConversations(
            [...localConversations].sort((a, b) => {
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
