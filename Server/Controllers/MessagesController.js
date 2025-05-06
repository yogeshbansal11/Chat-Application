import Message from "../Modules/MessagesModule.js"
import Channel from "../Modules/ChannelModel.js";

import {mkdirSync, rename, renameSync} from 'fs'
import path from 'path';



// export const getChannelMessages = async (req, res) => {
//   try {
//     const { channelId } = req.params;

//     if (!channelId) {
//       return res.status(400).json({ error: "Channel ID is required" });
//     }

//     const channel = await Channel.findById(channelId).populate({
//       path: "messages",
//       populate: {
//         path: "sender",
//         select: "name _id", // optional: only pick needed fields
//       },
//     });

//     if (!channel) {
//       return res.status(404).json({ error: "Channel not found" });
//     }

//     res.status(200).json({ messages: channel.messages });
//   } catch (error) {
//     console.error("Error in getChannelMessages:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


export const getMessages = async (req, res, next) => {
  console.log('Received request to get messages');

  try {
      const user1 = req.userId;
      const user2 = req.body.id;

      if(!user1 || !user2){
        return res.status(400).send("Both user ID's are required !!")
      }
  
      const messages = await Message.find({
        $or:[
          {sender:user1, recipient: user2},
          {sender:user2, recipient: user1},
        ]
      }).sort({timestamp: 1})
      return res.status(200).json({messages})
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};


export const uploadFile = async (req, res, next) => {
  try {
    const filePath = `/uploads/files/${req.file.filename}`;

    if(!req.file){
      return res.status(400).send("file is required");
    }
    const date = Date.now();
    let fileDir = `uploads/files/${date}`
    let fileName = `${fileDir}/${req.file.originalname}`

    mkdirSync(fileDir,{recursive: true});
    renameSync(req.file.path, fileName);

      return res.status(200).json({filePath: fileName})
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};
