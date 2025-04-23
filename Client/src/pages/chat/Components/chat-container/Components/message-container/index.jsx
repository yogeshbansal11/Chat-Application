

import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/Store";
import moment from "moment";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  GET_ALL_MESSAGE_ROUTE,
  HOST,
} from "../../../../../../../utils/constants";

import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    setIsDownloading,
    setFileDownloadProgress,
    selectedChatMessages,
    userInfo,
    selectedChatType,
    selectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setFileDownloadProgress(percentCompleted);
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", decodeURIComponent(url.split("/").pop()));
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
      setFileDownloadProgress(0);
  };
  
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGE_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.message) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" ? (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      ) : message.messageType === "file" ? (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/uploads/file/${message.fileUrl}`}
                alt="sent file"
                height={300}
                width={300}
                loading="lazy"
                className="rounded"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{decodeURIComponent(message.fileUrl.split("/").pop())}</span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-500 italic">Unsupported message type</div>
      )}

      <div className="text-xs text-gray-600 mt-1">
        {moment(message.timestamp).isValid()
          ? moment(message.timestamp).format("LT")
          : "Unknown Time"}
      </div>
    </div>
  );

  const renderMessages = () => {
    if (!selectedChatMessages.length) {
      return <div className="text-center text-gray-400">No messages yet.</div>;
    }

    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message._id || index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).isValid()
                ? moment(message.timestamp).format("LL")
                : "Unknown Date"}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full flex flex-col">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-screen flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageURL}`}
              className="max-h-[80vh] max-w-[90vw] object-contain rounded shadow-lg"
              alt="Preview"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageURL)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;








// import { apiClient } from "@/lib/api-client";
// import { useAppStore } from "@/Store";
// import moment from "moment";
// import { useEffect, useRef, useState } from "react";
// import {
//   GET_ALL_MESSAGE_ROUTE,
//   HOST,
// } from "../../../../../../../utils/constants";

// import { MdFolderZip } from "react-icons/md";
// import { IoMdArrowRoundDown } from "react-icons/io";
// import { IoCloseSharp } from "react-icons/io5";

// const MessageContainer = () => {
//   const scrollRef = useRef();
//   const {
//     selectedChatMessages,
//     userInfo,
//     selectedChatType,
//     selectedChatData,
//     setSelectedChatMessages,
//   } = useAppStore();

//   const[showImage,setShowImage]= useState(false);
//   const[imageURL,setImageURL]= useState(null);

//   const downloadFile = async (url) => {
//     const response = await apiClient.get(`${HOST}/${url}`, {
//       responseType: "blob",
//     });
//     const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = urlBlob;
//     link.setAttribute("download", url.split("/").pop());
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     window.URL.revokeObjectURL(urlBlob);
//   };
  

//   useEffect(() => {
//     const getMessages = async () => {
//       try {
//         const response = await apiClient.post(
//           GET_ALL_MESSAGE_ROUTE,
//           { id: selectedChatData._id },
//           { withCredentials: true }
//         );
//         if (response.data.message) {
//           setSelectedChatMessages(response.data.messages);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     if (selectedChatData._id) {
//       if (selectedChatType === "contact") {
//         getMessages();
//       }
//     }
//   }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [selectedChatMessages]);

//   const checkIfImage = (filePath) => {
//     const imageRegex =
//       /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
//     return imageRegex.test(filePath);
//   };

//   const renderDMMessages = (message) => (
//     <div
//       className={`${
//         message.sender === selectedChatData._id ? "text-left" : "text-right"
//       }`}
//     >
//       {message.messageType === "text" ? (
//         <div
//           className={`${
//             message.sender !== selectedChatData._id
//               ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
//               : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
//           } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
//         >
//           {message.content}
//         </div>
//       ) : message.messageType === "file" ? (
//         <div
//           className={`${
//             message.sender !== selectedChatData._id
//               ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
//               : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
//           } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
//         >
//           {checkIfImage(message.fileUrl) ? (
//             <div className="cursor-pointer"
            
//              onClick={()=>{
//               setShowImage(true);
//               setImageURL(message.fileUrl)
//              }} 
//             >
//               {/* //shi krna hai */}

//               <img
//                 // src={`${HOST}/uploads/files/${message.fileUrl}`}
//                 src={`${HOST}/uploads/file/${message.fileUrl}`}
//                 // src={`${HOST}${message.fileUrl}`}
//                 alt="sent file"
//                 height={300}
//                 width={300}
//                 className="rounded"
//               />
//             </div>
//           ) : (
//             <div className="flex items-center justify-center gap-4">
//               <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
//                 <MdFolderZip />
//               </span>
//               <span>{message.fileUrl.split("/").pop()}</span>
//               <span
//                 className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
//                 onClick={() => downloadFile(message.fileUrl)}
//               >
//                 <IoMdArrowRoundDown />
//               </span>
//             </div>

//             // <a
//             //   // href={`${HOST}/uploads/files/${message.fileUrl}`}
//             //   href={`${HOST}/uploads/file/${message.fileUrl}`}
//             //   // href={`${HOST}${message.fileUrl}`}

//             //   target="_blank"
//             //   rel="noopener noreferrer"
//             //   className="text-blue-400 underline"
//             // >
//             //   Download File
//             // </a>
//           )}
//         </div>
//       ) : (
//         <div className="text-gray-500 italic">Unsupported message type</div>
//       )}

//       <div className="text-xs text-gray-600 mt-1">
//         {moment(message.timestamp).isValid()
//           ? moment(message.timestamp).format("LT")
//           : "Unknown Time"}
//       </div>
//     </div>
//   );

//   const renderMessages = () => {
//     let lastDate = null;
//     return selectedChatMessages.map((message, index) => {
//       const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
//       const showDate = messageDate !== lastDate;
//       lastDate = messageDate;

//       return (
//         <div key={message._id || index}>
//           {showDate && (
//             <div className="text-center text-gray-500 my-2">
//               {moment(message.timestamp).isValid()
//                 ? moment(message.timestamp).format("LL")
//                 : "Unknown Date"}
//             </div>
//           )}
//           {selectedChatType === "contact" && renderDMMessages(message)}
//         </div>
//       );
//     });
//   };

//   return (
//     <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full flex flex-col">
//       {renderMessages()}
//       <div ref={scrollRef} />
//       {
//         showImage && <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vh] flex items-center justify-center backdrop-blur-lg flex-col"> 
//         <div>
//           <img src={`${HOST}/${imageURL}`} 
//           className="h-[80vh] w-full bg-cover"
//           />
//         </div>
//       <div className="flex gap-5 fixed top-0 mt-5">
//         <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
//         onClick={()=>downloadFile(imageURL)}
//         >
//           <IoMdArrowRoundDown/>
//         </button>



//         <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
//         onClick={()=>{
//           setShowImage(false);
//           setImageURL(null)
//         }}
//         >
//           <IoCloseSharp/>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MessageContainer;

