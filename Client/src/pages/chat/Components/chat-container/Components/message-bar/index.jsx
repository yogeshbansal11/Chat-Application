import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/Store";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { UPLOAD_FILE_ROUTE } from "../../../../../../../utils/constants";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef();
  const emojiRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress, } = useAppStore();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    } else if(selectedChatType === "channel"){
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }
    setMessage("")
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress:data=>{
            setFileUploadProgress(Math.round((100*data.loaded) / data.total));
          }
        });

        if (response.status === 200 && response.data) {
          setIsUploading(false)
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          } else if(selectedChatType==="channel"){
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl:response.data.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      }
      console.log({ file });
    } catch (error) {
      setIsUploading(false)
      console.log(error);
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none "
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* btn1 */}
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>

        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />

        <div className="realtive">
          {/* btn2 */}
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 
          transition-all"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>

          {/* btn3 */}
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>

      <button
        className="bg-gradient-to-br from-[#9b2eff] to-[#741bda] rounded-full flex items-center justify-center p-5 hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl focus:outline-none "
        onClick={handleSendMessage}
      >
        <IoSend className="text-3xl text-white drop-shadow-lg hover:animate-pulse" />
      </button>
    </div>
  );
};

export default MessageBar;
