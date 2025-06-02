import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageInput from "@/Components/App/MessageInput";
import MessageItem from "@/Components/App/MessageItem";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ChatLayout from "@/Layouts/ChatLayout";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

function Home({ selectedConversation = null, messages = null }) {
    const [localMessages, setLocalMessages] = useState(messages);
    const messagesCtrRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            if (messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop =
                    messagesCtrRef.current.scrollHeight;
            }
        }, 10);
    }, [selectedConversation]);

    useEffect(() => {
        setLocalMessages(messages ? messages.data.slice().reverse() : []);
    }, [messages]);

    console.log("selectedConversation: Home", messages);

    return (
        <>
            {!messages && (
                <div className="flex h-full flex-col items-center justify-center gap-8 text-center opacity-35">
                    <div className="p-16 text-2xl text-slate-200 md:text-4xl">
                        Please select a conversation to see messages.
                    </div>
                    <ChatBubbleLeftRightIcon className="inline-block h-32 w-32 text-slate-500" />
                </div>
            )}

            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />
                    <div
                        ref={messagesCtrRef}
                        className="flex overflow-y-auto p-5"
                    >
                        {/* Messages */}

                        {localMessages.length === 0 && (
                            <div className="flex h-full items-center justify-center">
                                <div className="text-lg text-slate-200">
                                    No messages found.
                                </div>
                            </div>
                        )}

                        {localMessages.length > 0 && (
                            <div className="flex flex-1 flex-col">
                                {localMessages.map((message) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
            )}
        </>
    );
}

Home.layout = (page) => (
    <AuthenticatedLayout>
        <ChatLayout>{page}</ChatLayout>
    </AuthenticatedLayout>
);

export default Home;
