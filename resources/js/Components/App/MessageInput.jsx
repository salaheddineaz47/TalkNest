import {
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    PhotoIcon,
    XCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import NewMessageInput from "./NewMessageInput";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { isAudio, isImage } from "@/utils/helpers";
import AttachmentPreview from "./AttachmentPreview";
import CustomAudioPlayer from "./CustomAudioPlayer";

function MessageInput({ conversation = null }) {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [chosenFiles, setChosenFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onFileChange = (ev) => {
        const files = ev.target.files;

        const updatedFiles = [...files].map((file) => {
            return {
                file,
                url: URL.createObjectURL(file),
            };
        });
        ev.target.value = null; // Reset the input value to allow re-uploading the same file

        setChosenFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
    };

    const onSendClick = () => {
        if (isSending) return;
        if (newMessage.trim() === "" && chosenFiles.length === 0) {
            setInputErrorMessage(
                "Please provide a message or upload attachments.",
            );
            setTimeout(() => {
                setInputErrorMessage("");
            }, 3000);
            return;
        }
        const formData = new FormData();

        chosenFiles.forEach((fileObj) => {
            formData.append("attachments[]", fileObj.file);
        });

        formData.append("message", newMessage);
        if (conversation.is_group) {
            formData.append("group_id", conversation.id);
        } else if (conversation.is_user) {
            formData.append("receiver_id", conversation.id);
        }

        setIsSending(true);
        axios
            .post(route("message.store"), formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    console.log(`Upload progress: ${progress}%`);
                    setUploadProgress(progress);
                },
            })
            .then((response) => {
                setIsSending(false);
                setNewMessage("");
                setUploadProgress(0);
                setChosenFiles([]);
            })
            .catch((error) => {
                setIsSending(false);
                setUploadProgress(0);
                setChosenFiles([]);
                const message =
                    error.response?.data?.message ||
                    "An error occurred while sending message.";
                setInputErrorMessage(message);
                console.error("Error sending message:", error);
                setTimeout(() => {
                    setInputErrorMessage("");
                }, 3000);
            });
    };

    const onLikeClick = (ev) => {
        if (isSending) return;
        const data = {
            message: "👍",
        };
        if (conversation.is_group) {
            data["group_id"] = conversation.id;
        } else if (conversation.is_user) {
            data["receiver_id"] = conversation.id;
        }

        axios.post(route("message.store"), data);
    };

    // console.log("conversation message input:", conversation);
    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3">
            <div className="xs:flex-none xs:order-1 order-2 flex-1 p-2">
                <button className="relative p-1 text-gray-400 hover:text-gray-300">
                    <PaperClipIcon className="w-6" />
                    <input
                        onChange={onFileChange}
                        type="file"
                        multiple
                        className="absolute top-0 right-0 bottom-0 left-0 z-20 cursor-pointer opacity-0"
                    />
                </button>
                <button className="relative p-1 text-gray-400 hover:text-gray-300">
                    <PhotoIcon className="w-6" />
                    <input
                        onChange={onFileChange}
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute top-0 right-0 bottom-0 left-0 z-20 cursor-pointer opacity-0"
                    />
                </button>
            </div>
            <div className="xs:p-0 xs:basis-0 xs:order-2 relative order-1 min-w-[220px] flex-1 basis-full px-3">
                <div className="flex">
                    <NewMessageInput
                        value={newMessage}
                        onChange={(ev) => setNewMessage(ev.target.value)}
                        onSend={onSendClick}
                    />
                    <button
                        onClick={onSendClick}
                        disabled={isSending}
                        className="btn btn-info rounded-l-none"
                    >
                        <PaperAirplaneIcon className="w-6" />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>

                {!!uploadProgress && (
                    <progress
                        className="progress progress-info w-full"
                        value={uploadProgress}
                        max="100"
                    ></progress>
                )}
                {inputErrorMessage && (
                    <p className="text-xs text-red-400">{inputErrorMessage}</p>
                )}

                <div className="mt-2 flex flex-wrap gap-1">
                    {chosenFiles.map((fileObj) => (
                        <div
                            key={fileObj.file.name}
                            className={`relative flex justify-between ${!isImage(fileObj.file) ? "w-[240px]" : ""}`}
                        >
                            {isImage(fileObj.file) && (
                                <img
                                    src={fileObj.url}
                                    alt={fileObj.file.name}
                                    className="h-16 w-16 object-cover"
                                />
                            )}
                            {isAudio(fileObj.file) && (
                                <CustomAudioPlayer
                                    file={fileObj}
                                    showVolume={false}
                                />
                            )}

                            {!isImage(fileObj.file) &&
                                !isAudio(fileObj.file) && (
                                    <AttachmentPreview file={fileObj} />
                                )}

                            <button className="absolute -top-2 -right-2 z-10 h-6 w-6 rounded-full bg-gray-800 text-gray-300 hover:text-gray-100">
                                <XCircleIcon className="w-6" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="xs:order-3 order-3 flex p-2">
                <Popover className="relative">
                    <PopoverButton className="block p-1 text-gray-400 hover:text-gray-300 focus:outline-none data-active:text-white">
                        <FaceSmileIcon className="h-6 w-6" />
                    </PopoverButton>
                    <PopoverPanel className="absolute right-0 bottom-full z-10">
                        <div onClick={(e) => e.stopPropagation()}>
                            <EmojiPicker
                                theme="dark"
                                onEmojiClick={(ev) => {
                                    setNewMessage((mess) => mess + ev.emoji);
                                }}
                            />
                        </div>
                    </PopoverPanel>
                </Popover>
                <button
                    onClick={onLikeClick}
                    className="p-1 text-gray-400 hover:text-gray-300"
                >
                    <HandThumbUpIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
}

export default MessageInput;
