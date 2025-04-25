import { useAppStore } from "@/Store";
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

const HOST = import.meta.env.VITE_SERVER_URL;

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center">
          {selectedChatType === "contact" ? (
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {selectedChatData.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`}
                  alt="User's profile picture"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 text-lg border flex items-center justify-center rounded-full ${getColor(
                    selectedChatData.color
                  )}`}
                >
                  {selectedChatData.firstName
                    ? selectedChatData.firstName[0]
                    : selectedChatData.email
                    ? selectedChatData.email[0]
                    : "G"}
                </div>
              )}
            </Avatar>
          ) : (
            <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full text-white text-xl font-semibold">
              #
            </div>
          )}

          <div className="text-white text-lg font-medium">
            {selectedChatType === "channel"
              ? selectedChatData.name
              : selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email}
          </div>
        </div>

        <button
          className="text-neutral-500 hover:text-white transition-all duration-300"
          onClick={closeChat}
        >
          <RiCloseFill className="text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
