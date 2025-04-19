import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/Store";
import { HOST, LOGIN_ROUTE, LOGOUT_ROUTE } from "../../../../../../../utils/constants";
import { getColor } from "@/lib/utils";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api-client";

const ProfileInfo = () => {
  const { userInfo, resetUser,setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const LogOut = async () => {
    try {
      const response = await apiClient.post(LOGOUT_ROUTE,{},{withCredentials: true})

      if(response.status===200){
        navigate("/auth");
        setUserInfo(null)
      }

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center">
        <div className="w-12 h-12">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="User's profile picture"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg border flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName[0]
                  : userInfo.email
                  ? userInfo.email[0]
                  : "G"}
              </div>
            )}
          </Avatar>
        </div>
        <div className="text-white font-medium">
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : userInfo.email
            ? userInfo.email
            : "Guest"}
        </div>
      </div>

      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <FiEdit2
                className="text-purple-500 text-xl cursor-pointer"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <IoPowerSharp
                className="text-red-500 text-xl cursor-pointer"
                onClick={LogOut}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;




