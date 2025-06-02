import { useEffect, useRef } from "react";

function NewMessageInput({ value, onChange, onSend }) {
    const inputRef = useRef(null);

    const onInputKeyDown = (ev) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            onSend();
        }
    };

    const onChangeEvent = (ev) => {
        setTimeout(() => {
            adjustHeight();
        }, 10);
        onChange(ev);
    };

    const adjustHeight = () => {
        setTimeout(() => {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = `${inputRef.current.scrollHeight + 1}px`;
        }, 100);
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    return (
        <textarea
            ref={inputRef}
            value={value}
            rows="1"
            placeholder="Type a message"
            onKeyDown={onInputKeyDown}
            onChange={onChangeEvent}
            className="input input-bordered max-h-40 w-full resize-none overflow-y-auto rounded-r-none px-3 py-2"
        ></textarea>
    );
}

export default NewMessageInput;
