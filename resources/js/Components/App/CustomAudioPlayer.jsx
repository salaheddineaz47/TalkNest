import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import React, { useRef, useState } from "react";

function CustomAudioPlayer({ file, showVolume = true }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                console.log(audio, audio.duration);
                setDuration(audio.duration);
                audio.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio) {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration);
        }
    };

    const handleLoadedMetadata = (e) => {
        setDuration(e.target.duration);
    };

    const handleSeekChange = (e) => {
        const time = e.target.value;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    return (
        <div className="flex w-full items-center gap-2 rounded-md bg-slate-800 px-3 py-2">
            <audio
                ref={audioRef}
                src={file.url}
                controls
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="hidden"
            />
            <button onClick={togglePlayPause}>
                {isPlaying && <PauseCircleIcon className="w-6 text-gray-400" />}
                {!isPlaying && <PlayCircleIcon className="w-6 text-gray-400" />}
            </button>
            {showVolume && (
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    onChange={handleVolumeChange}
                    value={volume}
                />
            )}
            <input
                type="range"
                className="flex-1"
                min="0"
                max={duration}
                step="0.01"
                onChange={handleSeekChange}
                value={currentTime}
            />
        </div>
    );
}

export default CustomAudioPlayer;
