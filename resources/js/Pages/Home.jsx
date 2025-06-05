import AttachmentPreviewModal from "@/Components/App/AttachmentPreviewModal";
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageInput from "@/Components/App/MessageInput";
import MessageItem from "@/Components/App/MessageItem";
import { useEventBus } from "@/contexts/EventBusContext";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ChatLayout from "@/Layouts/ChatLayout";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

function Home({ selectedConversation = null, messages = null }) {
    const [localMessages, setLocalMessages] = useState(messages);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const messagesCtrRef = useRef(null);
    const loadMoreInteresectRef = useRef(null);
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});
    const { on } = useEventBus();

    const messageCreated = (message) => {
        if (
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }
        if (
            selectedConversation &&
            selectedConversation.is_user &&
            (selectedConversation.id == message.sender_id ||
                selectedConversation.id == message.receiver_id)
        ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }
    };

    const loadMoreMessages = useCallback(() => {
        // console.log("Loading more messages...", noMoreMessages);
        if (noMoreMessages) return;

        const firstMessage = localMessages[0];
        axios
            .get(route("message.loadOlder", firstMessage.id))
            .then(({ data }) => {
                if (data.data.length === 0) {
                    // console.log("No more messages to load.");
                    setNoMoreMessages(true);
                    return;
                }
                // calculate how much is scrolled from bottom and scroll to the same position from bottom after the messages are loaded
                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrollTop = messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;
                const tmpScrollFromBottom =
                    scrollHeight - scrollTop - clientHeight;
                // console.log("tmpScrollFromBottom:", tmpScrollFromBottom);
                setScrollFromBottom(tmpScrollFromBottom);
                setLocalMessages((prevMessages) => [
                    ...data.data.reverse(),
                    ...prevMessages,
                ]);
            });
    }, [localMessages, noMoreMessages]);

    const onAttachmentClick = (attachments, ind) => {
        setPreviewAttachment({ attachments, ind });
        setShowAttachmentPreview(true);
    };

    useEffect(() => {
        setTimeout(() => {
            if (messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop =
                    messagesCtrRef.current.scrollHeight;
            }
        }, 10);

        const offCreated = on("message.created", messageCreated);

        setScrollFromBottom(0);
        setNoMoreMessages(false);

        return () => {
            offCreated();
        };
    }, [selectedConversation]);

    useEffect(() => {
        setLocalMessages(messages ? messages.data.slice().reverse() : []);
    }, [messages]);

    useEffect(() => {
        // Recover scroll from bottom after messages are loaded
        if (messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop =
                messagesCtrRef.current.scrollHeight -
                messagesCtrRef.current.offsetHeight -
                scrollFromBottom;
        }

        if (noMoreMessages) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        loadMoreMessages();
                    }
                });
            },
            {
                root: messagesCtrRef.current,
                rootMargin: "0px 0px 800px 0px",
            },
        );

        if (loadMoreInteresectRef.current) {
            setTimeout(() => {
                observer.observe(loadMoreInteresectRef.current);
            }, 100);
        }

        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, [localMessages]);

    // console.log("selectedConversation: Home", messages);

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
                                <div ref={loadMoreInteresectRef}></div>
                                {localMessages.map((message) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                        attachmentClick={onAttachmentClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
            )}
            {previewAttachment.attachments && (
                <AttachmentPreviewModal
                    attachments={previewAttachment.attachments}
                    index={previewAttachment.ind}
                    show={showAttachmentPreview}
                    onClose={() => setShowAttachmentPreview(false)}
                />
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
