import { MicrophoneIcon, StopCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

function AudioRecorder({ fileReady }) {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    const onMicrophoneClick = async () => {
        if (isRecording) {
            setIsRecording(false);
            if (mediaRecorder) {
                mediaRecorder.stop();
                setMediaRecorder(null);
            }
            return;
        }
        setIsRecording(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const newMediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            newMediaRecorder.addEventListener("dataavailable", (event) => {
                chunks.push(event.data);
            });

            newMediaRecorder.addEventListener("stop", (event) => {
                let audiBlob = new Blob(chunks, {
                    type: "audio/ogg; codecs=opus",
                });
                const timestamp = new Date().getTime();
                let audioFile = new File(
                    [audiBlob],
                    `recorded_audio_${timestamp}.ogg`,
                    {
                        type: "audio/ogg; codecs=opus",
                    },
                );

                const url = URL.createObjectURL(audioFile);
                fileReady(audioFile, url);
            });
            newMediaRecorder.start();
            setMediaRecorder(newMediaRecorder);
        } catch (error) {
            setIsRecording(false);
            console.error("Error accessing microphone:", error);
        }
    };

    return (
        <button
            onClick={onMicrophoneClick}
            className="p-1 text-gray-400 hover:text-gray-200"
        >
            {isRecording && <StopCircleIcon className="w-6 text-red-400" />}
            {!isRecording && <MicrophoneIcon className="w-6" />}
        </button>
    );
}

export default AudioRecorder;
