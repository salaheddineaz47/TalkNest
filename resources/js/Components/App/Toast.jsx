import { useEventBus } from "@/contexts/EventBusContext";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function Toast({ message }) {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on("toast.show", (message) => {
            const uuid = uuidv4();
            setToasts((prevToasts) => [...prevToasts, { message, uuid }]);

            setTimeout(() => {
                setToasts((prevToasts) =>
                    prevToasts.filter((toast) => toast.uuid !== uuid),
                );
            }, 5000); // Remove toast after 5 seconds
        });
    }, [on]);

    return (
        <div className="toast min-w-[280px]">
            {toasts.map((toast, index) => (
                <div
                    key={toast.uuid}
                    className="alert alert-success rounded-md px-4 py-3 text-gray-100"
                >
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}

export default Toast;
