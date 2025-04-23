import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTES } from "../../../../../../../utils/constants";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/Store";

const HOST = import.meta.env.VITE_SERVER_URL;

const CreateChannel  = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const ContactCard = ({ contact }) => {
    return (
      <div className="flex gap-3 items-center cursor-pointer" key={contact._id} onClick={() => selectNewContact(contact)}>
      
      
      
        <div className="w-12 h-12">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {contact.image ? (
              <AvatarImage
                src={`${HOST}/${contact.image}`}
                alt="User's profile picture"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg border flex items-center justify-center rounded-full ${getColor(
                  contact.color
                )}`}
              >
                {contact.firstName
                  ? contact.firstName[0]
                  : contact.email
                  ? contact.email[0]
                  : "G"}
              </div>
            )}
          </Avatar>
        </div>
        <div className="flex flex-col">
          <span>
            {contact.firstName && contact.lastName
              ? `${contact.firstName} ${contact.lastName}`
              : contact.email}
          </span>
          <span className="text-xs text-neutral-400">{contact.email}</span>
        </div>
      </div>
    );
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModal(false);
    setSelectedChatData(contact);
    setSelectedChatType("contact");
    setSearchedContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent aria-describedby=""  className="bg-[#181920] border-none text-white w-[400px] h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select a Contact</DialogTitle>
          </DialogHeader>

          <div>
            <Input
              placeholder="Search Contact"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>

          {searchedContacts.length > 0 ? (
            <ScrollArea className="h-[150px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => (
                  <ContactCard contact={contact} key={contact._id} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 mt-5 md:flex md:mt-0 flex-col justify-center items-center duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-3xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi <span className="text-purple-600">!</span> Search New
                  <span className="text-purple-500"> Contact</span>.
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
