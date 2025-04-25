import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTES,
} from "../../../../../../../utils/constants";
import { useAppStore } from "@/Store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";

const HOST = import.meta.env.VITE_SERVER_URL;

const CreateChannel = () => {
  const { setSelectedChatType, setSelectedChatData, addChannel } = useAppStore();
  const [newChannelModal, setNewChannelModal] = useState(false);
  // const [searchedContacts, setSearchedContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      setAllContacts(response.data.contacts);
    };
    getData();
  }, []);

  const handleCreateChannel = async () => {
    try{
      if(channelName.length>=0 && selectedContacts.length>0){

      
        const response = await apiClient.post(CREATE_CHANNEL_ROUTE,{
          name: channelName,
          members: selectedContacts.map((contact)=> contact.value),
        },{withCredentials:true});
        if(response.status===201){
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModal(false);
          addChannel(response.data.channel)
        }
      }
    }catch(error){
      console.log(error)
    }
    
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent
          aria-describedby=""
          className="bg-[#181920] border-none text-white w-[400px] h-[500px] flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for new channel.
            </DialogTitle>
          </DialogHeader>

          <div>
            <Input
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          
          <div>
            <MultipleSelector
            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
            defaultOptions={allContacts}
            placeholder="Search contacts"
            value={selectedContacts}
            onChange={setSelectedContacts}
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600">No results</p>
            }
            />
          </div>


          <div>
          <Button
            className="w-full bg-purple-500 hover:bg-pink-900 transition-all duration-300"
            onClick={handleCreateChannel}
          >
            Create Channel
          </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
