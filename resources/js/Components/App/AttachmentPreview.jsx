import { formatBytes, isPDF, isPreviewable } from "@/utils/helpers";
import { PaperClipIcon } from "@heroicons/react/24/solid";

const AttachmentPreview = ({ file }) => {
    return (
        <div className="flex w-full items-center gap-2 rounded-md bg-slate-800 px-3 py-2">
            <div>
                {isPDF(file.file) && (
                    <img src="/img/pdf.webp" className="w-8" />
                )}
                {!isPreviewable(file.file) && (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-700">
                        <PaperClipIcon className="w-6" />
                    </div>
                )}
            </div>
            <div className="flex-1 overflow-hidden text-nowrap text-ellipsis text-gray-400">
                <h3>{file.file.name}</h3>
                <p className="text-xs">{formatBytes(file.file.size)}</p>
            </div>
        </div>
    );
};

export default AttachmentPreview;
