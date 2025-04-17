import { useAppStore } from "@/Store";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { HOST, REMOVE_PROFILE_IMAGE_ROUTES, UPDATE_PROFILE_ROUTE } from "../../../utils/constants";
import { GET_USER_INFO } from "../../../utils/constants";
import { ADD_PROFILE_IMAGE_ROUTE } from "../../../utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const { setUserInfo } = useAppStore();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.ProfileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`)
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("Firstname is required");
      return false;
    }
    if (!lastName) {
      toast.error("Lastname is required");
      return false;
    }
    return true;
  };

  // const saveChanges = async () => {
  //   // your save logic here
  //   if (validateProfile()) {
  //     // alert("success")
  //     try {
  //       const response = await apiClient.post(
  //         UPDATE_PROFILE_ROUTE,
  //         { firstName, lastName, color: selectedColor },
  //         { withCredentials: true }
  //       );

  //       if ((response.status === 200 || response.status === 201) && response.data) {
  //         setUserInfo({ ...response.data });
  //         toast.success("Profile update successfully.");
  //         navigate("/chat");
  //       }
  //     } catch (error) {
  //       console.error("Error updating profile:", error); // Log the error
  //       toast.error("Failed to update profile, please try again.");
  //     }
  //   }
  // };

  // const saveChanges = async () => {
  //   if (validateProfile()) {
  //     try {
  //       const response = await apiClient.post(
  //         UPDATE_PROFILE_ROUTE,
  //         { firstName, lastName, color: selectedColor },
  //         { withCredentials: true }
  //       );

  //       if (response.status === 200 || response.status === 201) {
  //         // ✅ Fetch fresh user info after update
  //         const userResponse = await apiClient.get(GET_USER_INFO, {
  //           withCredentials: true,
  //         });

  //         if (userResponse.status === 200 && userResponse.data.id) {
  //           setUserInfo(userResponse.data);
  //           toast.success("Profile updated successfully.");
  //           navigate("/chat");
  //         } else {
  //           toast.error("Failed to fetch updated profile info.");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error updating profile:", error);
  //       toast.error("Failed to update profile, please try again.");
  //     }
  //   }
  // };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );

        if (
          (response.status === 200 || response.status === 201) &&
          response.data
        ) {
          setUserInfo(response.data);
          toast.success("Profile updated successfully.");
          navigate("/chat");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile, please try again.");
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.ProfileSetup) {
      navigate("/chat");
    } else {
      toast("please setup navigate");
    }
  };
 

  //image lagane k lye :-
  const handleFileInputClick = () => {
    alert("open")
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log({file});
    if(file){
      const formData = new FormData();
      formData.append("profile-image",file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{
        withCredentials:true
      });
      if(response.status===200 && response.data.image){
        setUserInfo({...userInfo,image: response.data.image});
        toast.success("Image updated successfully !!")
      }
      // const reader = new FileReader();
      // reader.onload = ()=>{
      //   console.log(reader.result)
      //   setImage(reader.result);
      // }
      // reader.readAsDataURL(file)
    }
  };

  const handleDeleteImage = async () => {
    try{
      const response =  await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTES,{
        withCredentials: true,
      })
      if(response.status===200){
        // userInfo({...userInfo,image:null});
        setUserInfo({ ...userInfo, image: null });

        toast.success("Image removed successfully.");
        setImage(null)
      }
    }catch(error){
      console.log(error)
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack
            className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
            onClick={() => navigate("/chat")}
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Avatar rendering */}
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="User's profile picture"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {/* Display the first letter of firstName if available */}
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo?.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full ring-fuchsia-50"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jpg,.jpeg, .svg, .webp"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>

            <div className="w-full">
              <input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>

            <div className="w-full">
              <input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>

            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedColor(index)}
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                  ${selectedColor === index ? "outline outline-white/50 " : ""}
                    `}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center ">
        <Button
          className="h-16 w-1/2 bg-purple-700 hover:bg-purple-900 transition-all duration-300"
          onClick={saveChanges}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;
