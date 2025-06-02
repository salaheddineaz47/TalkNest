import {
    EllipsisVerticalIcon,
    LockOpenIcon,
    ShieldCheckIcon,
    UserIcon,
} from "@heroicons/react/24/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import axios from "axios";

export default function UserOptionsDropdown({ conversation }) {
    const onBlockUser = () => {
        console.log("Block user clicked");
        if (!conversation.is_user) return;

        axios
            .post(
                route("user.blockUnblock", {
                    conversation: conversation.id,
                }),
            )
            .then((response) => {
                console.log(response.data);
                // Show success notification
            })
            .catch((error) => {
                console.error(error);
                // Show error notification
            });
    };
    const changeUserRole = () => {
        console.log("Change user role clicked");
        if (!conversation.is_user) return;

        // send axios post request to change user role and show notification on succes
        axios
            .post(
                route("user.changeRole", {
                    conversation: conversation.id,
                }),
            )
            .then((response) => {
                console.log("User role changed successfully:", response.data);
                // Show success notification
            })
            .catch((error) => {
                console.error("Error changing user role:", error);
                // Show error notification
            });
    };

    return (
        <div>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <MenuButton className="☐hover:bg-black/40 flex h-8 w-8 items-center justify-center rounded-full">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                    </MenuButton>
                </div>
                <MenuItems
                    transition
                    anchor="bottom end"
                    className="z-50 w-52 origin-top-right rounded-xl border border-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out focus:outline-none dark:bg-white/5"
                >
                    <div className="p-1">
                        <MenuItem>
                            {({ active }) => (
                                <button
                                    onClick={onBlockUser}
                                    className={`${
                                        active
                                            ? "dark:bg-black/30 dark:text-white"
                                            : "dark:bg-gray-100"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                    {conversation.blocked_at && (
                                        <>
                                            <LockOpenIcon className="mr-2 h-4 w-4" />{" "}
                                            Unblock User
                                        </>
                                    )}
                                    {!conversation.blocked_at && (
                                        <>
                                            <LockOpenIcon className="mr-2 h-4 w-4" />{" "}
                                            block User
                                        </>
                                    )}
                                </button>
                            )}
                        </MenuItem>
                    </div>
                    <div className="p-1">
                        <MenuItem>
                            {({ active }) => (
                                <button
                                    onClick={changeUserRole}
                                    className={`${
                                        active
                                            ? "dark:bg-black/30 dark:text-white"
                                            : "dark:bg-gray-100"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                    {conversation.is_admin && (
                                        <>
                                            <UserIcon className="mr-2 h-4 w-4" />{" "}
                                            Make Regular User
                                        </>
                                    )}
                                    {!conversation.is_admin && (
                                        <>
                                            <ShieldCheckIcon className="mr-2 h-4 w-4" />{" "}
                                            Make Admin
                                        </>
                                    )}
                                </button>
                            )}
                        </MenuItem>
                    </div>
                </MenuItems>
            </Menu>
        </div>
    );
}
