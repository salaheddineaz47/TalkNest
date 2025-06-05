import { useEventBus } from "@/contexts/EventBusContext";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import UserAvatar from "./UserAvatar";
import { Link } from "@inertiajs/react";

function NewMessageNotification({ message }) {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on("newMessageNotification", ({ message, user, group_id }) => {
            const uuid = uuidv4();
            setToasts((prevToasts) => [
                ...prevToasts,
                { message, uuid, user, group_id },
            ]);

            setTimeout(() => {
                setToasts((prevToasts) =>
                    prevToasts.filter((toast) => toast.uuid !== uuid),
                );
            }, 5000); // Remove toast after 5 seconds
        });
    }, [on]);

    return (
        <div className="toast toast-top toast-center min-w-[280px]">
            {toasts.map((toast, index) => (
                <div
                    key={toast.uuid}
                    className="alert alert-success rounded-md px-4 py-3 text-gray-100"
                >
                    <Link
                        href={
                            toast.group_id
                                ? route("chat.group", toast.group_id)
                                : route("chat.user", toast.user.id)
                        }
                        className="flex items-center gap-2"
                    >
                        <UserAvatar user={toast.user} />
                        <span>{toast.message}</span>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default NewMessageNotification;
