import {
    isAudio,
    isImage,
    isPDF,
    isPreviewable,
    isVideo,
} from "@/utils/helpers";
import { useEffect, useMemo, useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PaperClipIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";

function AttachmentPreviewModal({
    attachments,
    index,
    show = false,
    onClose = () => {},
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const previewableAttachments = useMemo(() => {
        return attachments.filter((att) => isPreviewable(att));
    }, [attachments]);

    const attachment = useMemo(() => {
        return previewableAttachments[currentIndex];
    }, [attachments, currentIndex]);

    const close = () => {
        onClose();
    };

    const prev = () => {
        if (currentIndex === 0) return;

        setCurrentIndex(currentIndex - 1);
    };

    const next = () => {
        if (currentIndex === previewableAttachments.length - 1) return;
        setCurrentIndex(currentIndex + 1);
    };

    useEffect(() => {
        setCurrentIndex(index);
    }, [index]);

    return (
        <>
            <Dialog
                open={show}
                as="div"
                id="modal"
                className="relative z-50 focus:outline-none"
                onClose={close}
            >
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="flex w-full transform flex-col overflow-hidden rounded-xl bg-slate-800 text-left align-middle shadow-xl backdrop-blur-2xl transition-all duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            <Button
                                className="absolute top-3 right-3 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-700 text-gray-100 hover:bg-gray-600"
                                onClick={close}
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </Button>
                            <div className="group relative h-full">
                                {currentIndex > 0 && (
                                    <div
                                        onClick={prev}
                                        className="absolute top-1/2 left-4 z-30 flex h-16 w-16 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-gray-100 opacity-100"
                                    >
                                        <ChevronLeftIcon className="w-12" />
                                    </div>
                                )}
                                {currentIndex <
                                    previewableAttachments.length - 1 && (
                                    <div
                                        onClick={next}
                                        className="absolute top-1/2 right-4 z-30 flex h-16 w-16 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-gray-100 opacity-100"
                                    >
                                        <ChevronRightIcon className="w-12" />
                                    </div>
                                )}

                                {attachment && (
                                    <div className="flex h-screen w-full items-center justify-center p-3">
                                        {isImage(attachment) && (
                                            <img
                                                src={attachment.url}
                                                className="max-h-full max-w-full"
                                            />
                                        )}
                                        {isVideo(attachment) && (
                                            <div className="flex items-center">
                                                <video
                                                    controls
                                                    autoPlay
                                                    src={attachment.url}
                                                    className="max-h-full max-w-full"
                                                ></video>
                                            </div>
                                        )}
                                        {isAudio(attachment) && (
                                            <div className="relative flex items-center justify-center">
                                                <audio
                                                    controls
                                                    autoPlay
                                                    src={attachment.url}
                                                ></audio>
                                            </div>
                                        )}
                                        {isPDF(attachment) && (
                                            <iframe
                                                src={attachment.url}
                                                className="h-full w-full"
                                            ></iframe>
                                        )}
                                        {!isPreviewable(attachment) && (
                                            <div className="flex flex-col items-center justify-center p-32 text-gray-100">
                                                <PaperClipIcon className="mb-3 h-10 w-10" />
                                                <small>{attachment.name}</small>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default AttachmentPreviewModal;
