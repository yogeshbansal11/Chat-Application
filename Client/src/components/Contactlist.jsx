import { useAppStore } from "@/Store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { split } from "postcss/lib/list";

const HOST = import.meta.env.VITE_SERVER_URL;

const Contactlist = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");

    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="User's profile picture"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`
                      ${selectedChatData && selectedChatData._id === contact._id 
                        ? "bg-[#ffffff2] border-2 border-white/70" 
                        : getColor(contact.color)
                      }
                      uppercase h-10 w-10 text-lg border flex items-center justify-center rounded-full
                    `}
                  >
                    {contact.firstName
                      ? contact.firstName.split("").shift()
                      : contact.email.split("").shift()
                 }
                  </div>
                )}
              </Avatar>
            )}

            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>
            )}

            
              {isChannel
                ? ( <span> {contact.name} </span>
                ) : (
                // <span>{contact.firstName ?`${contact.firstName} ${contact.lastName}`:contact.email}  <span/>
                <span>
  {contact.firstName ? `${contact.firstName} ${contact.lastName}` : contact.email}
</span>

          )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Contactlist;
