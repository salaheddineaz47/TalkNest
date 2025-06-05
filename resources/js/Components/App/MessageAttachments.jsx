import {
    isAudio,
    isImage,
    isPDF,
    isPreviewable,
    isVideo,
} from "@/utils/helpers";
import {
    ArrowDownTrayIcon,
    PaperClipIcon,
    PlayCircleIcon,
} from "@heroicons/react/24/solid";

const MessageAttachments = ({ attachments, attachmentClick }) => {
    return (
        <>
            {attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-end gap-1">
                    {attachments.map((attachment, ind) => (
                        <div
                            onClick={(ev) => attachmentClick(attachments, ind)}
                            key={attachment.id}
                            className={`group relative flex flex-col items-center justify-center ${
                                isAudio(attachment)
                                    ? "w-84"
                                    : "aspect-square w-32 bg-blue-100"
                            }`}
                        >
                            {!isAudio(attachment) && (
                                <a
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className="absolute top-0 right-0 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-gray-700 text-gray-100 opacity-100 transition-all group-hover:opacity-100 hover:bg-gray-800"
                                >
                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                </a>
                            )}

                            {isImage(attachment) && (
                                <img
                                    src={attachment.url}
                                    className="aspect-square object-contain"
                                />
                            )}

                            {isVideo(attachment) && (
                                <div className="relative flex items-center justify-center">
                                    <PlayCircleIcon className="absolute z-20 h-16 w-16 text-white opacity-70" />
                                    <div className="absolute top-0 left-0 z-10 h-full w-full bg-black/50"></div>
                                    <video src={attachment.url}></video>
                                </div>
                            )}
                            {isAudio(attachment) && (
                                <div className="relative flex items-center justify-center">
                                    <audio
                                        src={attachment.url}
                                        controls
                                    ></audio>
                                </div>
                            )}

                            {isPDF(attachment) && (
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute top-0 right-0 bottom-0 left-0"></div>
                                    <iframe
                                        src={attachment.url}
                                        className="h-full w-full"
                                    ></iframe>
                                </div>
                            )}
                            {!isPreviewable(attachment) && (
                                <a
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className="flex flex-col items-center justify-center"
                                >
                                    <PaperClipIcon className="mb-3 h-10 w-10" />
                                    <small className="text-center">
                                        {attachment.name}{" "}
                                    </small>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default MessageAttachments;
