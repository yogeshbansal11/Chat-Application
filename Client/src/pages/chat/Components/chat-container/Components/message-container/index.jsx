import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/Store";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

const HOST = import.meta.env.VITE_SERVER_URL;

const Messages = () => {
  const scrollRef = useRef();
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  const {
    selectedChatMessages,
    setSelectedChatMessages,
    selectedChatData,
    selectedChatType,
    userInfo,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const route =
          selectedChatType === "contact"
            ? `/api/message/${selectedChatData._id}`
            : `/api/message/channel/${selectedChatData._id}`;

        const response = await apiClient.get(route);
        setSelectedChatMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (selectedChatData && selectedChatType) fetchMessages();
  }, [selectedChatData, selectedChatType]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatMessages]);

  const isImage = (fileName) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);

  const downloadFile = async (filePath) => {
    try {
      setIsDownloading(true);
      const res = await apiClient.get(`${HOST}/${filePath}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setFileDownloadProgress(percentCompleted);
        },
      });

      const blob = new Blob([res.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filePath.split("/").pop();
      link.click();

      setTimeout(() => {
        setIsDownloading(false);
        setFileDownloadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Download failed:", error);
      setIsDownloading(false);
    }
  };

  const renderMessageContent = (message) => {
    if (message.messageType === "text") {
      return <span>{message.content}</span>;
    }

    if (message.messageType === "file") {
      const fileName = message.content;
      const fileUrl = `${HOST}/${fileName}`;

      if (isImage(fileName)) {
        return (
          <img
            src={fileUrl}
            alt="img"
            className="w-40 h-40 rounded cursor-pointer"
            onClick={() => {
              setImageURL(fileUrl);
              setShowImage(true);
            }}
          />
        );
      }

      return (
        <div
          className="flex items-center gap-2 bg-blue-100 p-2 rounded-lg cursor-pointer"
          onClick={() => downloadFile(fileName)}
        >
          <MdFolderZip size={20} />
          <span className="truncate max-w-[150px]">{fileName.split("/").pop()}</span>
          <IoMdArrowRoundDown />
        </div>
      );
    }

    return null;
  };

  const renderContactMessages = () => {
    let lastDate = "";

    return selectedChatMessages.map((message) => {
      const currentDate = moment(message.timestamp).format("DD MMM, YYYY");
      const showDate = currentDate !== lastDate;
      lastDate = currentDate;

      const isSelf = message.senderId === userInfo._id;

      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 text-sm py-2">{currentDate}</div>
          )}

          <div className={`flex ${isSelf ? "justify-end" : "justify-start"} my-2`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-xl break-words ${
                isSelf ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              {renderMessageContent(message)}
              <div className="text-xs mt-1 text-right text-gray-300">
                {moment(message.timestamp).format("LT")}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  const renderChannelMessages = (message) => {
    let lastDate = "";

    return selectedChatMessages.map((message) => {
      const currentDate = moment(message.timestamp).format("DD MMM, YYYY");
      const showDate = currentDate !== lastDate;
      lastDate = currentDate;

      const isSelf = message.senderId === userInfo._id;

      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 text-sm py-2">{currentDate}</div>
          )}

          <div className={`flex ${isSelf ? "justify-end" : "justify-start"} my-2`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-xl break-words ${
                isSelf ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              <div className="font-semibold text-sm text-gray-600 mb-1">
                {message.senderName}
              </div>
              {renderMessageContent(message)}
              <div className="text-xs mt-1 text-right text-gray-300">
                {moment(message.timestamp).format("LT")}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  const renderChatMessages = () => {
    return selectedChatType === "contact"
      ? renderContactMessages()
      : renderChannelMessages();
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 relative">
      {renderChatMessages()}
      <div ref={scrollRef} />

      {showImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <img src={imageURL} className="max-h-[90vh] max-w-[90vw] rounded" />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                className="p-2 bg-white rounded-full"
                onClick={() => downloadFile(imageURL.replace(`${HOST}/`, ""))}
              >
                <IoMdArrowRoundDown size={20} />
              </button>
              <button
                className="p-2 bg-white rounded-full"
                onClick={() => setShowImage(false)}
              >
                <IoCloseSharp size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
