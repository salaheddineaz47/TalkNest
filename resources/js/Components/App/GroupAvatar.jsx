import { UsersIcon } from "@heroicons/react/24/solid";
const GroupAvatar = ({}) => {
    return (
        <>
            <div className={`avatar avatar-placeholder`}>
                <div className={`w-8 rounded-full bg-gray-400 text-gray-800`}>
                    <span className="text-x1">
                        <UsersIcon className="w-4" />
                    </span>
                </div>
            </div>
        </>
    );
};
export default GroupAvatar;
